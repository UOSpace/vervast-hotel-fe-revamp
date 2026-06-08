import { InfoTooltip } from '../../../common/components/InfoTooltip';
import dashboardData from '../../../../data/dashboardData.json';
import { RoundAltArrowRight } from '@solar-icons/react';

export function TopNationalitiesWidget() {
  const data = dashboardData.topNationalities;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between w-full">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31]">Top Nationalities</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD</p>
          </div>
          <InfoTooltip text="The distribution of guest origin countries based on check-ins MTD." />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2.5">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px]">
            <span className="text-[#4a3c31]">{item.country}</span>
            <span className="text-[#4a3c31] font-semibold">{item.percentage}</span>
          </div>
        ))}
      </div>
      
      <div className="text-[9px] text-[#a65e52] font-semibold hover:underline mt-auto self-end flex items-center gap-1 cursor-pointer">
        See details <RoundAltArrowRight size={10} />
      </div>
    </div>
  );
}
