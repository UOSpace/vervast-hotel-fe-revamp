import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Country name to region mapping for the choropleth
const getRegionForCountry = (name: string) => {
  const n = name.toLowerCase();

  // America
  if (['united states of america', 'canada', 'mexico', 'brazil', 'argentina', 'colombia', 'peru', 'venezuela', 'chile', 'guatemala', 'ecuador', 'bolivia', 'cuba', 'haiti', 'dominican rep.', 'honduras', 'paraguay', 'nicaragua', 'el salvador', 'costa rica', 'panama', 'uruguay', 'jamaica', 'puerto rico', 'greenland'].includes(n)) return 'America';

  // Middle East
  if (['saudi arabia', 'iran', 'turkey', 'iraq', 'yemen', 'syria', 'united arab emirates', 'israel', 'jordan', 'lebanon', 'oman', 'kuwait', 'qatar', 'bahrain', 'palestine'].includes(n)) return 'Middle East';

  // Europe
  if (['russia', 'germany', 'united kingdom', 'france', 'italy', 'spain', 'ukraine', 'poland', 'romania', 'netherlands', 'belgium', 'czechia', 'greece', 'portugal', 'sweden', 'hungary', 'belarus', 'austria', 'serbia', 'switzerland', 'bulgaria', 'denmark', 'finland', 'slovakia', 'norway', 'ireland', 'croatia', 'moldova', 'bosnia and herz.', 'albania', 'lithuania', 'north macedonia', 'slovenia', 'latvia', 'estonia', 'montenegro', 'luxembourg', 'iceland'].includes(n)) return 'Europe';

  // Africa
  if (['nigeria', 'ethiopia', 'egypt', 'dem. rep. congo', 'tanzania', 'south africa', 'kenya', 'uganda', 'algeria', 'sudan', 'morocco', 'angola', 'mozambique', 'ghana', 'madagascar', 'cameroon', "côte d'ivoire", 'niger', 'burkina faso', 'mali', 'malawi', 'zambia', 'senegal', 'chad', 'somalia', 'zimbabwe', 'guinea', 'rwanda', 'benin', 'burundi', 'tunisia', 'south sudan', 'togo', 'sierra leone', 'libya', 'congo', 'liberia', 'central african rep.', 'mauritania', 'eritrea', 'namibia', 'gambia', 'botswana', 'gabon', 'lesotho', 'guinea-bissau', 'eq. guinea', 'mauritius', 'eswatini', 'djibouti', 'comoros'].includes(n)) return 'Africa';

  // Asia Pacific
  if (['china', 'india', 'indonesia', 'pakistan', 'bangladesh', 'japan', 'philippines', 'vietnam', 'thailand', 'myanmar', 'south korea', 'afghanistan', 'uzbekistan', 'malaysia', 'nepal', 'north korea', 'sri lanka', 'kazakhstan', 'cambodia', 'azerbaijan', 'tajikistan', 'laos', 'kyrgyzstan', 'turkmenistan', 'singapore', 'georgia', 'mongolia', 'armenia', 'timor-leste', 'cyprus', 'bhutan', 'maldives', 'brunei', 'australia', 'papua new guinea', 'new zealand', 'fiji', 'solomon is.', 'vanuatu', 'new caledonia', 'taiwan'].includes(n)) return 'Asia Pacific';

  return 'Unknown';
};

const colorPalette = [
  '#1F1D1C', // Rank 1 (Highest) - Darkest
  '#3D3A38', // Rank 2
  '#5E5A56', // Rank 3
  '#857E78', // Rank 4
  '#B2A9A0'  // Rank 5 (Lowest) - Lightest
];

export function ResortGeoMarketWidget({ geoData }: { geoData: any[] }) {
  const { openDrawer } = useDashboardDrawer();
  // Dynamically calculate region colors based on the current data rank
  const sortedRegions = [...geoData]
    .filter(row => !row.isTotal)
    .sort((a, b) => parseFloat(b.rnights) - parseFloat(a.rnights))
    .map(row => row.region);

  const regionColors: Record<string, string> = { 'Unknown': '#e4e4e7' };
  sortedRegions.forEach((region, index) => {
    regionColors[region] = colorPalette[index] || colorPalette[colorPalette.length - 1];
  });
  return (
    <div
      className="rounded-[12px] p-5 flex flex-col justify-between gap-3 bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter h-full"
      style={{ animationDelay: '0.4s' }}
      onClick={() => openDrawer({ type: 'GEO_MARKET', title: 'Geo Market Stats', data: geoData })}
    >
      <div className="uppercase tracking-widest text-[9px] font-bold text-[#4a3c31] flex items-center justify-between pb-2 border-b border-[#d4c4b7]/40 mb-1">
        <span>Geo Market Stats</span>
        <InfoTooltip text="Geographic mix showing room night and revenue contribution per global region." />
      </div>
      {/* Mini world map using react-simple-maps */}
      <div className="w-full flex justify-center items-center py-1 h-[120px] overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 98, center: [15, 20] }}
          width={400}
          height={200}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const region = getRegionForCountry(geo.properties.name);
                const fillColor = regionColors[region] || regionColors['Unknown'];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#d4d4d8"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#18181b' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      {/* Table */}
      <div className="mt-auto pt-2">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[8.5px] font-bold text-[#4a3c31] border-b border-[#d4c4b7]">
              <th className="text-left pb-2.5 pt-1 pr-1.5 w-[30%] truncate">Region</th>
              <th className="text-right pb-2.5 pt-1 px-1.5 w-[18%] truncate">% Rnights</th>
              <th className="text-right pb-2.5 pt-1 px-1.5 w-[22%] truncate">ADR (USD)</th>
              <th className="text-right pb-2.5 pt-1 pl-1.5 w-[30%] truncate">Room Revenue (USD)</th>
            </tr>
          </thead>
          <tbody>
            {geoData.map((row, idx) => (
              <tr key={row.region} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === geoData.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
                <td className="py-2.5 pr-1.5 truncate">{row.region}</td>
                <td className="text-right py-2.5 px-1.5 truncate">{row.rnights}</td>
                <td className="text-right py-2.5 px-1.5 truncate">{row.adr}</td>
                <td className="text-right py-2.5 pl-1.5 truncate">{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
