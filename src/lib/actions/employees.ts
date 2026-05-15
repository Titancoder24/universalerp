'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { nextDocumentNumber } from './numbering';

export interface CreateEmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  personal_email?: string;
  phone?: string;
  mobile?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  nationality?: string;
  national_id?: string;
  emergency_contact?: any;
  address?: any;
  department_id?: string;
  branch_id?: string;
  designation: string;
  job_title: string;
  manager_employee_id?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern' | 'consultant' | 'temporary';
  work_arrangement?: 'onsite' | 'remote' | 'hybrid';
  hire_date: string;
  base_salary_cents: number;
  base_salary_currency?: string;
  pay_frequency?: 'weekly' | 'biweekly' | 'monthly' | 'semimonthly' | 'quarterly' | 'annually';
  bank_details?: any;
  documents?: any[];
  skills?: string[];
  create_user_account?: boolean;
}

export async function createEmployee(input: CreateEmployeeInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const employeeCode = await nextDocumentNumber(session.tenant.id, 'employee');

  // Optionally create a user account first
  let userId: string | null = null;
  if (input.create_user_account) {
    const { data: userData } = await supabase.auth.admin.inviteUserByEmail(input.email, {
      data: {
        full_name: `${input.first_name} ${input.last_name}`,
        tenant_id: session.tenant.id,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    });
    if (userData?.user) {
      userId = userData.user.id;
      await supabase.from('user_profiles').upsert({
        id: userId,
        email: input.email,
        full_name: `${input.first_name} ${input.last_name}`,
        first_name: input.first_name,
        last_name: input.last_name,
      });
      await supabase.from('memberships').insert({
        tenant_id: session.tenant.id,
        user_id: userId,
        role: 'employee',
        status: 'pending',
        department_id: input.department_id,
        branch_id: input.branch_id,
        invited_at: new Date().toISOString(),
      });
    }
  }

  const { data: employee, error } = await supabase
    .from('employees')
    .insert({
      tenant_id: session.tenant.id,
      employee_code: employeeCode,
      user_id: userId,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      personal_email: input.personal_email,
      phone: input.phone,
      mobile: input.mobile,
      date_of_birth: input.date_of_birth,
      gender: input.gender,
      nationality: input.nationality,
      national_id: input.national_id,
      emergency_contact: input.emergency_contact,
      address: input.address,
      department_id: input.department_id,
      branch_id: input.branch_id,
      designation: input.designation,
      job_title: input.job_title,
      manager_employee_id: input.manager_employee_id,
      employment_type: input.employment_type,
      work_arrangement: input.work_arrangement ?? 'onsite',
      hire_date: input.hire_date,
      base_salary_cents: input.base_salary_cents,
      base_salary_currency: input.base_salary_currency ?? session.tenant.default_currency,
      pay_frequency: input.pay_frequency ?? 'monthly',
      bank_details: input.bank_details,
      documents: input.documents ?? [],
      skills: input.skills ?? [],
      status: 'active',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/app/hr/employees');
  return employee;
}

export async function checkIn(input: { employee_id: string; lat?: number; lng?: number; photo_url?: string }) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('attendance_records')
    .select('id, check_in_at')
    .eq('employee_id', input.employee_id)
    .eq('date', today)
    .single();

  if (existing?.check_in_at) {
    throw new Error('Already checked in today');
  }

  const checkInTime = new Date().toISOString();

  if (existing) {
    const { error } = await supabase
      .from('attendance_records')
      .update({
        check_in_at: checkInTime,
        check_in_lat: input.lat,
        check_in_lng: input.lng,
        check_in_photo_url: input.photo_url,
        source: 'pwa',
      })
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('attendance_records')
      .insert({
        tenant_id: session.tenant.id,
        employee_id: input.employee_id,
        date: today,
        check_in_at: checkInTime,
        check_in_lat: input.lat,
        check_in_lng: input.lng,
        check_in_photo_url: input.photo_url,
        status: 'present',
        source: 'pwa',
      });
    if (error) throw new Error(error.message);
  }

  revalidatePath('/app/hr/attendance');
}

export async function checkOut(input: { employee_id: string; lat?: number; lng?: number; photo_url?: string }) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('attendance_records')
    .select('id, check_in_at')
    .eq('employee_id', input.employee_id)
    .eq('date', today)
    .single();

  if (!existing?.check_in_at) {
    throw new Error('Must check in first');
  }

  const checkOutTime = new Date();
  const checkInTime = new Date(existing.check_in_at);
  const totalMinutes = Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000);

  const { error } = await supabase
    .from('attendance_records')
    .update({
      check_out_at: checkOutTime.toISOString(),
      check_out_lat: input.lat,
      check_out_lng: input.lng,
      check_out_photo_url: input.photo_url,
      total_minutes: totalMinutes,
    })
    .eq('id', existing.id);
  if (error) throw new Error(error.message);

  revalidatePath('/app/hr/attendance');
}

export async function requestLeave(input: {
  employee_id: string;
  leave_type_id: string;
  from_date: string;
  to_date: string;
  reason?: string;
}) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const days = Math.ceil(
    (new Date(input.to_date).getTime() - new Date(input.from_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const number = await nextDocumentNumber(session.tenant.id, 'leave_request');

  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      tenant_id: session.tenant.id,
      number,
      employee_id: input.employee_id,
      leave_type_id: input.leave_type_id,
      from_date: input.from_date,
      to_date: input.to_date,
      days,
      reason: input.reason,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/app/hr/leave');
  return data;
}
