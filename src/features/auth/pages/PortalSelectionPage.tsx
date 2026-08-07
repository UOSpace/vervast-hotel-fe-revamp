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
      image: hospitalityPortalImg,
      path: '/dashboard',
      glowColor: 'rgba(200, 160, 80, 0.5)'
    },
    {
      id: 'sanctuary',
      label: 'Sanctuary',
      image: sanctuaryPortalImg,
      path: '/dashboard',
      glowColor: 'rgba(166, 94, 82, 0.5)'
    },
    {
      id: 'design',
      label: 'Design',
      image: designPortalImg,
      path: '/dashboard',
      glowColor: 'rgba(88, 105, 129, 0.5)'
    },
    {
      id: 'fnb-experience',
      label: 'F&B & Experience',
      image: fnbPortalImg,
      path: '/dashboard',
      glowColor: 'rgba(101, 116, 84, 0.5)'
    }
  ];

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden text-[#4a3c31] select-none bg-[#f8f6f0]"
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] pointer-events-none" />

      {/* Header Logo */}
      <div className="z-10 flex flex-col items-center w-full pt-4 pb-8 animate-fade-in shrink-0">
        <Logo className="w-48 md:w-56 h-auto" />
      </div>

      {/* Portal 4-Grid Cards Container (Zero spacing & padding) */}
      <div className="z-10 w-full max-w-6xl my-auto animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full rounded-2xl overflow-hidden shadow-2xl border border-[#d4c4b7]/50">
          {portals.map((portal, idx) => (
            <div 
              key={portal.id}
              onClick={() => navigate(portal.path)}
              className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4.5] w-full overflow-hidden cursor-pointer group transition-all duration-500 border-b lg:border-b-0 lg:border-r border-[#d4c4b7]/30 last:border-0"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Background Image: Grayscale initially, full color + scale on hover */}
              <div 
                className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url(${portal.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Bottom Gradient Overlay (Black to transparent gradient) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Glowing border accent on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200/40 transition-colors duration-500 pointer-events-none" />

              {/* Bottom Title Container */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end text-white z-10">
                <div className="w-6 h-[2px] bg-white/50 mb-2.5 group-hover:w-10 group-hover:bg-amber-200 transition-all duration-500" />
                <h3 className="text-sm font-sans tracking-[0.2em] uppercase font-bold text-white group-hover:text-amber-200 transition-colors duration-300 leading-tight">
                  {portal.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer copyright note */}
      <div className="z-10 pt-8 pb-2 text-center text-[10px] text-[#7d6b5e] tracking-widest uppercase shrink-0 font-medium">
        SOSEI Hospitality Group · Portfolio Selection
      </div>
    </div>
  );
}
