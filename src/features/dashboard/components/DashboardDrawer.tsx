import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { CloseCircle } from '@solar-icons/react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell as PieCell, Tooltip } from 'recharts';

export function DashboardDrawer() {
  const { isOpen, config, closeDrawer } = useDashboardDrawer();

  if (!isOpen && !config) return null;

  const renderContent = () => {
    if (!config) return null;

    switch (config.type) {
      case 'LIVE_OVERVIEW':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Global real-time property status.</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Sosei Alpine', time: '14:30 CET', occ: '92%', status: 'High Activity' },
                { name: 'Sosei Ocean', time: '08:30 EST', occ: '85%', status: 'Moderate' },
                { name: 'Sosei City', time: '09:30 EDT', occ: '88%', status: 'High Activity' },
                { name: 'Sosei Forest', time: '22:30 JST', occ: '65%', status: 'Low' },
                { name: 'Sosei Desert', time: '17:30 GST', occ: '40%', status: 'Limited' },
              ].map((resort) => (
                <div key={resort.name} className="p-3 border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#4a3c31] text-sm">{resort.name}</div>
                    <div className="text-[10px] text-[#7d6b5e]">Local Time: {resort.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#657454]">{resort.occ}</div>
                    <div className="text-[10px] text-[#7d6b5e]">{resort.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'METRIC':
        const metricData = [
          { day: 'Mon', value: 400 },
          { day: 'Tue', value: 300 },
          { day: 'Wed', value: 550 },
          { day: 'Thu', value: 480 },
          { day: 'Fri', value: 700 },
          { day: 'Sat', value: 850 },
          { day: 'Sun', value: 920 },
        ];
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Detailed historical trend for {config.title.toLowerCase()}.</p>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricData}>
                  <Line type="monotone" dataKey="value" stroke="#C8A050" strokeWidth={3} dot={{ r: 4, fill: '#C8A050' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7d6b5e' }} dy={10} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 border-t border-[#d4c4b7] pt-4">
              <div className="font-bold text-sm text-[#4a3c31] mb-2">Key Drivers</div>
              <ul className="text-xs text-[#6A5848] space-y-2 list-disc pl-4">
                <li>Strong weekend demand from domestic travelers.</li>
                <li>Group bookings up 15% across all properties.</li>
                <li>Corporate negotiated rates performing above target.</li>
              </ul>
            </div>
          </div>
        );

      case 'ALERTS':
        return (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Actionable insights requiring attention.</p>
            <div className="p-4 border-l-4 border-[#a65e52] bg-[#f3eae1]/50 rounded-r-lg">
              <div className="font-bold text-[#a65e52] text-sm">Weather Impact: Sosei Alpine</div>
              <div className="text-xs text-[#4a3c31] mt-1">Heavy snowfall expected in 48 hours. Suggest preemptive equipment check and staffing alignment.</div>
              <div className="text-[10px] text-[#7d6b5e] mt-2">Action Required • High Priority</div>
            </div>
            <div className="p-4 border-l-4 border-[#C8A050] bg-[#f3eae1]/50 rounded-r-lg">
              <div className="font-bold text-[#C8A050] text-sm">Staffing Pressure: Sosei Ocean</div>
              <div className="text-xs text-[#4a3c31] mt-1">Approaching 95% occupancy this weekend. F&B department understaffed by 12%.</div>
              <div className="text-[10px] text-[#7d6b5e] mt-2">Monitoring • Medium Priority</div>
            </div>
            <div className="p-4 border-l-4 border-[#657454] bg-[#f3eae1]/50 rounded-r-lg">
              <div className="font-bold text-[#657454] text-sm">Wellness Demand Surge</div>
              <div className="text-xs text-[#4a3c31] mt-1">Spa bookings up 40% across Alpine and City locations. Consider dynamic pricing activation.</div>
              <div className="text-[10px] text-[#7d6b5e] mt-2">Opportunity • Low Priority</div>
            </div>
          </div>
        );

      case 'GUEST_MOVEMENT':
        const movementData = [
          { name: 'Alpine', arr: 120, in: 450, dep: 80 },
          { name: 'Ocean', arr: 90, in: 300, dep: 110 },
          { name: 'City', arr: 200, in: 600, dep: 180 },
        ];
        return (
          <div className="space-y-6 animate-fade-in">
             <p className="text-xs text-[#7d6b5e]">Arrivals, In-house, and Departures breakdown.</p>
             <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a3c31' }} width={50} />
                  <Tooltip cursor={{fill: '#E3CCB2', opacity: 0.2}} contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="arr" name="Arrivals" stackId="a" fill="#C8A050" />
                  <Bar dataKey="in" name="In-House" stackId="a" fill="#d4c4b7" />
                  <Bar dataKey="dep" name="Departures" stackId="a" fill="#a65e52" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'PORTFOLIO_PERFORMANCE':
        return (
          <div className="space-y-6 animate-fade-in">
             <p className="text-xs text-[#7d6b5e]">Financial breakdown per property (MTD).</p>
             <div className="overflow-x-auto">
               <table className="w-full text-xs text-[#4a3c31]">
                 <thead>
                   <tr className="border-b border-[#d4c4b7] text-left">
                     <th className="pb-2 font-bold">Property</th>
                     <th className="pb-2 font-bold text-right">RevPAR</th>
                     <th className="pb-2 font-bold text-right">GOP Margin</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr className="border-b border-[#d4c4b7]/50">
                     <td className="py-3">Sosei Alpine</td>
                     <td className="py-3 text-right">$840</td>
                     <td className="py-3 text-right text-[#657454]">38%</td>
                   </tr>
                   <tr className="border-b border-[#d4c4b7]/50">
                     <td className="py-3">Sosei Ocean</td>
                     <td className="py-3 text-right">$620</td>
                     <td className="py-3 text-right text-[#657454]">34%</td>
                   </tr>
                   <tr className="border-b border-[#d4c4b7]/50">
                     <td className="py-3">Sosei City</td>
                     <td className="py-3 text-right">$910</td>
                     <td className="py-3 text-right text-[#657454]">41%</td>
                   </tr>
                   <tr>
                     <td className="py-3">Sosei Forest</td>
                     <td className="py-3 text-right">$450</td>
                     <td className="py-3 text-right text-[#a65e52]">22%</td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>
        );

      case 'TOP_NATIONALITIES':
        const pieData = [
          { name: 'US', value: 24, color: '#C8A050' },
          { name: 'UK', value: 12, color: '#A58B6D' },
          { name: 'DE', value: 9, color: '#88735C' },
          { name: 'IN', value: 8, color: '#6A5848' },
          { name: 'Other', value: 47, color: '#d4c4b7' },
        ];
        return (
          <div className="space-y-6 animate-fade-in">
             <p className="text-xs text-[#7d6b5e]">Demographic distribution.</p>
             <div className="h-[200px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.slice(0,4).map(d => (
                <div key={d.name} className="flex justify-between text-xs border-b border-[#d4c4b7]/50 pb-1">
                  <span className="text-[#4a3c31] font-bold">{d.name}</span>
                  <span className="text-[#7d6b5e]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SENTIMENT_SCORE':
        return (
          <div className="space-y-6 animate-fade-in">
             <p className="text-xs text-[#7d6b5e]">Score breakdown and recent qualitative feedback.</p>
             <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-xs text-[#4a3c31]">
                  <span>Cleanliness</span><span className="font-bold">4.9/5</span>
                </div>
                <div className="w-full bg-[#d4c4b7] h-1.5 rounded-full"><div className="bg-[#C8A050] h-1.5 rounded-full w-[98%]"></div></div>
                
                <div className="flex justify-between text-xs text-[#4a3c31] mt-2">
                  <span>Service</span><span className="font-bold">4.8/5</span>
                </div>
                <div className="w-full bg-[#d4c4b7] h-1.5 rounded-full"><div className="bg-[#C8A050] h-1.5 rounded-full w-[96%]"></div></div>
             </div>

             <div className="space-y-3">
               <div className="p-3 bg-white/40 rounded-lg border border-[#d4c4b7]">
                 <div className="text-xs italic text-[#4a3c31]">"Absolutely stunning resort. The spa at Alpine was world-class."</div>
                 <div className="text-[10px] font-bold text-[#C8A050] mt-2">- J. Smith (US)</div>
               </div>
               <div className="p-3 bg-white/40 rounded-lg border border-[#d4c4b7]">
                 <div className="text-xs italic text-[#4a3c31]">"Impeccable service, though the dining options were somewhat limited at night."</div>
                 <div className="text-[10px] font-bold text-[#C8A050] mt-2">- M. Weber (DE)</div>
               </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-[#fdfaf7] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-l border-[#d4c4b7] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="shrink-0 p-6 flex justify-between items-center border-b border-[#d4c4b7]/50 bg-gradient-to-b from-[#f3eae1]/50 to-transparent">
          <h2 className="font-serif text-2xl text-[#4a3c31]">{config?.title || 'Details'}</h2>
          <button 
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-[#e5d8cb] text-[#6A5848] transition-colors"
          >
            <CloseCircle size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
