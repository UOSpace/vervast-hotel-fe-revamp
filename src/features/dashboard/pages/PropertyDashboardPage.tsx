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
import { SakuraTransition, useSakuraTransition } from '../components/SakuraTransition';
import alpineImg from '../../../assets/contents/alpine.png';
import oceanImg from '../../../assets/contents/ocean.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';
import desertImg from '../../../assets/contents/desert.png';
import countryImg from '../../../assets/contents/country.png';

export const PROPERTIES = [
  { id: 'alpine', name: 'SOSEI Nocturne', location: 'Switzerland', img: alpineImg },
  { id: 'ocean', name: 'SOSEI Ocean', location: 'Maldives', img: oceanImg },
  { id: 'city', name: 'SOSEI City', location: 'New York', img: cityImg },
  { id: 'forest', name: 'SOSEI Forest', location: 'Tokyo', img: forestImg },
  { id: 'desert', name: 'SOSEI Desert', location: 'Cairo', img: desertImg },
  { id: 'country', name: 'SOSEI Countryside', location: 'Tuscany', img: countryImg },
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

  const { phase, trigger } = useSakuraTransition();
  const isTransitioning = phase !== 'idle';

  const handleDateChange = (type: 'main' | 'comp', dates: [Date | null, Date | null]) => {
    trigger(() => {
      if (type === 'main') {
        setStartDate(dates[0]);
        setEndDate(dates[1]);
      } else {
        setCompStartDate(dates[0]);
        setCompEndDate(dates[1]);
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
      <SakuraTransition isActive={isTransitioning} phase={phase} />
      <PropertyHeaderWidget 
        startDate={startDate} endDate={endDate} onDateChange={(dates: [Date | null, Date | null]) => handleDateChange('main', dates)}
        compStartDate={compStartDate} compEndDate={compEndDate} onCompDateChange={(dates: [Date | null, Date | null]) => handleDateChange('comp', dates)}
        selectedProperty={selectedProperty}
        onPropertyChange={setSelectedProperty}
        propertiesList={PROPERTIES}
      />
      
      <div key={selectedProperty.id} className="flex-1 min-h-0 flex flex-col gap-4">
        {/* Row 1 */}
        <PropertyKPIWidget propertyId={selectedProperty.id} />

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OccupancyByRoomTypeWidget />
          <RevenueByDepartmentWidget />
          <MarketSegmentMixWidget />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-[28fr_40fr_32fr] gap-4">
          <TopBookingChannelsWidget />
          <GuestNationalityWidget />
          <GuestSatisfactionWidget />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-4">
          <PropertyRhythmWidget />
          <UpcomingEventsWidget />
          <AlertsTasksWidget />
        </div>
      </div>
    </div>
  );
}
