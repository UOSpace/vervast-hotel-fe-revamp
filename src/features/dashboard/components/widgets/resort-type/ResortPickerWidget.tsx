import alpineImg from '../../../../../assets/contents/alpine.png';
import oceanImg from '../../../../../assets/contents/ocean.png';
import cityImg from '../../../../../assets/contents/city.png';
import forestImg from '../../../../../assets/contents/forest.png';
import desertImg from '../../../../../assets/contents/desert.png';
import countryImg from '../../../../../assets/contents/country.png';

const resorts = [
  { id: 'alpine',      name: 'SOSEI ALPINE',       img: alpineImg },
  { id: 'city',        name: 'SOSEI CITY',         img: cityImg },
  { id: 'countryside', name: 'SOSEI COUNTRYSIDE',  img: countryImg },
  { id: 'desert',      name: 'SOSEI DESERT',       img: desertImg },
  { id: 'forest',      name: 'SOSEI FOREST',       img: forestImg },
  { id: 'ocean',       name: 'SOSEI OCEAN',        img: oceanImg },
];

export function ResortPickerWidget({ activeResorts, setActiveResorts }: { activeResorts: string[], setActiveResorts: (ids: string[]) => void }) {
  return (
    <div className="w-full animate-card-enter pb-0">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-end w-full">
        {resorts.map((r) => {
          const isActive = activeResorts.includes(r.id);
          const shortName = r.id === 'countryside' ? 'COUNTRY' : r.id.toUpperCase();

          const handleToggle = () => {
            if (isActive) {
              if (activeResorts.length > 1) {
                setActiveResorts(activeResorts.filter(id => id !== r.id));
              }
            } else {
              setActiveResorts([...activeResorts, r.id]);
            }
          };

          return (
            <div
              key={r.id}
              className="flex flex-col transition-all duration-300"
            >
              <button
                onClick={handleToggle}
                className={`relative w-full aspect-[5/4] overflow-hidden rounded-[2px] transition-all duration-300 cursor-pointer outline-none focus:outline-none select-none ${
                  isActive 
                    ? 'border border-[#4a3c31]/50 p-[3px] bg-[#f3eae1]/30 shadow-sm' 
                    : 'border border-transparent p-[3px]'
                }`}
              >
                <img 
                  src={r.img} 
                  alt={r.name} 
                  className={`w-full h-full object-cover filter grayscale transition-all duration-500 ${
                    isActive ? 'opacity-100 contrast-[1.05]' : 'opacity-35 hover:opacity-55'
                  }`}
                />
                <div className="absolute bottom-1.5 left-2 z-10 pointer-events-none">
                  <span 
                    className={`text-[7px] md:text-[8px] tracking-[0.16em] uppercase transition-all duration-300 ${
                      isActive ? 'text-white font-bold' : 'text-white/70 font-light'
                    }`}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                  >
                    {shortName}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
