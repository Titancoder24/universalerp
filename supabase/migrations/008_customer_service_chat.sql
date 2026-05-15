-- =============================================================================
-- Universal ERP - Customer Service / Chat / Communications (Migration 008)
-- =============================================================================
-- Helpdesk (tickets, SLAs, KB), team chat (channels, partitioned messages,
-- reactions, voice, calls, typing), and unified notifications.

-- ============================================================ SUPPORT TICKETS
create table public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text not null,
  subject text not null,
  description text,
  customer_id uuid references public.customers(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  category text,
  subcategory text,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','on_hold','waiting_customer','resolved','closed','cancelled')),
  assigned_to uuid references public.user_profiles(id) on delete set null,
  team_id uuid,
  channel text default 'portal' check (channel in ('email','portal','phone','chat','in_app','social','api')),
  source text,
  related_order_id uuid references public.sales_orders(id) on delete set null,
  related_invoice_id uuid references public.invoices(id) on delete set null,
  sla_policy_id uuid,
  sla_target_first_response_at timestamptz,
  sla_target_resolve_at timestamptz,
  first_response_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  reopened_at timestamptz,
  satisfaction_rating int check (satisfaction_rating between 1 and 5),
  satisfaction_comment text,
  sla_breached boolean default false,
  tags text[] default array[]::text[],
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, number)
);
create index support_tickets_tenant_idx on public.support_tickets (tenant_id);
create index support_tickets_customer_idx on public.support_tickets (customer_id) where customer_id is not null;
create index support_tickets_status_idx on public.support_tickets (tenant_id, status);
create index support_tickets_assigned_idx on public.support_tickets (assigned_to) where assigned_to is not null;
create index support_tickets_priority_idx on public.support_tickets (tenant_id, priority, status);
create index support_tickets_sla_idx on public.support_tickets (tenant_id, sla_target_resolve_at) where status not in ('resolved','closed','cancelled');
create trigger trg_support_tickets_updated_at before update on public.support_tickets
  for each row execute function public.tg_set_updated_at();

-- ============================================================ SLA POLICIES
create table public.sla_policies (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  priority text check (priority in ('low','medium','high','urgent') or priority is null),
  customer_tier text,
  business_hours_only boolean default true,
  first_response_hours numeric(8,2),
  resolution_hours numeric(8,2),
  is_default boolean default false,
  is_active boolean default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sla_policies_tenant_idx on public.sla_policies (tenant_id);
create index sla_policies_default_idx on public.sla_policies (tenant_id, is_default) where is_default = true;
create trigger trg_sla_policies_updated_at before update on public.sla_policies
  for each row execute function public.tg_set_updated_at();

-- Now hook support_tickets.sla_policy_id back to sla_policies.
alter table public.support_tickets
  add constraint support_tickets_sla_fk foreign key (sla_policy_id) references public.sla_policies(id) on delete set null;

-- ============================================================ TICKET MESSAGES
create table public.ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  body text not null,
  is_internal boolean default false,
  is_response boolean default true,
  attachments jsonb default '[]'::jsonb,
  in_reply_to_id uuid references public.ticket_messages(id) on delete set null,
  email_message_id text,
  channel text,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);
create index ticket_messages_ticket_idx on public.ticket_messages (ticket_id, created_at);
create index ticket_messages_tenant_idx on public.ticket_messages (tenant_id);
create index ticket_messages_user_idx on public.ticket_messages (user_id) where user_id is not null;

-- ============================================================ KNOWLEDGE ARTICLES
create table public.knowledge_articles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  number text,
  title text not null,
  slug text not null,
  body text,
  excerpt text,
  category text,
  subcategory text,
  tags text[] default array[]::text[],
  is_public boolean default false,
  published_at timestamptz,
  expires_at timestamptz,
  view_count int default 0,
  helpful_count int default 0,
  not_helpful_count int default 0,
  helpful_ratio numeric(5,2) generated always as (
    case when (helpful_count + not_helpful_count) = 0 then null
    else (helpful_count * 100.0) / (helpful_count + not_helpful_count) end
  ) stored,
  author_id uuid references public.user_profiles(id) on delete set null,
  reviewer_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','review','published','archived','scheduled')),
  related_article_ids uuid[] default array[]::uuid[],
  attachments jsonb default '[]'::jsonb,
  meta_title text,
  meta_description text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index knowledge_articles_tenant_idx on public.knowledge_articles (tenant_id);
