'use client';

import * as React from 'react';
import { Copy, MoreHorizontal, Plus, Shield, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const roleTemplates = [
  { code: 'tenant_admin', name: 'Tenant Admin', description: 'Full access to all modules', usersCount: 2, isSystem: true, modules: ['*'] },
  { code: 'salesperson', name: 'Salesperson', description: 'Sales, CRM access', usersCount: 8, isSystem: true, modules: ['sales', 'crm', 'sales.customers'] },
  { code: 'sales_manager', name: 'Sales Manager', description: 'Sales team with approvals', usersCount: 2, isSystem: true, modules: ['sales (approve)', 'crm (approve)', 'reports'] },
  { code: 'accountant', name: 'Accountant', description: 'Full accounting access', usersCount: 3, isSystem: true, modules: ['accounting (admin)', 'sales (read)', 'procurement (read)'] },
  { code: 'finance_manager', name: 'Finance Manager', description: 'Full finance with approval', usersCount: 1, isSystem: true, modules: ['accounting (admin)', 'all (approve)'] },
  { code: 'hr_admin', name: 'HR Admin', description: 'Full HR management', usersCount: 2, isSystem: true, modules: ['hrms (admin)', 'documents (write)'] },
  { code: 'warehouse_supervisor', name: 'Warehouse Supervisor', description: 'Warehouse operations', usersCount: 4, isSystem: true, modules: ['inventory (approve)', 'inventory.wms (admin)'] },
  { code: 'warehouse_worker', name: 'Warehouse Worker', description: 'Basic warehouse access', usersCount: 12, isSystem: true, modules: ['inventory.stock', 'inventory.movements (write)'] },
  { code: 'production_manager', name: 'Production Manager', description: 'Plant operations', usersCount: 2, isSystem: true, modules: ['manufacturing (admin)', 'quality (approve)'] },
  { code: 'shop_operator', name: 'Shop Floor Operator', description: 'Operator terminal', usersCount: 28, isSystem: true, modules: ['manufacturing.shopfloor (write)', 'quality.inspections (write)'] },
  { code: 'quality_inspector', name: 'Quality Inspector', description: 'Inspections and NCRs', usersCount: 4, isSystem: true, modules: ['quality.inspections (write)', 'quality.ncr (write)'] },
  { code: 'maintenance_tech', name: 'Maintenance Technician', description: 'Asset maintenance', usersCount: 6, isSystem: true, modules: ['assets (write)'] },
  { code: 'procurement_officer', name: 'Procurement Officer', description: 'Vendor & PO management', usersCount: 3, isSystem: true, modules: ['procurement (write)', 'procurement.vendors (write)'] },
  { code: 'project_manager', name: 'Project Manager', description: 'Project lifecycle', usersCount: 4, isSystem: true, modules: ['projects (admin)', 'documents (write)'] },
  { code: 'customer_service_agent', name: 'Customer Service Agent', description: 'Support tickets', usersCount: 5, isSystem: true, modules: ['service (write)', 'sales.customers (read)'] },
  { code: 'cashier', name: 'Cashier', description: 'POS terminal', usersCount: 12, isSystem: true, modules: ['sales.pos (write)', 'sales.customers (read)'] },
  { code: 'custom_eng_lead', name: 'Engineering Lead (Custom)', description: 'Custom role for engineering leadership', usersCount: 1, isSystem: false, modules: ['projects (admin)', 'hrms (read)', 'reports (read)'] },
];

export default function RolesPage() {
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Roles"
        description="Role templates that bundle a set of module permissions. Apply roles to users for fast permission assignment."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" /> New role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create custom role</DialogTitle>
                <DialogDescription>Bundle a set of module permissions. Apply to users for fast assignment.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Role name</Label>
                  <Input placeholder="e.g., Regional Manager" />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the role's responsibilities..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button>Create role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {roleTemplates.map((role) => (
          <Card key={role.code}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.name}</span>
                      {role.isSystem && <Badge variant="outline" className="text-2xs">System</Badge>}
                      {!role.isSystem && <Badge variant="soft" className="text-2xs">Custom</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {role.modules.slice(0, 3).map((m) => (
                        <Badge key={m} variant="outline" className="text-2xs">{m}</Badge>
                      ))}
                      {role.modules.length > 3 && (
                        <Badge variant="outline" className="text-2xs">+{role.modules.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit permissions</DropdownMenuItem>
                    <DropdownMenuItem>View users with role</DropdownMenuItem>
                    <DropdownMenuItem><Copy className="size-3.5" /> Clone</DropdownMenuItem>
                    {!role.isSystem && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><Trash2 className="size-3.5" /> Delete</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'} have this role
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
