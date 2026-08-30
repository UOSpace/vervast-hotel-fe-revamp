import { useState } from 'react';
import { PropertyHeaderWidget } from '../components/widgets/property/PropertyHeaderWidget';
import { PropertyKPIWidget } from '../components/widgets/property/PropertyKPIWidget';
import { OccupancyByRoomTypeWidget } from '../components/widgets/property/OccupancyByRoomTypeWidget';
import { RevenueByDepartmentWidget } from '../components/widgets/property/RevenueByDepartmentWidget';
import { MarketSegmentMixWidget } from '../components/widgets/property/MarketSegmentMixWidget';
import { TopBookingChannelsWidget } from '../components/widgets/property/TopBookingChannelsWidget';
import { GuestNationalityWidget } from '../components/widgets/property/GuestNationalityWidget';
import { GuestSatisfactionWidget } from '../components/widgets/property/GuestSatisfactionWidget';
import { PropertyRhythmWidget } from '../components/widgets/property/PropertyRhythmWidget';
import { UpcomingEventsWidget } from '../components/widgets/property/UpcomingEventsWidget';
import { AlertsTasksWidget } from '../components/widgets/property/AlertsTasksWidget';
import alpineImg from '../../../assets/contents/alpine.png';
import oceanImg from '../../../assets/contents/ocean.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';
import desertImg from '../../../assets/contents/desert.png';
import countryImg from '../../../assets/contents/country.png';

export const PROPERTIES = [
  // ── Europe ──────────────────────────────────────────────────────────────
  { id: 'sosei-nocturne',  name: 'SOSEI Nocturne',  location: 'Switzerland',       img: alpineImg   },
  { id: 'sosei-aurora',   name: 'SOSEI Aurora',     location: 'Finland',           img: alpineImg   },
  { id: 'sosei-hearth',   name: 'SOSEI Hearth',     location: 'Tuscany, Italy',    img: countryImg  },
  { id: 'sosei-pastoral', name: 'SOSEI Pastoral',   location: 'Provence, France',  img: countryImg  },
  // ── Americas ────────────────────────────────────────────────────────────
  { id: 'sosei-verper',   name: 'SOSEI Verper',     location: 'New York, USA',     img: cityImg     },
  { id: 'sosei-elan',     name: 'SOSEI Élan',       location: 'Los Angeles, USA',  img: cityImg     },
  // ── Asia Pacific ────────────────────────────────────────────────────────
  { id: 'sosei-marea',    name: 'SOSEI Maréa',      location: 'Maldives',          img: oceanImg    },
  { id: 'sosei-pelagia',  name: 'SOSEI Pelagia',    location: 'Indonesia',         img: oceanImg    },
  { id: 'sosei-sylvan',   name: 'SOSEI Sylvan',     location: 'Kyoto',             img: forestImg   },
  { id: 'sosei-verdant',  name: 'SOSEI Verdant',    location: 'Thailand',          img: forestImg   },
  // ── Middle East & Africa ─────────────────────────────────────────────────
  { id: 'sosei-mirage',   name: 'SOSEI Mirage',     location: 'Egypt',             img: desertImg   },
  { id: 'sosei-solstice', name: 'SOSEI Solstice',   location: 'Oman',              img: desertImg   },
];


export function PropertyDashboardPage() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthToday = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [startDate, setStartDate] = useState<Date | null>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [compStartDate, setCompStartDate] = useState<Date | null>(firstDayOfPrevMonth);
  const [compEndDate, setCompEndDate] = useState<Date | null>(prevMonthToday);
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);

  const handleDateChange = (type: 'main' | 'comp', dates: [Date | null, Date | null]) => {
    if (type === 'main') {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setCompStartDate(dates[0]);
      setCompEndDate(dates[1]);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pt-4 lg:pt-6">
      
      {/* Header wrapper matching DashboardPage */}
      <header className="shrink-0 flex flex-col mb-4 px-4 lg:px-6">
        <PropertyHeaderWidget 
          startDate={startDate} endDate={endDate} onDateChange={(dates: [Date | null, Date | null]) => handleDateChange('main', dates)}
          compStartDate={compStartDate} compEndDate={compEndDate} onCompDateChange={(dates: [Date | null, Date | null]) => handleDateChange('comp', dates)}
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
          propertiesList={PROPERTIES}
        />
      </header>

      {/* Content wrapper matching DashboardPage */}
      <div key={selectedProperty.id} className="flex-1 flex flex-col gap-4 pb-8 px-4 lg:px-6 text-[10px]">
        {/* Row 1: KPI Metrics (Full Width) */}
        <div className="-mx-3">
          <PropertyKPIWidget propertyId={selectedProperty.id} />
        </div>

        {/* Row 2: Property Rhythm (5 cols, aligns with Occupancy) + Market Segment Mix & Guest Satisfaction (7 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <PropertyRhythmWidget />
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <MarketSegmentMixWidget />
            </div>
            <div className="flex flex-col">
              <GuestSatisfactionWidget />
            </div>
          </div>
        </div>

        {/* Row 3: Room Occupancy (5 cols) + Upcoming Events & Alerts (7 cols, matching Row 2 vertical grid) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <OccupancyByRoomTypeWidget />
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <UpcomingEventsWidget />
            </div>
            <div className="flex flex-col">
              <AlertsTasksWidget />
            </div>
          </div>
        </div>

        {/* Row 4: Financials & Distributions (5 cols Revenue + 7 cols Channels & Nationality, matching vertical grid) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <RevenueByDepartmentWidget />
          </div>
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <TopBookingChannelsWidget />
            </div>
            <div className="flex flex-col">
              <GuestNationalityWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
