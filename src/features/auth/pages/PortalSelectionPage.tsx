import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import bgImage from '../../../assets/bg/background.png';
import { Bed, Heart, TagPrice, WineglassTriangle } from '@solar-icons/react';

export function PortalSelectionPage() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'hospitality',
      label: 'Hospitality',
      icon: <Bed size={40} className="text-[#C8A050]" />,
      path: '/dashboard',
      desc: 'Sanctuary operations, reservations, and guest data analytics.',
      glowColor: 'rgba(200, 160, 80, 0.4)'
    },
    {
      id: 'sanctuary',
      label: 'Sanctuary',
      icon: <Heart size={40} className="text-[#a65e52]" />,
      path: '/dashboard/spa',
      desc: 'Spa bookings, wellness programs, and holistic amenities logs.',
      glowColor: 'rgba(166, 94, 82, 0.4)'
    },
    {
      id: 'design',
      label: 'Design',
      icon: <TagPrice size={40} className="text-[#586981]" />,
      path: '/dashboard/property',
      desc: 'Architectural rhythms, destination profiles, and layouts.',
      glowColor: 'rgba(88, 105, 129, 0.4)'
    },
    {
      id: 'fnb-experience',
      label: 'F&B & Experience',
      icon: <WineglassTriangle size={40} className="text-[#657454]" />,
      path: '/dashboard/experience/fnb',
      desc: 'Dining outlets, curations, events, and repeat satisfaction insights.',
      glowColor: 'rgba(101, 116, 84, 0.4)'
    }
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden text-[#4a3c31] select-none"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[#fbf6f0]/10 backdrop-blur-[1px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl text-center">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <div className="w-20 h-20 mb-4 p-2 flex items-center justify-center">
            <Logo className="w-50 h-auto" />
          </div>
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
              {/* Glowing Interactive Circle */}
              <div
                className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#d4c4b7]/70 bg-[#fbf8f3]/80 backdrop-blur-xs flex items-center justify-center shadow-lg transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-transparent"
                style={{
                  '--glow-shadow': portal.glowColor
                } as any}
              >
                {/* Glow container */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    boxShadow: `0 0 30px 6px ${portal.glowColor}`,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(251,246,240,0.4) 100%)',
                    border: `2px solid ${portal.glowColor.replace('0.4', '1')}`
                  }}
                />

                {/* Icon wrapper */}
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
                  {portal.icon}
                </div>
              </div>

              {/* Title & Description underneath */}
              <h3 className="mt-6 text-base font-serif font-bold tracking-wider text-[#4a3c31] group-hover:text-[#a65e52] transition-colors duration-300">
                {portal.label}
              </h3>
              <p className="mt-2 text-[10px] text-[#7d6b5e] font-sans leading-relaxed max-w-[200px] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {portal.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
