import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { MASTER_PROPERTIES, resolvePropertyId } from '@/constants/categories';
import { type PeriodId } from '@/data/portfolio';
import { getPeriodDateRange, inferPeriodFromDates } from './ResortTypeDashboard';

export const PROPERTIES = MASTER_PROPERTIES;

export function PropertyDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const propIdParam = searchParams.get('id') || searchParams.get('property');

  const getInitialProperty = () => {
    if (propIdParam) {
      const canonicalId = resolvePropertyId(propIdParam);
      const found = PROPERTIES.find(p => p.id === canonicalId || p.id === propIdParam);
      if (found) return found;
    }
    return PROPERTIES[0];
  };

  const [period, setPeriod] = useState<PeriodId>('mtd');
  const [initialStart, initialEnd] = getPeriodDateRange('mtd');
  const prevMonthStart = new Date(initialStart.getFullYear(), initialStart.getMonth() - 1, 1);
  const prevMonthEnd = new Date(initialEnd.getFullYear(), initialEnd.getMonth() - 1, initialEnd.getDate());

  const [startDate, setStartDate] = useState<Date | null>(initialStart);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd);
  const [compStartDate, setCompStartDate] = useState<Date | null>(prevMonthStart);
  const [compEndDate, setCompEndDate] = useState<Date | null>(prevMonthEnd);
  const [selectedProperty, setSelectedProperty] = useState(getInitialProperty);

  useEffect(() => {
    if (propIdParam) {
      const canonicalId = resolvePropertyId(propIdParam);
      const found = PROPERTIES.find(p => p.id === canonicalId || p.id === propIdParam);
      if (found && found.id !== selectedProperty.id) {
        setSelectedProperty(found);
      }
    }
  }, [propIdParam]);

  const handlePropertyChange = (property: typeof PROPERTIES[0]) => {
    setSelectedProperty(property);
    setSearchParams({ id: property.id }, { replace: true });
  };

  const handleSelectPeriod = (nextPeriod: PeriodId) => {
    setPeriod(nextPeriod);
    const [s, e] = getPeriodDateRange(nextPeriod);
    setStartDate(s);
    setEndDate(e);
    setCompStartDate(new Date(s.getFullYear() - 1, s.getMonth(), s.getDate()));
    setCompEndDate(new Date(e.getFullYear() - 1, e.getMonth(), e.getDate()));
  };

  const handleDateChange = (type: 'main' | 'comp', dates: [Date | null, Date | null]) => {
    if (type === 'main') {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
      if (dates[0] && dates[1]) {
        setPeriod(inferPeriodFromDates(dates[0], dates[1]));
      }
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
          onPropertyChange={handlePropertyChange}
          propertiesList={PROPERTIES}
          period={period}
          onPeriodChange={handleSelectPeriod}
        />
      </header>

      {/* Content wrapper matching DashboardPage */}
      <div className="flex-1 flex flex-col gap-4 pb-8 px-4 lg:px-6 text-[10px]">
        {/* Row 1: KPI Metrics (Full Width) */}
        <div className="w-full">
          <PropertyKPIWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
        </div>

        {/* Row 2: Core Property Rhythm, Room Occupancy & Department Revenue (3 Equal Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="flex flex-col">
            <PropertyRhythmWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <OccupancyByRoomTypeWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <RevenueByDepartmentWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
        </div>

        {/* Row 3: Market Segment, Channel Distribution & Guest Satisfaction (3 Equal Columns, Same Card Model) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="flex flex-col">
            <MarketSegmentMixWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <TopBookingChannelsWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <GuestSatisfactionWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
        </div>

        {/* Row 4: Guest Nationality, Upcoming Events & Operational Alerts (3 Equal Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="flex flex-col">
            <GuestNationalityWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <UpcomingEventsWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
          <div className="flex flex-col">
            <AlertsTasksWidget propertyId={selectedProperty.id} propertyName={selectedProperty.name} period={period} />
          </div>
        </div>
      </div>
    </div>
  );
}
