import { useParams, useNavigate } from 'react-router-dom';
import { getIndividualGuestProfile, type GuestMoment } from '../data/individualGuestProfiles';
import { GuestDetailTabs } from '../components/GuestDetailTabs';

const CARD_BASE =
  'rounded-[12px] transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full';

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="flex justify-between items-center mb-3 h-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{children}</h3>
    </div>
  );
}

function MomentList({ items, defaultBookingId }: { items: GuestMoment[]; defaultBookingId?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between flex-1 py-1 gap-1">
      {items.map((m) => {
        const bookingId = m.bookingId || defaultBookingId || 'BK-JA-01';
        return (
          <div
            key={m.title}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/reservations/bookings/${bookingId}`);
            }}
            className="p-1.5 -mx-1.5 rounded-lg hover:bg-zinc-100/80 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-baseline mb-0.5 gap-2">
              <span className="font-bold text-zinc-900 text-[10.5px] group-hover:text-zinc-950">{m.title}</span>
              <span className="text-[9px] font-semibold text-zinc-500 shrink-0">{m.tag}</span>
            </div>
            <div className="text-zinc-500 text-[10px] font-normal leading-snug">{m.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

export function IndividualGuestProfilePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const guest = getIndividualGuestProfile(uuid);

  if (!guest) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-500 text-xs">
        <span>Guest profile not found.</span>
        <button
          onClick={() => navigate('/dashboard/guests/individual')}
          className="text-zinc-900 font-medium hover:underline cursor-pointer"
        >
          &larr; Back to Guests
        </button>
      </div>
    );
  }

  const initials = guest.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  const rhythmCol1 = [
    { title: 'Morning Rhythm', lines: guest.rhythm.morning },
    { title: 'Wellness', lines: guest.rhythm.wellness },
    { title: 'Dining', lines: guest.rhythm.dining },
  ];
  const rhythmCol2 = [
    { title: 'Room Preferences', lines: guest.rhythm.room },
    { title: 'Work Rhythm', lines: guest.rhythm.work },
    { title: 'Leisure Activities', lines: guest.rhythm.leisure },
  ];

  const profileFields = [
    { label: 'Location', value: guest.location },
    { label: 'Language', value: guest.language },
    { label: 'Phone', value: guest.phone },
    { label: 'Preferred Channel', value: guest.channel },
    { label: 'Email', value: guest.email, wide: true },
  ];

  const stats = [
    { label: 'Total Stays', value: guest.stats.stays, sub: guest.stats.properties, tone: 'text-zinc-500' },
    { label: 'Av. Length of Stay', value: guest.stats.avLos, sub: 'Nights', tone: 'text-zinc-500' },
    { label: 'Total Spend', value: guest.stats.spend, sub: 'All time', tone: 'text-zinc-500' },
    { label: 'Av. Spend Per Stay', value: guest.stats.avgSpend, sub: guest.stats.yoy, tone: 'text-emerald-700 font-medium' },
  ];

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">

      {/* Header & Back button */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">{guest.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-normal">Guest status:</span>
            <span className="font-semibold text-zinc-900">{guest.guestType}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/guests/individual')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-normal pb-0.5 cursor-pointer"
        >
          <span>&larr;</span> Back to Guests
        </button>
      </div>

      <div className="flex flex-col gap-1 text-[10px]">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>

          {/* Profile & Contact */}
          <div className={`col-span-1 lg:col-span-4 p-3 ${CARD_BASE}`}>
            <SectionTitle>Guest Profile</SectionTitle>

            {guest.photo ? (
              <img
                src={guest.photo}
                alt={guest.name}
                className="w-full h-[125px] object-cover object-[50%_22%] rounded-lg shadow-xs shrink-0"
              />
            ) : (
              <div className="w-full h-[125px] rounded-lg shrink-0 bg-zinc-100 border border-zinc-200/80 flex items-center justify-center">
                <span className="text-[34px] font-light tracking-[0.2em] text-zinc-400 select-none">{initials}</span>
              </div>
            )}

            <div className="pt-3 grid grid-cols-2 gap-3 flex-1">
              {profileFields.map((f) => (
                <div key={f.label} className={`flex flex-col gap-0.5 ${f.wide ? 'col-span-2' : ''}`}>
                  <div className="text-zinc-500 font-medium text-[9.5px]">{f.label}</div>
                  <div className="text-zinc-900 font-medium text-[10px] truncate" title={f.value}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rhythm & Preferences */}
          <div className={`col-span-1 lg:col-span-4 p-3 ${CARD_BASE}`}>
            <SectionTitle>Rhythm & Preferences</SectionTitle>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 flex-1">
              {[rhythmCol1, rhythmCol2].map((col, ci) => (
                <div key={ci} className="flex flex-col justify-between">
                  {col.map((r) => (
                    <div key={r.title}>
                      <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">{r.title}</div>
                      <div className="text-zinc-500 text-[10px] font-normal leading-snug">
                        {r.lines[0]}
                        <br />
                        {r.lines[1]}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Stay */}
          <div
            onClick={() => navigate(`/dashboard/reservations/bookings/${guest.upcoming.bookingId || 'BK-JA-01'}`)}
            className={`col-span-1 lg:col-span-4 p-3 ${CARD_BASE}`}
          >
            <div className="flex justify-between items-center mb-3 h-4">
              <SectionTitle>Upcoming Stay</SectionTitle>
              <span className="text-[9.5px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Confirmed
              </span>
            </div>

            <div className="rounded-lg overflow-hidden shrink-0">
              <img src={guest.upcoming.img} alt={guest.upcoming.property} className="w-full h-[125px] object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="flex flex-col flex-1 justify-between gap-2.5 pt-3">
              <div>
                <h4 className="text-xl font-serif text-zinc-900 leading-none">{guest.upcoming.property}</h4>
                <div className="text-zinc-500 text-[10px] font-normal mt-1">{guest.upcoming.place}</div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9.5px]">
                {[
                  { label: 'Stay Period', value: guest.upcoming.period },
                  { label: 'Party', value: guest.upcoming.party },
                  { label: 'Accommodation', value: guest.upcoming.accommodation, wide: true },
                ].map((d) => (
                  <div key={d.label} className={`flex flex-col gap-0.5 ${d.wide ? 'col-span-2' : ''}`}>
                    <span className="text-[9px] text-zinc-500 font-medium">{d.label}</span>
                    <span className="font-medium text-zinc-900 text-[10px]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter pt-3 border-t border-zinc-100 -mx-3" style={{ animationDelay: '0.2s' }}>

          {/* Journey Timeline */}
          <div className="col-span-1 lg:col-span-4 p-4 rounded-[12px] transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 flex flex-col h-full bg-white">
            <SectionTitle>Journey Timeline</SectionTitle>
            <div className="flex flex-col justify-between flex-1 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200 py-1 gap-2">
              {guest.journey.map((stay) => {
                const bookingId = stay.bookingId || 'BK-002';
                return (
                  <div
                    key={`${stay.date}-${stay.name}-${stay.loc}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/reservations/bookings/${bookingId}`);
                    }}
                    className="flex gap-3 relative z-10 items-center p-2 -mx-2 rounded-lg hover:bg-zinc-100/80 transition-all cursor-pointer group"
                  >
                    <img
                      src={stay.img}
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                      alt={stay.name}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-zinc-900 text-[10.5px] leading-tight group-hover:text-zinc-950 truncate">
                        {stay.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9.5px] text-zinc-500 font-normal mt-0.5">
                        <span>{stay.date}</span>
                        <span className="text-zinc-300">·</span>
                        <span>{stay.loc}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moments that Matter */}
          <div className="col-span-1 lg:col-span-4 p-4 rounded-[12px] transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 flex flex-col h-full bg-white">
            <SectionTitle>Moments That Matter</SectionTitle>
            <MomentList items={guest.moments} defaultBookingId={guest.upcoming.bookingId || 'BK-JA-01'} />
          </div>

          {/* Stay Summary & Spend Overview */}
          <div className={`col-span-1 lg:col-span-4 p-4 ${CARD_BASE}`}>
            <SectionTitle>Stay Summary and Spend Overview</SectionTitle>
            <div className="flex flex-col justify-between flex-1 py-1 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-medium text-zinc-500">{s.label}</span>
                    <span className={`text-[9px] font-normal mt-0.5 ${s.tone}`}>{s.sub}</span>
                  </div>
                  <span className="text-[14px] font-normal text-zinc-900 leading-none">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GuestDetailTabs guest={guest} />

      </div>
    </div>
  );
}
