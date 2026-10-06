import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { getDashboardComputedData } from '../../../../data/pms';

export function SentimentScoreWidget() {
  const sentimentCategories = getDashboardComputedData().sentimentCategories;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-1">
        <InfoTooltip text="Average score based on guest survey feedback across Service, Cleanliness, Value, Sleep Quality, and Rooms.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Sentiment Score</h3>
            <p className="text-[10px] text-zinc-500 font-medium">MTD AVERAGE</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 w-full min-h-[160px] flex items-center justify-center my-auto">
        <ResponsiveContainer width="100%" height={160}>
          <RadarChart cx="50%" cy="50%" outerRadius={48} data={sentimentCategories}>
            <PolarGrid stroke="#e4e4e7" strokeOpacity={0.8} gridType="polygon" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#3f3f46', fontWeight: 500 }} />
            <Radar name="Score" dataKey="score" stroke="#18181b" fill="#18181b" fillOpacity={0.15} strokeWidth={1.5} dot={{ r: 3, fill: '#18181b' }} isAnimationActive={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value: any) => [`${value} / 5`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
