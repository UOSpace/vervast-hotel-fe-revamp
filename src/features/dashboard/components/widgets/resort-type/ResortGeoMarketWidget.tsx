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
  '#8c6b4f', // Rank 1 (Highest) - Darkest
  '#a68365', // Rank 2
  '#b8987b', // Rank 3
  '#ccb197', // Rank 4
  '#e0cbb6'  // Rank 5 (Lowest) - Lightest
];

export function ResortGeoMarketWidget({ geoData }: { geoData: any[] }) {
  const { openDrawer } = useDashboardDrawer();
  // Dynamically calculate region colors based on the current data rank
  const sortedRegions = [...geoData]
    .filter(row => !row.isTotal)
    .sort((a, b) => parseFloat(b.rnights) - parseFloat(a.rnights))
    .map(row => row.region);

  const regionColors: Record<string, string> = { 'Unknown': '#e5d8cb' };
  sortedRegions.forEach((region, index) => {
    regionColors[region] = colorPalette[index] || colorPalette[colorPalette.length - 1];
  });
  return (
    <div
      className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col gap-3 bg-[#f3eae1]/0 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer animate-card-enter"
      style={{ animationDelay: '0.4s' }}
      onClick={() => openDrawer({ type: 'GEO_MARKET', title: 'Geo Market Stats', data: geoData })}
    >
      <div className="uppercase tracking-widest text-[10px] font-bold text-[#4a3c31] flex items-center justify-between">
        <span>Geo Market Stats</span>
        <InfoTooltip text="Geographic mix showing room night and revenue contribution per global region." />
      </div>
      {/* Mini world map using react-simple-maps */}
      <div className="w-full flex justify-center items-center py-2 h-[120px] overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 90, center: [15, 20] }}
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
                    stroke="#c8b9a8"
                    strokeWidth={0.3}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#C8A050' },
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
      <table className="w-full mt-auto" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="text-[8.5px] font-bold text-[#4a3c31] border-b border-[#d4c4b7]">
            <th className="text-left pb-1">Region</th>
            <th className="text-right pb-1">% Rnights</th>
            <th className="text-right pb-1">ADR (USD)</th>
            <th className="text-right pb-1">Room Revenue (USD)</th>
          </tr>
        </thead>
        <tbody>
          {geoData.map((row, idx) => (
            <tr key={row.region} className={`text-[9px] border-b border-[#d4c4b7]/50 ${idx === geoData.length - 1 ? 'font-bold text-[#4a3c31] border-b-0' : 'text-[#4a3c31]'}`}>
              <td className="py-1">{row.region}</td>
              <td className="text-right py-1">{row.rnights}</td>
              <td className="text-right py-1">{row.adr}</td>
              <td className="text-right py-1">{row.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
