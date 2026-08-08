import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import hospitalityPortalImg from '../../../assets/contents/hospitality_portal.png';
import sanctuaryPortalImg from '../../../assets/contents/sanctuary_portal.png';
import designPortalImg from '../../../assets/contents/design_portal.png';
import fnbPortalImg from '../../../assets/contents/fnb_portal.png';

export function PortalSelectionPage() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'hospitality',
      label: 'Hospitality',
      subtitle: 'Luxury Hotels & Resorts',
      image: hospitalityPortalImg,
      path: '/dashboard',
    },
    {
      id: 'sanctuary',
      label: 'Sanctuary',
      subtitle: 'Wellness & Spa Retreats',
      image: sanctuaryPortalImg,
      path: '/dashboard',
    },
    {
      id: 'design',
      label: 'Design',
      subtitle: 'Architecture & Interiors',
      image: designPortalImg,
      path: '/dashboard',
    },
    {
      id: 'fnb-experience',
      label: 'F&B & Experience',
      subtitle: 'Culinary & Curated Events',
      image: fnbPortalImg,
      path: '/dashboard',
    }
  ];

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden text-foreground select-none bg-background"
    >
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-foreground/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo (Smaller & Elegant) */}
      <div className="z-10 flex flex-col items-center w-full pt-2 pb-4 animate-fade-in shrink-0">
        <Logo className="w-20 sm:w-24 h-auto opacity-90" />
        <p className="text-[11px] text-muted-foreground/80 tracking-[0.2em] uppercase mt-2.5 font-medium">
          Select Portfolio Portal
        </p>
      </div>

      {/* Portal Spaced Cards Grid (+10% Card Size & Extra Wide Gaps) */}
      <div className="z-10 w-full max-w-[1120px] my-auto animate-fade-in py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14 w-full justify-items-center">
          {portals.map((portal, idx) => (
            <div 
              key={portal.id}
              onClick={() => navigate(portal.path)}
              className="relative aspect-[3/4] max-h-[350px] w-full max-w-[230px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 border border-border/60 bg-card shadow-xs hover:shadow-xl hover:-translate-y-1.5"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Background Image: Ultra-soft, high-key bright black & white photo */}
              <div 
                className="absolute inset-0 w-full h-full filter grayscale brightness-[1.14] contrast-[0.82] opacity-95 group-hover:brightness-[1.05] group-hover:contrast-90 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url(${portal.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Soft Light Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end text-white z-10 space-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <div className="w-5 h-[2px] bg-white/60 mb-1.5 group-hover:w-8 group-hover:bg-white transition-all duration-500" />
                <h3 className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-bold text-white leading-tight">
                  {portal.label}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/70 font-light tracking-wide group-hover:text-white/90 transition-colors">
                  {portal.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer copyright note */}
      <div className="z-10 pt-4 pb-2 text-center text-[10px] text-muted-foreground/50 tracking-widest uppercase shrink-0 font-medium">
        SOSEI Hospitality Group &bull; Portfolio Selection
      </div>
    </div>
  );
}

