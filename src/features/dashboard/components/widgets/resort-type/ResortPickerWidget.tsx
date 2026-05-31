import alpineImg from '../../../../../assets/contents/alpine.png';
import oceanImg from '../../../../../assets/contents/ocean.png';
import cityImg from '../../../../../assets/contents/city.png';
import forestImg from '../../../../../assets/contents/forest.png';
import desertImg from '../../../../../assets/contents/desert.png';
import countryImg from '../../../../../assets/contents/country.png';

const resorts = [
  { id: 'desert',      name: 'SOSEI DESERT',      img: desertImg  },
  { id: 'ocean',       name: 'SOSEI OCEAN',        img: oceanImg   },
  { id: 'city',        name: 'SOSEI CITY',         img: cityImg    },
  { id: 'alpine',      name: 'SOSEI ALPINE',       img: alpineImg  },
  { id: 'countryside', name: 'SOSEI COUNTRYSIDE',  img: countryImg },
  { id: 'forest',      name: 'SOSEI FOREST',       img: forestImg  },
];

export function ResortPickerWidget({ activeResorts, setActiveResorts }: { activeResorts: string[], setActiveResorts: (ids: string[]) => void }) {
  return (
    <div className="flex items-end gap-4 px-1 animate-card-enter" style={{ animationDelay: '0.05s' }}>
      {resorts.map(r => {
        const isActive = activeResorts.includes(r.id);
        return (
          <button
            key={r.id}
            onClick={() => {
              if (isActive) {
                if (activeResorts.length > 1) {
                  setActiveResorts(activeResorts.filter(id => id !== r.id));
                }
              } else {
                setActiveResorts([...activeResorts, r.id]);
              }
            }}
            className="flex flex-col items-center gap-1.5 transition-all"
          >
            <div className={`rounded-full overflow-hidden border-2 transition-all ${
              isActive
                ? 'w-[72px] h-[72px] border-[#C8A050] shadow-lg shadow-[#C8A050]/30'
                : 'w-[52px] h-[52px] border-[#d4c4b7] opacity-60 hover:opacity-85'
            }`}>
              <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
            </div>
            <div className={`uppercase tracking-wider leading-[1.1] text-center transition-all ${
              isActive ? 'text-[9px] font-bold text-[#4a3c31]' : 'text-[8px] text-[#7d6b5e]'
            }`} style={{ maxWidth: 72 }}>
              {r.name.split(' ').map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
