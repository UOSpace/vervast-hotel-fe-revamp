import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

const sentimentCategories = [
  { name: 'Service', score: 4.6 },
  { name: 'Cleanliness', score: 4.5 },
  { name: 'Value', score: 4.5 },
  { name: 'Sleep Quality', score: 4.5 },
  { name: 'Rooms', score: 4.2 },
];

export function SentimentScoreWidget() {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="mb-1">
        <InfoTooltip text="Average score based on guest survey feedback across Service, Cleanliness, Value, Sleep Quality, and Rooms.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] cursor-help">Sentiment Score</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD AVERAGE</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 w-full min-h-[160px] flex items-center justify-center my-auto">
        <ResponsiveContainer width="100%" height={160}>
          <RadarChart cx="50%" cy="50%" outerRadius={48} data={sentimentCategories}>
            <PolarGrid stroke="#d4c4b7" strokeOpacity={0.35} gridType="polygon" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#4a3c31', fontWeight: 500 }} />
            <Radar name="Score" dataKey="score" stroke="#2c2a29" fill="#4a3c31" fillOpacity={0.22} strokeWidth={1.5} dot={{ r: 3, fill: '#2c2a29' }} isAnimationActive={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '6px', fontSize: '10px' }}
              formatter={(value: any) => [`${value} / 5`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
