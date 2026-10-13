import { useMemo, useState } from 'react';
import {
  Buildings2,
  CalendarMark,
  Widget,
  Chart,
  ChecklistMinimalistic,
  Sale,
  Letter,
  Paperclip,
  Inbox,
  PhoneCalling,
  NotesMinimalistic,
} from '@solar-icons/react';
import { SlidingTabs, useTabDirection, type SlidingTabItem } from '@/components/ui/SlidingTabs';
import type { IndividualGuestProfile } from '../data/individualGuestProfiles';

const TABS: SlidingTabItem[] = [
  { id: 'all', label: 'All', icon: Widget },
  { id: 'companies', label: 'Companies', icon: Buildings2 },
  { id: 'events', label: 'Events', icon: CalendarMark },
  { id: 'sales', label: 'Sales Activities', icon: Chart },
  { id: 'todo', label: 'Things To Do', icon: ChecklistMinimalistic },
  { id: 'marcom', label: 'Marcom Activities', icon: Sale },
  { id: 'emails', label: 'Emails', icon: Letter },
  { id: 'attachments', label: 'Attachments', icon: Paperclip },
  { id: 'marketing', label: 'Email Marketing', icon: Inbox },
  { id: 'calls', label: 'Calls', icon: PhoneCalling },
  { id: 'notes', label: 'Notes', icon: NotesMinimalistic },
];

const TAB_IDS = TABS.map((t) => t.id);

interface FeedItem {
  type: string;
  title: string;
  desc: string;
  date: string;
}

function buildActivity(g: IndividualGuestProfile): FeedItem[] {
  const firstName = g.name.split(' ')[0];
  return [
    { type: 'sales', title: `Proposal sent: ${g.upcoming.property}`, desc: `${g.upcoming.accommodation}, ${g.upcoming.period}`, date: 'Oct 12, 2026' },
    { type: 'todo', title: `Confirm ${g.upcoming.accommodation}`, desc: `Hold room for ${firstName} at ${g.upcoming.property}`, date: 'Oct 15, 2026' },
    { type: 'marcom', title: 'Seasonal journeys mailer', desc: 'Added to the winter escapes audience', date: 'Oct 08, 2026' },
    { type: 'emails', title: `Pre-arrival email: ${g.upcoming.property}`, desc: `Sent to ${g.email}`, date: 'Oct 05, 2026' },
    { type: 'attachments', title: `Itinerary_${g.id}.pdf`, desc: 'Draft itinerary and welcome letter', date: 'Oct 05, 2026' },
    { type: 'marketing', title: 'Campaign: Private Escapes 2027', desc: 'Opened, 2 clicks', date: 'Sep 28, 2026' },
    { type: 'calls', title: `Call with ${g.booking.contact}`, desc: 'Discussed arrival preferences, 12 min', date: 'Sep 22, 2026' },
    { type: 'notes', title: 'Relationship note', desc: g.note.quote, date: 'Sep 15, 2026' },
  ];
}

function buildStayEvents(g: IndividualGuestProfile): FeedItem[] {
  return [
    { type: 'events', title: `Upcoming: ${g.upcoming.property}`, desc: `${g.upcoming.accommodation}, ${g.upcoming.party}`, date: g.upcoming.period },
    ...g.journey.map((j) => ({ type: 'events', title: `Stayed at ${j.name}`, desc: j.loc, date: j.date })),
  ];
}

interface ChangeLogItem {
  field: string;
  from?: string;
  to: string;
  by: string;
  date: string;
}

/** Contact change log, newest first. */
function buildChangeLog(g: IndividualGuestProfile): ChangeLogItem[] {
  return [
    { field: 'Upcoming stay', from: 'Inquiry', to: `${g.upcoming.property}, ${g.upcoming.period}`, by: 'Reservations Team', date: 'Oct 12, 2026' },
    { field: 'Preferred channel', from: 'Email', to: g.channel, by: g.name, date: 'Oct 05, 2026' },
    { field: 'Phone', from: 'Previous number', to: g.phone, by: 'Front Office', date: 'Sep 28, 2026' },
    { field: 'Guest status', from: 'Prospect', to: g.guestType, by: 'CRM Admin', date: 'Sep 15, 2026' },
    { field: 'Email', from: 'Unverified', to: g.email, by: 'System', date: 'Aug 30, 2026' },
    { field: 'Language', from: 'English', to: g.language, by: 'Guest Relations', date: 'Aug 12, 2026' },
    { field: 'Contact created', to: g.name, by: 'System', date: g.memberSince },
  ];
}

