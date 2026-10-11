import { useRef, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { LiveOverviewMap } from '../components/widgets/LiveOverviewMap';
import { PortfolioKpisWidget } from '../components/widgets/PortfolioKpisWidget';
import { BookingPaceWidget } from '../components/widgets/BookingPaceWidget';
import { RevenueDemandMixWidget } from '../components/widgets/RevenueDemandMixWidget';
import { ForwardBusinessWidget } from '../components/widgets/ForwardBusinessWidget';
import { SOSEISignalsWidget } from '../components/widgets/SoseiSignalsWidget';
import { GeoMarketWidget } from '../components/widgets/GeoMarketWidget';
import { MarketSegmentWidget } from '../components/widgets/MarketSegmentWidget';
import { PortfolioComparisonWidget } from '../components/widgets/PortfolioComparisonWidget';
import { DashboardHeaderWidget } from '../components/widgets/DashboardHeaderWidget';
import { RoundAltArrowRight } from '@solar-icons/react';
import { ResortTypeDashboard } from './ResortTypeDashboard';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isCategories =
    location.pathname === '/dashboard/categories' ||
    location.pathname === '/dashboard/property-categories' ||
    searchParams.get('view') === 'by_property_type';
  const view = isCategories ? 'by_property_type' : 'all';

  const { openDrawer } = useDashboardDrawer();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure scroll container is always reset to the top when navigating or switching views
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, searchParams, view]);

  return (
    <div
      ref={scrollRef}
      key={view}
      className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pt-4 lg:pt-6 bg-white"
    >
      {/* Header Widget */}
      {view === 'all' && <DashboardHeaderWidget />}

      {/* Conditional View Rendering */}
      {view === 'by_property_type' ? (
        <div key="resort" className="flex-1 flex flex-col">
          <ResortTypeDashboard />
        </div>
      ) : (
        <div key="all" className="grid grid-cols-12 auto-rows-max gap-4 pb-6 px-4 lg:px-6 text-[10px]">

          {/* ROW 1: Large Map (56%) + 5 Financial KPI Cards (44%) */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Map — Large 56% */}
            <div className="w-full lg:w-[56%] shrink-0 flex flex-col justify-between">
              <div className="px-1 flex items-center justify-between shrink-0 mb-2 min-h-[32px]">
                <div>
                  <InfoTooltip text="Interactive world map showing property, occupancy, ADR, and RevPAR (MTD).">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help leading-tight">
                      WORLD MAP
                    </h3>
                  </InfoTooltip>
                  <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">
                    Interactive Portfolio Footprint · 12 Properties
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openDrawer({ type: 'WORLD_MAP', title: 'World Map Details' })}
                  className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  See details <RoundAltArrowRight size={10} />
                </button>
              </div>
              <div
                className="flex-1 w-full rounded-[12px] p-2 flex flex-col relative animate-card-enter backdrop-blur-sm transition-all z-20 hover:z-40 min-h-[260px]"
                style={{ animationDelay: '0.1s' }}
              >
                <LiveOverviewMap />
              </div>
            </div>

            {/* Right Column — 44% (5 Financial Heart KPI Cards) */}
            <div className="w-full lg:w-[44%] flex flex-col">
              <PortfolioKpisWidget
                onOpenMetricDrawer={(metric, value) =>
                  openDrawer({ type: 'METRIC', title: metric, data: value })
                }
              />
            </div>
          </div>

          {/* ROW 2 — Tier 1 Core Drivers (3 Cards): Booking Pace | Revenue & Demand Mix | Forward Business */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-stretch">
            {/* 1. Booking Pace */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
              style={{ animationDelay: '0.35s' }}
              onClick={() => openDrawer({ type: 'BOOKING_PACE', title: 'Booking Pace (Next 90 Days)' })}
            >
              <BookingPaceWidget
                onOpenDetails={() => openDrawer({ type: 'BOOKING_PACE', title: 'Booking Pace (Next 90 Days)' })}
              />
            </div>

            {/* 2. Revenue & Demand Mix */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
              style={{ animationDelay: '0.4s' }}
              onClick={() => openDrawer({ type: 'REVENUE_DEMAND_MIX', title: 'Revenue & Demand Mix' })}
            >
              <RevenueDemandMixWidget
                onOpenDetails={() => openDrawer({ type: 'REVENUE_DEMAND_MIX', title: 'Revenue & Demand Mix' })}
              />
            </div>

            {/* 3. Forward Business */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
              style={{ animationDelay: '0.45s' }}
              onClick={() => openDrawer({ type: 'FORWARD_BUSINESS', title: 'Forward Business (Next 90 Days OTB)' })}
            >
              <ForwardBusinessWidget
                onOpenDetails={() => openDrawer({ type: 'FORWARD_BUSINESS', title: 'Forward Business (Next 90 Days OTB)' })}
              />
            </div>
          </div>

          {/* ROW 3 — Tier 2 Segmentation & Signals (3 Cards): Global Segmen (Geo Market) | Market Segmen | SOSEI Signals */}
          <div className="col-span-12 grid grid-cols-12 gap-4 items-stretch">
            {/* 4. Global Segmen (Geo Market) */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
              style={{ animationDelay: '0.5s' }}
              onClick={() => openDrawer({ type: 'GEO_MARKET', title: 'Geo Market Performance' })}
            >
              <GeoMarketWidget
                onOpenDetails={() => openDrawer({ type: 'GEO_MARKET', title: 'Geo Market Performance' })}
              />
            </div>

            {/* 5. Market Segmen */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
              style={{ animationDelay: '0.55s' }}
              onClick={() => openDrawer({ type: 'MARKET_SEGMENT', title: 'Market Segment Performance' })}
            >
              <MarketSegmentWidget
                onOpenDetails={() => openDrawer({ type: 'MARKET_SEGMENT', title: 'Market Segment Performance' })}
              />
            </div>

            {/* 6. SOSEI Signals */}
            <div
              className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
              style={{ animationDelay: '0.6s' }}
              onClick={() => openDrawer({ type: 'SOSEI_SIGNALS', title: 'SOSEI Signals' })}
            >
              <SOSEISignalsWidget
                onOpenDetails={() => openDrawer({ type: 'SOSEI_SIGNALS', title: 'SOSEI Signals' })}
              />
            </div>
          </div>

          {/* ROW 4 — 100% Full-Width Portfolio Comparison */}
          <div className="col-span-12">
            <div
              className="relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm"
              style={{ animationDelay: '0.65s' }}
              onClick={() => openDrawer({ type: 'PORTFOLIO_COMPARISON', title: 'Portfolio Comparison (Performance by Property MTD)' })}
            >
              <PortfolioComparisonWidget
                onOpenDetails={() => openDrawer({ type: 'PORTFOLIO_COMPARISON', title: 'Portfolio Comparison (Performance by Property MTD)' })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
