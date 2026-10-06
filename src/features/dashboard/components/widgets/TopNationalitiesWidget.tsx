import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { getDashboardComputedData } from '../../../../data/pms';

const zincShades = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'];

export function TopNationalitiesWidget() {
  const data = getDashboardComputedData().topNationalities;
  const totalRevPar = data.reduce((acc, item) => acc + (item.val || 0), 0) || 5570;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-2">
        <InfoTooltip text="RevPAR (Revenue Per Available Room) per country and its share of Total RevPAR MTD.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Top Nationalities</h3>
            <p className="text-[10px] text-zinc-500 font-medium">MTD REVPAR</p>
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
                <span className="text-zinc-700 font-medium">{item.country}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] text-zinc-500 font-medium">({sharePct}%)</span>
                  <span className="text-zinc-900 font-semibold text-[10px]">{item.revPar}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: percentWidth,
                    backgroundColor: zincShades[i % zincShades.length],
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