function ChangeTimeline({ items }: { items: ChangeLogItem[] }) {
  return (
    <div className="relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-200">
      {items.map((c) => (
        <div key={`${c.field}-${c.date}`} className="relative flex items-start justify-between gap-4 pl-6 py-2.5">
          <span className="absolute left-0 top-[15px] w-[9px] h-[9px] rounded-full bg-white border border-zinc-400" />
          <div className="min-w-0">
            <div className="text-[10.5px] font-medium text-zinc-900">{c.field}</div>
            <div className="text-[10px] text-zinc-500 font-normal">
              {c.from ? (
                <>
                  <span className="text-zinc-400 line-through decoration-zinc-300">{c.from}</span>
                  <span className="mx-1.5 text-zinc-300">&rarr;</span>
                  <span className="text-zinc-700">{c.to}</span>
                </>
              ) : (
                <span className="text-zinc-700">{c.to}</span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[9.5px] text-zinc-500 font-normal">{c.date}</div>
            <div className="text-[9px] text-zinc-400 font-normal">by {c.by}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ k, dir, children }: { k: string; dir: 'left' | 'right'; children: React.ReactNode }) {
  return (
    <div key={k} className={dir === 'right' ? 'animate-tab-from-right' : 'animate-tab-from-left'}>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-zinc-100 last:border-b-0">
      <span className="text-[9.5px] font-medium text-zinc-400">{label}</span>
      <span className="text-[11px] font-medium text-zinc-900">{value}</span>
    </div>
  );
}

function FeedList({ items }: { items: FeedItem[] }) {
  return (
    <>
      {items.map((e) => (
        <div key={e.title} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-zinc-100 last:border-b-0">
          <div className="min-w-0">
            <div className="text-[10.5px] font-medium text-zinc-900 truncate">{e.title}</div>
            <div className="text-[10px] text-zinc-500 font-normal truncate">{e.desc}</div>
          </div>
          <span className="text-[9.5px] text-zinc-400 font-normal shrink-0">{e.date}</span>
        </div>
      ))}
    </>
  );
}

export function GuestDetailTabs({ guest }: { guest: IndividualGuestProfile }) {
  const [tab, setTab] = useState('all');
  const dir = useTabDirection(TAB_IDS, tab);

  const activity = useMemo(() => buildActivity(guest), [guest]);
  const stayEvents = useMemo(() => buildStayEvents(guest), [guest]);
  const changeLog = useMemo(() => buildChangeLog(guest), [guest]);

  const details = [
    { label: 'Guest Status', value: guest.guestType },
    { label: 'Location', value: guest.location },
    { label: 'Email', value: guest.email },
    { label: 'Phone', value: guest.phone },
    { label: 'Preferred Channel', value: guest.channel },
    { label: 'Language', value: guest.language },
    { label: 'Loyalty Tier', value: guest.tier },
    { label: 'Member Since', value: guest.memberSince },
  ];

  const companies = [
    { name: guest.booking.affiliation, role: 'Affiliation', contact: guest.booking.contact },
    { name: guest.booking.channel, role: 'Booking channel', contact: guest.booking.preferredChannel },
  ];

  const feedItems =
    tab === 'events' ? stayEvents : activity.filter((e) => e.type === tab);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-card-enter -mx-3 px-3 pt-4"
      style={{ animationDelay: '0.3s' }}
    >
      {/* Details (col-4) */}
      <div className="col-span-1 lg:col-span-4">
        <div className="flex items-center mb-3 h-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6">
          {details.map((d) => (
            <Row key={d.label} label={d.label} value={d.value} />
          ))}
        </div>
      </div>

      {/* Tab view (col-8) */}
      <div className="col-span-1 lg:col-span-8 min-w-0">
        <SlidingTabs tabs={TABS} value={tab} onChange={setTab} />

        <div className="overflow-hidden pt-4 min-h-[190px]">
          <Panel k={tab} dir={dir}>
            {tab === 'companies' && (
              <>
                <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 pb-2 text-[9.5px] font-medium text-zinc-400 border-b border-zinc-100">
                  <span>Company</span>
                  <span>Relation</span>
                  <span>Contact</span>
                </div>
                {companies.map((c) => (
                  <div key={c.name} className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 py-2.5 border-b border-zinc-100 last:border-b-0 text-[10px]">
                    <span className="font-medium text-zinc-900 truncate">{c.name}</span>
                    <span className="font-medium text-zinc-600 truncate">{c.role}</span>
                    <span className="font-medium text-zinc-600 truncate">{c.contact}</span>
                  </div>
                ))}
              </>
            )}

            {tab === 'all' && <ChangeTimeline items={changeLog} />}

            {tab !== 'companies' && tab !== 'all' && <FeedList items={feedItems} />}
          </Panel>
        </div>
      </div>
    </div>
  );
}
