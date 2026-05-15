'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { slug as slugify } from '@/lib/utils';

export interface CreateChannelInput {
  name: string;
  type: 'public' | 'private' | 'announcement';
  description?: string;
  emoji?: string;
  initial_members?: string[];
}

export async function createChannel(input: CreateChannelInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const channelSlug = slugify(input.name);

  const { data: channel, error } = await supabase
    .from('chat_channels')
    .insert({
      tenant_id: session.tenant.id,
      name: input.name,
      slug: channelSlug,
      type: input.type,
      description: input.description,
      created_by: session.user.id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Add creator as owner
  await supabase.from('chat_channel_members').insert({
    tenant_id: session.tenant.id,
    channel_id: channel.id,
    user_id: session.user.id,
    role: 'owner',
    joined_at: new Date().toISOString(),
  });

  // Add initial members
  if (input.initial_members?.length) {
    await supabase.from('chat_channel_members').insert(
      input.initial_members.map((user_id) => ({
        tenant_id: session.tenant.id,
        channel_id: channel.id,
        user_id,
        role: 'member',
        joined_at: new Date().toISOString(),
      })),
    );
  }

  revalidatePath('/app/chat');
  return channel;
}

export interface SendMessageInput {
  channel_id: string;
  body: string;
  blocks?: any[];
  attachments?: any[];
  mentions?: string[];
  parent_message_id?: string;
  related_record_type?: string;
  related_record_id?: string;
  scheduled_for?: string;
}

export async function sendMessage(input: SendMessageInput) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      tenant_id: session.tenant.id,
      channel_id: input.channel_id,
      parent_message_id: input.parent_message_id,
      user_id: session.user.id,
      body: input.body,
      blocks: input.blocks ?? [],
      attachments: input.attachments ?? [],
      mentions: input.mentions ?? [],
      reactions: {},
      type: 'text',
      related_record_type: input.related_record_type,
      related_record_id: input.related_record_id,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Update channel's last message timestamp
  await supabase
    .from('chat_channels')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', input.channel_id);

  return message;
}

export async function addReaction(messageId: string, emoji: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { data: existing } = await supabase
    .from('chat_message_reactions')
    .select('id')
    .eq('message_id', messageId)
    .eq('user_id', session.user.id)
    .eq('emoji', emoji)
    .single();

  if (existing) {
    await supabase.from('chat_message_reactions').delete().eq('id', existing.id);
  } else {
    await supabase.from('chat_message_reactions').insert({
      tenant_id: session.tenant.id,
      message_id: messageId,
      user_id: session.user.id,
      emoji,
    });
  }
}

export async function editMessage(messageId: string, newBody: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('chat_messages')
    .update({
      body: newBody,
      edited_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .eq('user_id', session.user.id);
  if (error) throw new Error(error.message);
}

export async function deleteMessage(messageId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId)
    .eq('user_id', session.user.id);
  if (error) throw new Error(error.message);
}

export async function markChannelRead(channelId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('chat_channel_members')
    .update({ last_read_at: new Date().toISOString() })
    .eq('channel_id', channelId)
    .eq('user_id', session.user.id);
}

export async function joinChannel(channelId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  await supabase.from('chat_channel_members').insert({
    tenant_id: session.tenant.id,
    channel_id: channelId,
    user_id: session.user.id,
    role: 'member',
    joined_at: new Date().toISOString(),
  });

  revalidatePath('/app/chat');
}

export async function leaveChannel(channelId: string) {
  const session = await requireSession();
  const supabase = await getSupabaseServerClient();

  await supabase
    .from('chat_channel_members')
    .delete()
    .eq('channel_id', channelId)
    .eq('user_id', session.user.id);

  revalidatePath('/app/chat');
}
