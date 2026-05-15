import type { ChatChannel, ChatMessage, ChatUser } from './types';

export const sampleUsers: ChatUser[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@acme.com', status: 'online', title: 'Sales Manager' },
  { id: 'u2', name: 'Marcus Rodriguez', email: 'marcus@acme.com', status: 'online', title: 'CTO' },
  { id: 'u3', name: 'Aisha Patel', email: 'aisha@acme.com', status: 'busy', title: 'CFO' },
  { id: 'u4', name: 'Jake Thompson', email: 'jake@acme.com', status: 'online', title: 'Operations' },
  { id: 'u5', name: 'Emma Williams', email: 'emma@acme.com', status: 'away', title: 'Marketing' },
  { id: 'u6', name: 'Liu Wei', email: 'liu@acme.com', status: 'online', title: 'Engineering' },
  { id: 'u7', name: 'Diego Santos', email: 'diego@acme.com', status: 'offline', title: 'Support Lead' },
  { id: 'u8', name: 'Priya Sharma', email: 'priya@acme.com', status: 'online', title: 'HR Director' },
  { id: 'me', name: 'You', email: 'you@acme.com', status: 'online', title: 'Founder' },
];

export const sampleChannels: ChatChannel[] = [
  { id: 'c1', name: 'general', slug: 'general', type: 'public', description: 'Company-wide announcements', memberCount: 142, unread: 0, hasMention: false, isMuted: false, isPinned: true, lastMessageAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), lastMessagePreview: 'Welcome to the team, everyone!' },
  { id: 'c2', name: 'announcements', slug: 'announcements', type: 'announcement', description: 'Official announcements', memberCount: 142, unread: 1, hasMention: false, isMuted: false, isPinned: true, lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), lastMessagePreview: '📣 New office opening' },
  { id: 'c3', name: 'sales', slug: 'sales', type: 'public', description: 'Sales team discussions', memberCount: 24, unread: 12, hasMention: true, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), lastMessagePreview: 'Acme just closed Q4! 🎉' },
  { id: 'c4', name: 'engineering', slug: 'engineering', type: 'public', description: 'Eng team channel', memberCount: 38, unread: 4, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), lastMessagePreview: 'Deploy went out smoothly' },
  { id: 'c5', name: 'production', slug: 'production', type: 'public', description: 'Manufacturing floor', memberCount: 56, unread: 0, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), lastMessagePreview: 'Line 3 OEE back to 87%' },
  { id: 'c6', name: 'random', slug: 'random', type: 'public', description: 'Non-work talk', memberCount: 142, unread: 7, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), lastMessagePreview: 'Best lunch spot near downtown?' },
  { id: 'c7', name: 'leadership', slug: 'leadership', type: 'private', description: 'C-suite only', memberCount: 6, unread: 2, hasMention: true, isMuted: false, isPinned: true, lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), lastMessagePreview: 'Board prep doc attached' },
  { id: 'c8', name: 'quality', slug: 'quality', type: 'public', description: 'QA & QC', memberCount: 18, unread: 0, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), lastMessagePreview: 'NCR-2089 closed' },
  { id: 'dm1', name: 'Sarah Chen', slug: 'sarah-chen', type: 'dm', memberCount: 2, unread: 3, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), lastMessagePreview: "Got a minute to chat about Q1?" },
  { id: 'dm2', name: 'Marcus Rodriguez', slug: 'marcus-rodriguez', type: 'dm', memberCount: 2, unread: 0, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), lastMessagePreview: 'Reviewed your PRD - solid work' },
  { id: 'dm3', name: 'Aisha Patel', slug: 'aisha-patel', type: 'dm', memberCount: 2, unread: 1, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), lastMessagePreview: "Budget approved for next quarter" },
  { id: 'gdm1', name: 'Founders + Aisha', slug: 'founders-aisha', type: 'group_dm', memberCount: 4, unread: 0, hasMention: false, isMuted: false, isPinned: false, lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), lastMessagePreview: 'Sounds good — let\'s sync tomorrow' },
];

