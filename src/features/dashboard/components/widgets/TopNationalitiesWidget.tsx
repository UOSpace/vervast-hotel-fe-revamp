import { InfoTooltip } from '../../../common/components/InfoTooltip';
import dashboardData from '../../../../data/dashboardData.json';

const wabiSabiShades = ['#1F1D1C', '#3D3A38', '#5E5A56', '#857E78', '#B2A9A0'];

export function TopNationalitiesWidget() {
  const data = dashboardData.topNationalities;
  const totalRevPar = data.reduce((acc, item) => acc + (item.val || 0), 0) || 3770;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-2">
        <InfoTooltip text="RevPAR (Revenue Per Available Room) per country and its share of Total RevPAR MTD.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] cursor-help">Top Nationalities</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD REVPAR</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-around py-1 space-y-3.5">
        {data.map((item, i) => {
          const sharePct = Math.round(((item.val || 0) / totalRevPar) * 100);
          const percentWidth = sharePct + '%';
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#4a3c31] font-medium">{item.country}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#7d6b5e]">({sharePct}%)</span>
                  <span className="text-[#4a3c31] font-semibold text-[10px]">{item.revPar}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: percentWidth,
                    backgroundColor: wabiSabiShades[i % wabiSabiShades.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
