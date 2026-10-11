import { MASTER_CATEGORIES, resolveCategoryId } from '@/constants/categories';

export function ResortPickerWidget({
  activeResorts,
  setActiveResorts,
}: {
  activeResorts: string[];
  setActiveResorts: (ids: string[]) => void;
}) {
  // Normalize active IDs to canonical master category IDs
  const canonicalActive = activeResorts.map(resolveCategoryId);

  return (
    <div className="w-full animate-card-enter pb-0">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 items-end w-full">
        {MASTER_CATEGORIES.map((category) => {
          const isActive = canonicalActive.includes(category.id);

          const handleToggle = () => {
            if (isActive) {
              if (canonicalActive.length > 1) {
                setActiveResorts(canonicalActive.filter((id) => id !== category.id));
              }
            } else {
              setActiveResorts([...canonicalActive, category.id]);
            }
          };

          return (
            <div
              key={category.id}
              className="flex flex-col transition-all duration-300"
            >
              <button
                type="button"
                onClick={handleToggle}
                className={`relative w-full aspect-[5/4] overflow-hidden rounded-[2px] transition-all duration-300 cursor-pointer outline-none focus:outline-none select-none ${
                  isActive
                    ? 'border border-zinc-900/40 p-[3px] bg-zinc-900/5 shadow-sm'
                    : 'border border-transparent p-[3px]'
                }`}
              >
                <img
                  src={category.img}
                  alt={category.name}
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
                    {category.shortName}
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