create index knowledge_articles_status_idx on public.knowledge_articles (tenant_id, status);
create index knowledge_articles_published_idx on public.knowledge_articles (tenant_id, published_at desc) where status = 'published';
create index knowledge_articles_title_trgm on public.knowledge_articles using gin (title gin_trgm_ops);
create index knowledge_articles_public_idx on public.knowledge_articles (tenant_id, is_public) where is_public = true;
create trigger trg_knowledge_articles_updated_at before update on public.knowledge_articles
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CANNED RESPONSES
create table public.canned_responses (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  body text not null,
  category text,
  owner_id uuid references public.user_profiles(id) on delete set null,
  is_shared boolean default true,
  is_active boolean default true,
  usage_count int default 0,
  tags text[] default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index canned_responses_tenant_idx on public.canned_responses (tenant_id);
create index canned_responses_owner_idx on public.canned_responses (owner_id) where owner_id is not null;
create trigger trg_canned_responses_updated_at before update on public.canned_responses
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT CHANNELS
create table public.chat_channels (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  topic text,
  type text not null default 'public' check (type in ('public','private','announcement','dm','group_dm')),
  created_by uuid references public.user_profiles(id) on delete set null,
  archived boolean default false,
  archived_at timestamptz,
  archived_by uuid references public.user_profiles(id) on delete set null,
  last_message_at timestamptz,
  member_count int default 0,
  message_count int default 0,
  custom_emoji_set text,
  is_default boolean default false,
  is_read_only boolean default false,
  settings jsonb default '{}'::jsonb,
  related_record_type text,
  related_record_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index chat_channels_tenant_idx on public.chat_channels (tenant_id);
create index chat_channels_type_idx on public.chat_channels (tenant_id, type);
create index chat_channels_last_msg_idx on public.chat_channels (tenant_id, last_message_at desc) where archived = false;
create index chat_channels_related_idx on public.chat_channels (related_record_type, related_record_id) where related_record_id is not null;
create trigger trg_chat_channels_updated_at before update on public.chat_channels
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT CHANNEL MEMBERS
create table public.chat_channel_members (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','guest')),
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  last_read_message_id uuid,
  unread_count int default 0,
  is_muted boolean default false,
  muted_until timestamptz,
  is_starred boolean default false,
  notification_level text default 'all' check (notification_level in ('all','mentions','none')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (channel_id, user_id)
);
create index chat_channel_members_channel_idx on public.chat_channel_members (channel_id);
create index chat_channel_members_user_idx on public.chat_channel_members (user_id);
create index chat_channel_members_tenant_idx on public.chat_channel_members (tenant_id);
create trigger trg_chat_channel_members_updated_at before update on public.chat_channel_members
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT MESSAGES (partitioned by tenant_id hash)
create table public.chat_messages (
  id uuid not null default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  parent_message_id uuid,
  thread_id uuid,
  user_id uuid references public.user_profiles(id) on delete set null,
  body text,
  blocks jsonb default '[]'::jsonb,
  attachments jsonb default '[]'::jsonb,
  edited_at timestamptz,
  edit_count int default 0,
  pinned boolean default false,
  pinned_by uuid references public.user_profiles(id) on delete set null,
  pinned_at timestamptz,
  mentions uuid[] default array[]::uuid[],
  mention_everyone boolean default false,
  reactions jsonb default '{}'::jsonb,
  reply_count int default 0,
  type text not null default 'text' check (type in ('text','system','call','file','voice_note','poll','event','card')),
  related_record_type text,
  related_record_id uuid,
  deleted_at timestamptz,
  deleted_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, id)
) partition by hash (tenant_id);

-- Create 8 hash partitions
create table public.chat_messages_p0 partition of public.chat_messages for values with (modulus 8, remainder 0);
create table public.chat_messages_p1 partition of public.chat_messages for values with (modulus 8, remainder 1);
create table public.chat_messages_p2 partition of public.chat_messages for values with (modulus 8, remainder 2);
create table public.chat_messages_p3 partition of public.chat_messages for values with (modulus 8, remainder 3);
create table public.chat_messages_p4 partition of public.chat_messages for values with (modulus 8, remainder 4);
create table public.chat_messages_p5 partition of public.chat_messages for values with (modulus 8, remainder 5);
create table public.chat_messages_p6 partition of public.chat_messages for values with (modulus 8, remainder 6);
create table public.chat_messages_p7 partition of public.chat_messages for values with (modulus 8, remainder 7);

create index chat_messages_channel_idx on public.chat_messages (channel_id, created_at desc);
create index chat_messages_tenant_idx on public.chat_messages (tenant_id, created_at desc);
create index chat_messages_user_idx on public.chat_messages (user_id) where user_id is not null;
create index chat_messages_thread_idx on public.chat_messages (thread_id) where thread_id is not null;
create index chat_messages_parent_idx on public.chat_messages (parent_message_id) where parent_message_id is not null;
create index chat_messages_pinned_idx on public.chat_messages (channel_id) where pinned = true;
create trigger trg_chat_messages_updated_at before update on public.chat_messages
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT MESSAGE REACTIONS
create table public.chat_message_reactions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  message_id uuid not null,
  channel_id uuid references public.chat_channels(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, message_id, user_id, emoji)
);
create index chat_message_reactions_msg_idx on public.chat_message_reactions (message_id);
create index chat_message_reactions_tenant_idx on public.chat_message_reactions (tenant_id);
create index chat_message_reactions_user_idx on public.chat_message_reactions (user_id);

-- ============================================================ CHAT VOICE NOTES
create table public.chat_voice_notes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  message_id uuid not null,
  channel_id uuid references public.chat_channels(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  duration_seconds numeric(8,2),
  transcript text,
  transcript_language text,
  audio_url text,
  waveform_data jsonb,
  file_size_bytes bigint,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index chat_voice_notes_msg_idx on public.chat_voice_notes (message_id);
create index chat_voice_notes_tenant_idx on public.chat_voice_notes (tenant_id);
create trigger trg_chat_voice_notes_updated_at before update on public.chat_voice_notes
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT CALLS
create table public.chat_calls (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_id uuid references public.chat_channels(id) on delete cascade,
  started_by uuid references public.user_profiles(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int generated always as (
    case when ended_at is null then null
    else extract(epoch from (ended_at - started_at))::int end
  ) stored,
  type text not null default 'voice' check (type in ('voice','video','screen_share')),
  status text not null default 'in_progress' check (status in ('ringing','in_progress','completed','missed','declined','failed','cancelled')),
  participant_ids uuid[] default array[]::uuid[],
  participant_count int default 0,
  recording_enabled boolean default false,
  recording_url text,
  transcript_url text,
  summary text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index chat_calls_tenant_idx on public.chat_calls (tenant_id);
create index chat_calls_channel_idx on public.chat_calls (channel_id) where channel_id is not null;
create index chat_calls_started_idx on public.chat_calls (tenant_id, started_at desc);
create index chat_calls_started_by_idx on public.chat_calls (started_by) where started_by is not null;
create trigger trg_chat_calls_updated_at before update on public.chat_calls
  for each row execute function public.tg_set_updated_at();

-- ============================================================ CHAT TYPING (ephemeral)
create table public.chat_typing (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 seconds'),
  unique (channel_id, user_id)
);
create index chat_typing_channel_idx on public.chat_typing (channel_id);
create index chat_typing_expires_idx on public.chat_typing (expires_at);

-- ============================================================ NOTIFICATIONS
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  payload jsonb default '{}'::jsonb,
  link text,
  icon text,
  severity text default 'info' check (severity in ('info','success','warning','error','critical')),
  channel text not null default 'in_app' check (channel in ('in_app','push','email','sms','webhook')),
  sender_user_id uuid references public.user_profiles(id) on delete set null,
  related_record_type text,
  related_record_id uuid,
  read_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_tenant_idx on public.notifications (tenant_id);
create index notifications_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;
create index notifications_channel_idx on public.notifications (channel, delivered_at);
create index notifications_related_idx on public.notifications (related_record_type, related_record_id) where related_record_id is not null;
create trigger trg_notifications_updated_at before update on public.notifications
  for each row execute function public.tg_set_updated_at();

-- ============================================================ RLS
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.sla_policies enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.canned_responses enable row level security;
alter table public.chat_channels enable row level security;
alter table public.chat_channel_members enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_message_reactions enable row level security;
alter table public.chat_voice_notes enable row level security;
alter table public.chat_calls enable row level security;
alter table public.chat_typing enable row level security;
alter table public.notifications enable row level security;

create policy support_tickets_rw on public.support_tickets for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy ticket_messages_rw on public.ticket_messages for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy sla_policies_rw on public.sla_policies for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy knowledge_articles_rw on public.knowledge_articles for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy canned_responses_rw on public.canned_responses for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_channels_rw on public.chat_channels for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_channel_members_rw on public.chat_channel_members for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_messages_rw on public.chat_messages for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_message_reactions_rw on public.chat_message_reactions for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_voice_notes_rw on public.chat_voice_notes for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_calls_rw on public.chat_calls for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy chat_typing_rw on public.chat_typing for all using (public.has_tenant_access(tenant_id)) with check (public.has_tenant_access(tenant_id));
create policy notifications_self on public.notifications for all using (
  user_id = auth.uid() or public.is_super_admin()
) with check (
  user_id = auth.uid() or public.is_super_admin() or public.has_tenant_access(tenant_id)
);
