import { useParams, useNavigate } from 'react-router-dom';

import oceanImg from '../../../assets/contents/ocean.png';
import alpineImg from '../../../assets/contents/alpine.png';
import desertImg from '../../../assets/contents/desert.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';

export function IndividualGuestProfilePage() {
  useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">

      {/* Header & Back button */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">John Anderson</h2>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-semibold text-zinc-900">Loyalty tier: Gold</span>
            <span className="mx-0.5">•</span>
            <span className="font-normal">SOSEI Circle Member since May 2021</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/guests/individual')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-normal pb-0.5 cursor-pointer"
        >
          <span>&larr;</span> Back to Guests
        </button>
      </div>

      {/* Grid Layout - 3 Explicit Rows (Strictly Baseline-Aligned & Dashboard-Style Hover) */}
      <div className="flex flex-col gap-6 text-[10px]">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>

          {/* Profile & Contact (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-3 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Guest Profile</h3>
            </div>

            <img src={forestImg} alt="John Anderson" className="w-full h-[125px] object-cover rounded-lg shadow-xs shrink-0" />

            <div className="pt-3 grid grid-cols-2 gap-3 flex-1">
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Full Name
                </div>
                <div className="text-zinc-900 font-medium text-[10px]">John Anderson</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Location
                </div>
                <div className="text-zinc-900 font-medium text-[10px]">New York, USA</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Email
                </div>
                <div className="text-zinc-900 font-medium text-[10px] truncate" title="john.anderson@vervast.com">john.anderson@vervast.com</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Phone
                </div>
                <div className="text-zinc-900 font-medium text-[10px]">+1 (212) 555-7842</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Preferred Channel
                </div>
                <div className="text-zinc-900 font-medium text-[10px]">Email, WhatsApp</div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-zinc-500 font-medium text-[9.5px]">
                  Language
                </div>
                <div className="text-zinc-900 font-medium text-[10px]">English, French</div>
              </div>
            </div>
          </div>

          {/* Guest Rhythm & Preferences (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-3 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Rhythm & Preferences</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 flex-1">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Morning Rhythm</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">Early riser, espresso on terrace<br />Breakfast at 7:30 AM</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Wellness</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">Daily cardio & sauna session<br />Deep tissue massage</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Dining</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">Omakase & Mediterranean<br />Prefers natural biodynamic wine</div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Room Preferences</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">Top floor corner suite<br />Feather pillows & quiet area</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Work Rhythm</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">High-speed Wi-Fi required<br />Quiet workspace in suite</div>
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[10.5px] mb-0.5">Leisure Activities</div>
                  <div className="text-zinc-500 text-[10px] font-normal leading-snug">Sailing, private yacht charter<br />Contemporary art galleries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Stay (col-span-5) */}
          <div className="col-span-1 lg:col-span-5 rounded-[12px] p-3 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Stay</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-stretch">
              {/* Left: Image on Top, Clean Key Details Below (col-7) */}
              <div className="col-span-1 md:col-span-7 flex flex-col justify-between h-full gap-2.5">
                <div className="rounded-lg overflow-hidden shrink-0">
                  <img src={oceanImg} alt="SOSEI Mizu" className="w-full h-[125px] object-cover" />
                </div>

                <div className="flex flex-col flex-1 justify-between gap-2.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h4 className="text-xl font-serif text-zinc-900 leading-none">SOSEI Mizu</h4>
                      <div className="text-zinc-500 text-[10px] font-normal mt-1">North Malé Atoll, Maldives</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9.5px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-500 font-medium">Stay Period</span>
                      <span className="font-medium text-zinc-900 text-[10px]">May 24 – 30, 2027</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-500 font-medium">Party</span>
                      <span className="font-medium text-zinc-900 text-[10px]">1 Adult</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-500 font-medium">Accommodation</span>
                      <span className="font-medium text-zinc-900 text-[10px]">Sunset Water Villa</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-500 font-medium">Dedicated Service</span>
                      <span className="font-medium text-zinc-900 text-[10px]">Butler Maria</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Clean Item List (col-5) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-between h-full pt-0 pb-0.5">
                {[
                  { label: "Airport Transfer", desc: "Private Yacht Transfer" },
                  { label: "Villa Preference", desc: "Sunset Water Villa · Unobstructed" },
                  { label: "Dining Reservation", desc: "Omakase Counter · May 25" },
                  { label: "Special Requests", desc: "In-villa Yoga Mat & Foam Roller" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-medium text-zinc-900 leading-none">{item.label}</span>
                    <span className="text-[9.5px] font-normal text-zinc-500 leading-tight">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter pt-5 border-t border-zinc-100 -mx-3" style={{ animationDelay: '0.2s' }}>

          {/* Journey Timeline (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Journey Timeline</h3>
            </div>
            <div className="flex flex-col justify-between flex-1 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200 py-1 gap-3">
              {[
                { date: 'Mar 2025', name: 'SOSEI Alpine', loc: 'Switzerland', img: alpineImg },
                { date: 'Aug 2024', name: 'SOSEI City', loc: 'Singapore', img: cityImg },
                { date: 'Feb 2024', name: 'SOSEI Desert', loc: 'Oman', img: desertImg },
                { date: 'May 2023', name: 'SOSEI Ocean', loc: 'Maldives', img: oceanImg },
              ].map((stay, idx) => (
                <div key={idx} className="flex gap-3 relative z-10 items-center">
                  <img src={stay.img} className="w-8 h-8 rounded-full object-cover border border-white shadow-xs shrink-0" alt={stay.name} />
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 text-[10.5px] leading-tight">{stay.name}</span>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-zinc-500 font-normal mt-0.5">
                      <span>{stay.date}</span>
                      <span className="text-zinc-300">·</span>
                      <span>{stay.loc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moments that Matter (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Moments That Matter</h3>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1 gap-3">
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Private Alpine Excursion</span>
                  <span className="text-[9px] font-semibold text-zinc-500">Mar 2025</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Helicopter tour over glacier with mountain guide.</div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Preferred Butler</span>
                  <span className="text-[9px] font-semibold text-zinc-500">Maria</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Always requests Butler Maria when staying at Ocean properties.</div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Culinary Passion</span>
                  <span className="text-[9px] font-semibold text-zinc-500">Wine & Dining</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Enjoys private cellar tastings and chef pairings.</div>
              </div>
            </div>
          </div>

          {/* Intelligent Recommendations (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Intelligent Recommendations</h3>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1 gap-3">
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Private Sommelier Tasting</span>
                  <span className="text-[9px] font-semibold text-zinc-500">May 26</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Curated cellar exploration of rare vintage sakes.</div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Wellness Recovery Ritual</span>
                  <span className="text-[9px] font-semibold text-zinc-500">May 27</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Post-flight hydrotherapy & therapeutic massage.</div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-zinc-900 text-[10.5px]">Sunset Yacht Voyage</span>
                  <span className="text-[9px] font-semibold text-zinc-500">May 28</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-normal leading-snug">Private charter to secluded reef lagoons.</div>
              </div>
            </div>
          </div>

          {/* Guest Evolution (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Guest Evolution</h3>
            </div>

            <div className="flex justify-between mb-3 text-center pt-0.5">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 font-normal">Standard</span>
                <span className="text-[9.5px] font-bold text-zinc-900 mt-1">2021</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 font-normal">Silver</span>
                <span className="text-[9.5px] font-bold text-zinc-900 mt-1">2022</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-500 font-normal">Gold</span>
                <span className="text-[9.5px] font-bold text-zinc-900 mt-1">2024</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-zinc-900 font-medium">VIP</span>
                <span className="text-[9.5px] font-bold text-zinc-900 mt-1">2026</span>
              </div>
            </div>

            <div className="flex flex-col justify-between flex-1 pt-2 border-t border-zinc-100 gap-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-normal">Travel Frequency</span>
                <span className="text-zinc-900 font-medium">↑ 3.2 Trips/Yr</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-normal">Wellness Focus</span>
                <span className="text-zinc-900 font-medium">↑ Very High</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-normal">Culinary Focus</span>
                <span className="text-zinc-900 font-medium">↑ High</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter pt-5 border-t border-zinc-100 -mx-3" style={{ animationDelay: '0.3s' }}>

          {/* Relationship Notes (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Relationship Notes</h3>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1">
              <p className="text-[10.5px] text-zinc-800 italic font-normal leading-relaxed">
                “John values efficient service, privacy, and curated culinary experiences. Always confirm dietary preferences before arrival.”
              </p>
              <div className="text-[9.5px] text-zinc-500 font-medium text-right mt-2">
                — Guest Experience Manager
              </div>
            </div>
          </div>

          {/* Stay Summary & Spend Overview (col-span-5) */}
          <div className="col-span-1 lg:col-span-5 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Stay Summary and Spend Overview</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 w-full text-center flex-1 py-1 gap-3 sm:gap-1 items-stretch">
              <div className="flex flex-col justify-between h-full py-0.5">
                <span className="text-[9.5px] font-medium text-zinc-500">Total Stays</span>
                <span className="text-[22px] font-normal text-zinc-900 leading-none my-auto">6</span>
                <span className="text-[9px] text-zinc-500 font-normal">5 properties</span>
              </div>
              <div className="flex flex-col justify-between h-full py-0.5">
                <span className="text-[9.5px] font-medium text-zinc-500">Av. Length of Stay</span>
                <span className="text-[22px] font-normal text-zinc-900 leading-none my-auto">4.8</span>
                <span className="text-[9px] text-zinc-500 font-normal">Nights</span>
              </div>
              <div className="flex flex-col justify-between h-full py-0.5">
                <span className="text-[9.5px] font-medium text-zinc-500">Total Spend</span>
                <span className="text-[22px] font-normal text-zinc-900 leading-none my-auto">$78,460</span>
                <span className="text-[9px] text-zinc-500 font-normal">All time</span>
              </div>
              <div className="flex flex-col justify-between h-full py-0.5">
                <span className="text-[9.5px] font-medium text-zinc-500">Av. Spend Per Stay</span>
                <span className="text-[22px] font-normal text-zinc-900 leading-none my-auto">$13,077</span>
                <span className="text-[9px] text-emerald-700 font-medium">+18% YoY</span>
              </div>
            </div>
          </div>

          {/* Booking Profile (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Booking Profile</h3>
            </div>
            <div className="flex flex-col sm:flex-row flex-1 items-stretch gap-3 sm:gap-4 py-1">
              <div className="w-full sm:w-[90px] text-center flex flex-col justify-between shrink-0 h-full py-0.5">
                <span className="text-[9.5px] font-medium text-zinc-500">Booking Window</span>
                <span className="text-[22px] font-normal text-zinc-900 leading-none my-auto">94</span>
                <span className="text-[9px] text-zinc-500 font-normal">Days avg</span>
              </div>
              <div className="flex-1 flex flex-col justify-between h-full border-l border-zinc-100 pl-4 py-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-medium">Channel</span>
                  <span className="text-zinc-900 font-medium">Virtuoso Advisor</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-medium">Affiliation</span>
                  <span className="text-zinc-900 font-medium truncate ml-2">Amex FHR</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-medium">Primary Contact</span>
                  <span className="text-zinc-900 font-medium truncate ml-2">PA Lisa Morgan</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-medium">Preferred Channel</span>
                  <span className="text-zinc-900 font-medium">WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
