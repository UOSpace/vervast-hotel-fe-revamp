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
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden text-[#4a3c31] select-none bg-background"
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl text-center">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <Logo className="w-44 h-auto" />
        </div>

        {/* Portal Circles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-4">
          {portals.map((portal, idx) => (
            <div 
              key={portal.id}
              onClick={() => navigate(portal.path)}
              className="flex flex-col items-center cursor-pointer group transition-all duration-300"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Glowing Interactive Circle with Background Image */}
              <div 
                className="w-44 h-44 md:w-48 md:h-48 rounded-full border-2 border-[#d4c4b7] overflow-hidden relative shadow-lg transition-all duration-500 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url(${portal.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Glow & Overlay container */}
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 20px 4px ${portal.glowColor}, 0 0 25px 6px ${portal.glowColor}`,
                    border: `2px solid ${portal.glowColor.replace('0.5', '1')}`
                  }}
                />
                
                {/* Subtle dark tint overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Title label underneath */}
              <h3 className="mt-6 text-sm font-sans tracking-[0.15em] uppercase text-[#4a3c31] font-bold group-hover:text-[#a65e52] transition-colors duration-300">
                {portal.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
