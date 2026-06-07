import alpineImg from '../../../../../assets/contents/alpine.png';
import oceanImg from '../../../../../assets/contents/ocean.png';
import cityImg from '../../../../../assets/contents/city.png';
import forestImg from '../../../../../assets/contents/forest.png';
import desertImg from '../../../../../assets/contents/desert.png';
import countryImg from '../../../../../assets/contents/country.png';

const resorts = [
  { id: 'alpine',      name: 'SOSEI ALPINE',       img: alpineImg  },
  { id: 'city',        name: 'SOSEI CITY',         img: cityImg    },
  { id: 'countryside', name: 'SOSEI COUNTRYSIDE',  img: countryImg },
  { id: 'desert',      name: 'SOSEI DESERT',      img: desertImg  },
  { id: 'forest',      name: 'SOSEI FOREST',       img: forestImg  },
  { id: 'ocean',       name: 'SOSEI OCEAN',        img: oceanImg   },
];

export function ResortPickerWidget({ activeResorts, setActiveResorts }: { activeResorts: string[], setActiveResorts: (ids: string[]) => void }) {
  return (
    <div className="flex items-end gap-10 px-2 py-4 animate-card-enter" style={{ animationDelay: '0.05s' }}>
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
            className="flex flex-col items-center gap-2 transition-all"
          >
            <div className={`rounded-full overflow-hidden border-2 transition-all w-[104px] h-[104px] ${
              isActive
                ? 'border-[#C8A050] shadow-lg shadow-[#C8A050]/30 opacity-100'
                : 'border-[#d4c4b7] opacity-40 hover:opacity-75'
            }`}>
              <img src={r.img} alt={r.name} className={`w-full h-full object-cover transition-all ${isActive ? '' : 'grayscale'}`} />
            </div>
            <div className={`uppercase tracking-wider leading-[1.1] text-center transition-all ${
              isActive ? 'text-[10px] font-bold text-[#4a3c31]' : 'text-[9px] text-[#7d6b5e]'
            }`} style={{ maxWidth: 104 }}>
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
