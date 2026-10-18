import React, { useState, useEffect } from 'react';

export interface DashboardHeaderWidgetProps {
  greeting?: string;
  title?: string;
}

const TIMEZONE_LOCATION_MAP: Record<string, string> = {
  'Asia/Jakarta': 'Jakarta, Indonesia',
  'Asia/Makassar': 'Makassar, Indonesia',
  'Asia/Jayapura': 'Jayapura, Indonesia',
  'Asia/Pontianak': 'Pontianak, Indonesia',
  'Asia/Singapore': 'Singapore',
  'Asia/Kuala_Lumpur': 'Kuala Lumpur, Malaysia',
  'Asia/Bangkok': 'Bangkok, Thailand',
  'Asia/Tokyo': 'Tokyo, Japan',
  'Asia/Seoul': 'Seoul, South Korea',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Dubai': 'Dubai, UAE',
  'Asia/Riyadh': 'Riyadh, Saudi Arabia',
  'Indian/Maldives': 'Malé, Maldives',
  'Africa/Cairo': 'Cairo, Egypt',
  'Europe/London': 'London, United Kingdom',
  'Europe/Paris': 'Paris, France',
  'Europe/Zurich': 'Zurich, Switzerland',
  'Europe/Madrid': 'Madrid, Spain',
  'Europe/Berlin': 'Berlin, Germany',
  'America/New_York': 'New York, USA',
  'America/Chicago': 'Chicago, USA',
  'America/Los_Angeles': 'Los Angeles, USA',
  'America/Vancouver': 'Vancouver, Canada',
  'America/Toronto': 'Toronto, Canada',
  'Australia/Sydney': 'Sydney, Australia',
};

export function getUserLocationAndTimezone(now: Date = new Date()) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
  const fallbackCity = timeZone.includes('/')
    ? timeZone.split('/').pop()!.replace(/_/g, ' ')
    : timeZone;
  const location = TIMEZONE_LOCATION_MAP[timeZone] || fallbackCity;

  let gmtOffset = 'GMT+7';
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (tzPart) gmtOffset = tzPart;
  } catch {
    // fallback if shortOffset is unsupported
  }

  const time = now.toLocaleTimeString('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

  const date = now.toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Dynamic H-1 snapshot timestamp for yesterday's global PMS close (23:59 local)
  const yesterdayClose = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 0);
  const syncDatePart = yesterdayClose.toLocaleDateString('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
  });
  const syncTimePart = yesterdayClose.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const lastUpdatedLabel = `${syncDatePart}, ${syncTimePart} (${gmtOffset})`;

  return { location, timeZone, gmtOffset, time, date, lastUpdatedLabel };
}

export const DashboardHeaderWidget: React.FC<DashboardHeaderWidgetProps> = ({
  greeting,
  title = 'Welcome to SOSEI Hospitality Dashboard (Corporate Group Level)',
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (greeting) return greeting;
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
    if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
    return 'Konbanwa Alfonso!';
  };

  const { location, timeZone, gmtOffset, time, date } = getUserLocationAndTimezone(now);

  return (
    <header className="shrink-0 flex flex-col mb-4 px-4 lg:px-6">
      <div
        className="w-full border-b border-zinc-200/80 pb-2.5 animate-fade-in bg-transparent flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2"
        style={{ animationDelay: '0.05s' }}
      >
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">
            {getGreeting()}
          </p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide flex items-center gap-2">
            <span>{title}</span>
          </h2>
        </div>
        <div className="flex flex-col items-start sm:items-end shrink-0 sm:ml-4 pt-0.5 pb-0.5">
          <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
          <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">
            {location} · {time} <span className="text-zinc-400">({gmtOffset} · {timeZone})</span>
          </p>
        </div>
      </div>
    </header>
  );
};