export function generateSampleMessages(channelId: string): ChatMessage[] {
  const base = Date.now();
  const me = sampleUsers.find((u) => u.id === 'me')!;
  const sarah = sampleUsers.find((u) => u.id === 'u1')!;
  const marcus = sampleUsers.find((u) => u.id === 'u2')!;
  const aisha = sampleUsers.find((u) => u.id === 'u3')!;
  const jake = sampleUsers.find((u) => u.id === 'u4')!;
  const emma = sampleUsers.find((u) => u.id === 'u5')!;

  return [
    {
      id: 'm1',
      channelId,
      author: sarah,
      body: "Morning team! Just wrapped up the call with Acme Industries. They're going to expand the contract to all three regions. 🎉",
      createdAt: new Date(base - 1000 * 60 * 60 * 4).toISOString(),
      reactions: [
        { emoji: '🎉', count: 8, reactedByMe: true },
        { emoji: '🔥', count: 5 },
        { emoji: '💯', count: 3 },
      ],
      type: 'text',
    },
    {
      id: 'm2',
      channelId,
      author: marcus,
      body: "Incredible work Sarah! What's the timeline for rollout? Engineering wants to size capacity needs.",
      createdAt: new Date(base - 1000 * 60 * 60 * 4 + 1000 * 60 * 5).toISOString(),
      reactions: [{ emoji: '👍', count: 2 }],
      type: 'text',
    },
    {
      id: 'm3',
      channelId,
      author: sarah,
      body: "Phase 1 starts Feb 15 (North America), Phase 2 in April (EMEA), Phase 3 in June (APAC). Full ramp by end of Q3.",
      createdAt: new Date(base - 1000 * 60 * 60 * 4 + 1000 * 60 * 7).toISOString(),
      threadReplyCount: 5,
      threadParticipants: [marcus, aisha, jake],
      threadLastReplyAt: new Date(base - 1000 * 60 * 60).toISOString(),
      type: 'text',
      relatedRecord: { type: 'opportunity', id: 'OPP-2089', name: 'Acme Expansion' },
    },
    {
      id: 'm4',
      channelId,
      author: aisha,
      body: "Beautiful. I'll update the forecast model. Should bump us 18% above plan for Q3.",
      createdAt: new Date(base - 1000 * 60 * 60 * 3).toISOString(),
      type: 'text',
    },
    {
      id: 'm5',
      channelId,
      author: jake,
      body: 'Heads up — Line 4 is back online after the calibration. OEE jumped to 91.2% in the last hour. 📈',
      createdAt: new Date(base - 1000 * 60 * 60 * 2).toISOString(),
      type: 'text',
      reactions: [{ emoji: '🚀', count: 4 }],
    },
    {
      id: 'm6',
      channelId,
      author: emma,
      body: "Quick win on the landing page test — variant B is converting 23% higher. Going to roll it out as the default.",
      createdAt: new Date(base - 1000 * 60 * 90).toISOString(),
      type: 'text',
    },
    {
      id: 'm7',
      channelId,
      author: me,
      body: "Love it. Make sure we capture the learnings in the wiki?",
      createdAt: new Date(base - 1000 * 60 * 85).toISOString(),
      type: 'text',
    },
    {
      id: 'm8',
      channelId,
      author: emma,
      body: "On it — adding screenshots and the funnel data.",
      createdAt: new Date(base - 1000 * 60 * 80).toISOString(),
      attachments: [
        {
          id: 'a1',
          type: 'image',
          url: '/images/sample-funnel.png',
          name: 'landing-page-funnel.png',
          size: 245000,
          width: 800,
          height: 600,
        },
      ],
      type: 'text',
    },
    {
      id: 'm9',
      channelId,
      author: marcus,
      body: 'I started a quick voice note about the architecture decision for the new microservice 🎙️',
      createdAt: new Date(base - 1000 * 60 * 45).toISOString(),
      type: 'voice',
      voiceNote: {
        durationSeconds: 47,
        transcript: 'OK so for the new service I am thinking we go with the gateway pattern, separate read and write models, and use Redis for the session cache. Want to make sure we are not introducing too much complexity though...',
        waveform: [3, 5, 8, 12, 18, 22, 25, 28, 26, 24, 20, 18, 22, 26, 30, 28, 24, 18, 14, 10, 8, 6, 9, 14, 18, 22, 24, 22, 18, 14, 10, 6, 4, 8, 12, 16, 18, 16, 12, 8],
      },
    },
    {
      id: 'm10',
      channelId,
      author: sarah,
      body: '@channel quick update — Acme just signed the order form for the expansion. PO-2089 will be in your inbox shortly @aisha',
      createdAt: new Date(base - 1000 * 60 * 20).toISOString(),
      mentions: ['u3'],
      type: 'text',
      reactions: [
        { emoji: '🎉', count: 6, reactedByMe: true },
        { emoji: '💸', count: 4 },
      ],
    },
    {
      id: 'm11',
      channelId,
      author: aisha,
      body: 'Booking it. 🙏',
      createdAt: new Date(base - 1000 * 60 * 15).toISOString(),
      type: 'text',
    },
    {
      id: 'm12',
      channelId,
      author: me,
      body: 'Welcome to the team, everyone! Excited about the quarter ahead.',
      createdAt: new Date(base - 1000 * 60 * 5).toISOString(),
      type: 'text',
    },
  ];
}
