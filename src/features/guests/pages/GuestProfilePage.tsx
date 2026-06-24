import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CrownStar,
  User,
  MapPoint,
  Letter,
  Phone,
  ChatDots,
  Global,
  Sun,
  Heart,
  Plate,
  Bed,
  MoonSleep,
  UsersGroupTwoRounded,
  Bus,
  HomeAngle,
  Suitcase,
  Gift,
  Calendar,
  AltArrowRight
} from '@solar-icons/react';

import oceanImg from '../../../assets/contents/ocean.png';
import alpineImg from '../../../assets/contents/alpine.png';
import desertImg from '../../../assets/contents/desert.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';

export function GuestProfilePage() {
  useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">

      {/* Back button & Header */}
      <div className="flex flex-col mb-6 animate-card-enter">
        <button
          onClick={() => navigate('/dashboard/guests')}
          className="flex items-center text-[#7d6b5e] hover:text-[#4a3c31] transition-colors w-fit mb-2 text-sm gap-2"
        >
          <ArrowLeft size={16} /> Back to Guests
        </button>
        <div className="flex items-baseline gap-4">
          <h1 className="text-4xl font-serif text-[#4a3c31]">The Anderson Family</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[#7d6b5e]">
          <CrownStar size={18} className="text-[#C8A050]" />
          <span className="font-medium text-[#4a3c31]">Loyalty tier: Gold</span>
          <span className="mx-1">•</span>
          <span>SOSEI Circle Member since May 2021</span>
        </div>
      </div>

      {/* Grid Layout - 3 Explicit Rows */}
      <div className="flex flex-col gap-4 text-xs">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter" style={{ animationDelay: '0.1s' }}>

          {/* Profile & Contact (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] overflow-hidden backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <img src={forestImg} alt="Anderson Family" className="w-full h-36 object-cover" />
            <div className="p-4 grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <User size={12} /> Primary Contact
                </div>
                <div className="text-[#4a3c31] font-medium">John Anderson</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <MapPoint size={12} /> Location
                </div>
                <div className="text-[#4a3c31] font-medium">New York, USA</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <Letter size={12} /> Email
                </div>
                <div className="text-[#4a3c31] font-medium truncate" title="john.anderson@vervast.com">john.anderson@vervast.com</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <Phone size={12} /> Phone
                </div>
                <div className="text-[#4a3c31] font-medium">+1 (212) 555-7842</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <ChatDots size={12} /> Preferred Communication
                </div>
                <div className="text-[#4a3c31] font-medium">Email, WhatsApp</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-[#7d6b5e] font-bold uppercase tracking-widest text-[9px] mb-1">
                  <Global size={12} /> Language
                </div>
                <div className="text-[#4a3c31] font-medium">English, Indonesian</div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium">
                View full guest profile <AltArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Family Rhythm & Preferences (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Family Rhythm & Preferences</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 flex-1">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <Sun size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Morning Rhythm</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">Slow mornings, coffee on the terrace<br />Breakfast between 8:00 - 9:30 AM</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Heart size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Wellness</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">Yoga 4x per week<br />Prefers spa treatments in the afternoon</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Plate size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Dining</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">Prefers light, healthy cuisine<br />Loves Italian and Japanese</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <Bed size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Room Preferences</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">High floor, ocean or mountain view<br />Connecting rooms for family</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <MoonSleep size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Sleep Rhythm</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">Lights out by 10:00 PM<br />White noise, cool temperature</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <UsersGroupTwoRounded size={20} className="text-[#947b66] shrink-0" />
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Family Activities</div>
                    <div className="text-[#7d6b5e] text-[10px] leading-snug">Enjoys nature, cultural experiences<br />Kids love outdoor and creative activities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Stay (col-span-5) */}
          <div className="col-span-1 lg:col-span-5 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-[#d4c4b7] pb-3 mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31]">Upcoming Stay</h3>
                <span className="text-[9px] font-bold text-[#C8A050] tracking-widest uppercase">Confirmed</span>
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                <img src={oceanImg} alt="Upcoming Stay" className="w-full md:w-[220px] h-[130px] object-cover rounded-lg" />
                <div className="flex flex-col justify-center gap-2">
                  <div>
                    <h4 className="text-xl font-serif text-[#4a3c31] leading-none mb-1">SOSEI Mizu</h4>
                    <div className="text-[#4a3c31] text-[11px]">Maldives</div>
                  </div>

                  <div className="flex flex-col gap-2 text-[#4a3c31] text-[10px] mt-2">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-[#947b66] stroke-[1.5]" /> May 24 - May 30, 2027</div>
                    <div className="flex items-center gap-2"><User size={16} className="text-[#947b66] stroke-[1.5]" /> 2 Adults, 2 Children</div>
                    <div className="flex items-center gap-2"><Bed size={16} className="text-[#947b66] stroke-[1.5]" /> Ocean Pavilion</div>
                  </div>
                  <button className="text-[10px] text-[#C8A050] hover:text-[#a6823c] transition-colors flex items-center gap-1 font-medium mt-2">
                    View itinerary <AltArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto custom-scrollbar border border-[#d4c4b7] rounded-lg mt-5 bg-[#f3eae1]/10 gap-2 md:gap-0 pb-1 md:pb-0">
              {[
                { icon: <Bus size={32} strokeWidth={1} />, label: "Airport Transfer", desc: "Confirmed" },
                { icon: <HomeAngle size={32} strokeWidth={1} />, label: "Villa Preference", desc: "Ocean Pavilion" },
                { icon: <Suitcase size={32} strokeWidth={1} />, label: "Excursion", desc: "Sailing / Yacht\nMay 25" },
                { icon: <Plate size={32} strokeWidth={1} />, label: "Dining Request", desc: "Private dinner\nMay 26" },
                { icon: <Gift size={32} strokeWidth={1} />, label: "Special Occasion", desc: "Anniversary\nJune 12" },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex items-center shrink-0 min-w-[85px] md:min-w-0">
                  <div className="flex-1 py-4 px-1 flex flex-col items-center justify-center text-center group">
                    <div className="text-[#947b66] mb-2">{item.icon}</div>
                    <div className="text-[9px] font-bold text-[#4a3c31] leading-tight mb-1">
                      <span className="border-b-[1.5px] border-[#4a3c31] pb-0.5">{item.label}</span>
                    </div>
                    <div className="text-[9px] text-[#4a3c31] leading-tight whitespace-pre-line mt-0.5">{item.desc}</div>
                  </div>
                  {idx < 4 && <div className="w-[1px] h-12 bg-[#d4c4b7] shrink-0" />}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter" style={{ animationDelay: '0.2s' }}>

          {/* Journey Timeline (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Journey Timeline</h3>
            <div className="flex flex-col gap-4 flex-1 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#d4c4b7]">
              {[
                { date: 'Mar 2025', name: 'SOSEI Alpine', loc: 'Nocturne, Switzerland', img: alpineImg },
                { date: 'Aug 2024', name: 'SOSEI City', loc: 'Solace, Singapore', img: cityImg },
                { date: 'Feb 2024', name: 'SOSEI Desert', loc: 'Asahi, Oman', img: desertImg },
                { date: 'May 2023', name: 'SOSEI Ocean', loc: 'Mizu, Maldives', img: oceanImg },
                { date: 'May 2022', name: 'SOSEI Forest', loc: 'Nadi, Bali', img: forestImg },
              ].map((stay, idx) => (
                <div key={idx} className="flex gap-4 relative z-10 items-center">
                  <img src={stay.img} className="w-6 h-6 rounded-full object-cover border border-[#f3eae1] shadow-sm shrink-0" alt={stay.name} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#4a3c31]">{stay.date}</span>
                  </div>
                  <div className="flex flex-col ml-auto text-right">
                    <span className="text-[11px] text-[#4a3c31] font-medium">{stay.name}</span>
                    <span className="text-[9px] text-[#7d6b5e]">{stay.loc}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-4">
              View all journeys <AltArrowRight size={12} />
            </button>
          </div>

          {/* Moments that Matter (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Moments That Matter</h3>
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-3">
                <Gift size={20} className="text-[#947b66] shrink-0" />
                <div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-bold text-[#4a3c31] text-[11px]">Anniversary Celebration</div>
                    <div className="text-[9px] font-bold text-[#4a3c31]">Jun 12</div>
                  </div>
                  <div className="text-[#7d6b5e] text-[10px] leading-snug">Celebrate their anniversary with a private dinner setup.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun size={20} className="text-[#947b66] shrink-0" />
                <div>
                  <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Kids' Favorite Activity</div>
                  <div className="text-[#7d6b5e] text-[10px] leading-snug">Marine conservation experience was a highlight.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun size={20} className="text-[#947b66] shrink-0" />
                <div>
                  <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Sunset Lovers</div>
                  <div className="text-[#7d6b5e] text-[10px] leading-snug">Prefers sunset experiences and quiet ocean views.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <User size={20} className="text-[#947b66] shrink-0" />
                <div>
                  <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Preferred Staff</div>
                  <div className="text-[#7d6b5e] text-[10px] leading-snug">Requests Maria (butler) when available.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Heart size={20} className="text-[#947b66] shrink-0" />
                <div>
                  <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">Meaningful Moments</div>
                  <div className="text-[#7d6b5e] text-[10px] leading-snug">They loved sunset yacth experience and morning photography walk.</div>
                </div>
              </div>
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-4">
              View all memories <AltArrowRight size={12} />
            </button>
          </div>

          {/* Intelligent Recommendations (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Intelligent Recommendations</h3>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { title: "Private Sunset Dinner", desc: "Usually enjoyed on the third evening of ocean stays.", rec: "Recommended for May 26", img: oceanImg },
                { title: "Wellness Journey", desc: "Consider a couple's treatment on May 27 afternoon.", rec: "Recommended", img: alpineImg },
                { title: "Family Adventure", desc: "Private snorkeling excursion the family enjoys.", rec: "Recommended for May 28", img: desertImg },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <img src={item.img} className="w-16 h-10 object-cover rounded shadow-sm shrink-0" alt={item.title} />
                  <div className="flex-1">
                    <div className="font-bold text-[#4a3c31] text-[11px] mb-0.5">{item.title}</div>
                    <div className="text-[#7d6b5e] text-[9px] leading-tight mb-1">{item.desc}</div>
                    <div className="text-[#C8A050] text-[9px] font-medium">{item.rec}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-4">
              View more recommendations <AltArrowRight size={12} />
            </button>
          </div>

          {/* Family Evolution (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Family Evolution</h3>

            <div className="flex justify-between mb-4 border-b border-[#d4c4b7] pb-3 text-center">
              <div className="flex flex-col items-center">
                <UsersGroupTwoRounded size={20} className="text-[#947b66] mb-1 opacity-50" />
                <span className="text-[9px] text-[#4a3c31] leading-tight mt-1">Couple</span>
                <span className="text-[9px] font-bold text-[#4a3c31] mt-2">2022</span>
              </div>
              <div className="flex flex-col items-center">
                <UsersGroupTwoRounded size={20} className="text-[#947b66] mb-1 opacity-70" />
                <span className="text-[9px] text-[#4a3c31] leading-tight mt-1">Family with<br />Young Kids</span>
                <span className="text-[9px] font-bold text-[#4a3c31] mt-1">2023</span>
              </div>
              <div className="flex flex-col items-center">
                <UsersGroupTwoRounded size={24} className="text-[#947b66] mb-1" />
                <span className="text-[9px] font-bold text-[#4a3c31] leading-tight mt-1">Growing<br />Together</span>
                <span className="text-[9px] font-bold text-[#4a3c31] mt-1">2024</span>
              </div>
              <div className="flex flex-col items-center">
                <Gift size={20} className="text-[#947b66] mb-1 opacity-50" />
                <span className="text-[9px] text-[#4a3c31] leading-tight mt-1">Bonding &<br />Experiences</span>
                <span className="text-[9px] font-bold text-[#4a3c31] mt-1">2025</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#7d6b5e]">Travel Frequency</span>
                <span className="text-[#4a3c31] font-medium flex items-center gap-1">↑ Increasing</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#7d6b5e]">Wellness Focus</span>
                <span className="text-[#4a3c31] font-medium flex items-center gap-1">↑ Increasing</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#7d6b5e]">Adventure & Nature</span>
                <span className="text-[#4a3c31] font-medium flex items-center gap-1">↑ Increasing</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#7d6b5e]">Cultural Experiences</span>
                <span className="text-[#4a3c31] font-medium flex items-center gap-1">↑ Increasing</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#7d6b5e]">Multi-generational</span>
                <span className="text-[#4a3c31] font-bold">–</span>
              </div>
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-3">
              View full evolution <AltArrowRight size={12} />
            </button>
          </div>

        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter" style={{ animationDelay: '0.3s' }}>

          {/* Relationship Notes (col-span-3) */}
          <div className="col-span-1 lg:col-span-3 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Relationship Notes</h3>
            <div className="text-[#C8A050] text-3xl font-serif leading-none mt-2 h-4">"</div>
            <p className="text-[11px] text-[#4a3c31] italic px-2 mb-2 leading-relaxed flex-1">
              The Anderson family values meaningful experiences, personalized touches, and time together.<br /><br />
              They appreciate thoughtfulness and consistency.
            </p>
            <p className="text-[9px] text-[#7d6b5e] text-right mt-1">— Front Office Team</p>
          </div>

          {/* Stay Summary & Spend Overview (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Stay Summary and Spend Overview</h3>
            <div className="grid grid-cols-2 sm:flex sm:justify-between w-full text-center flex-1 py-2 gap-4 sm:gap-0">
              <div className="flex flex-col justify-center flex-1">
                <div className="text-[8px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Total Stays</div>
                <div className="text-3xl font-serif text-[#4a3c31]">6</div>
                <div className="text-[9px] text-[#7d6b5e] mt-1">Across 5 properties</div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <div className="text-[8px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Av.<br />Length of Stay</div>
                <div className="text-3xl font-serif text-[#4a3c31]">4.8</div>
                <div className="text-[9px] text-[#7d6b5e] mt-1">Nights</div>
              </div>
              <div className="flex flex-col justify-center flex-[1.2] border-l border-[#d4c4b7] pl-4">
                <div className="text-[8px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Total Spend<br />(All Time)</div>
                <div className="text-2xl font-serif text-[#4a3c31] mt-1">$78,460</div>
                <div className="text-[9px] text-[#7d6b5e] mt-1">Across 6 stays</div>
              </div>
              <div className="flex flex-col justify-center flex-[1.2]">
                <div className="text-[8px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Av. Spend<br />Per Stay</div>
                <div className="text-2xl font-serif text-[#4a3c31] mt-1">$13,077</div>
                <div className="text-[9px] text-[#947b66] font-medium mt-1">+18% vs. last year</div>
              </div>
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-4">
              View stay details <AltArrowRight size={12} />
            </button>
          </div>

          {/* Booking Profile & Communication Preference (col-span-5) */}
          <div className="col-span-1 lg:col-span-5 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm bg-[#f3eae1]/30  flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] border-b border-[#d4c4b7] pb-3 mb-4">Booking Profile & Communication Preference</h3>
            <div className="flex flex-col sm:flex-row flex-1 items-stretch gap-4 sm:gap-0 sm:items-center">
              <div className="w-full sm:w-[120px] text-center border-b sm:border-b-0 sm:border-r border-[#d4c4b7] pb-4 sm:pb-0 sm:pr-6 flex flex-col justify-center shrink-0">
                <div className="text-[9px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Booking Window</div>
                <div className="text-3xl font-serif text-[#4a3c31] font-medium">94</div>
                <div className="text-[9px] text-[#7d6b5e] mt-1">Days average</div>
              </div>
              <div className="flex-1 pl-0 sm:pl-6 flex flex-col justify-center gap-4">
                <div className="grid grid-cols-[130px_1fr] items-center text-[10px]">
                  <span className="text-[#4a3c31] font-bold">Booking Channel</span>
                  <span className="text-[#4a3c31]">Virtuoso Travel Advisor</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] items-start text-[10px]">
                  <span className="text-[#4a3c31] font-bold mt-0.5">Loyalty & Affiliations</span>
                  <span className="text-[#4a3c31] leading-tight">American Express Fine Hotels + Resorts</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] items-start text-[10px]">
                  <span className="text-[#4a3c31] font-bold mt-0.5">Primary Contact</span>
                  <span className="text-[#4a3c31] leading-tight">Personal Assistant - Lisa Morgan</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] items-center text-[10px]">
                  <span className="text-[#4a3c31] font-bold">Preferred Channel</span>
                  <span className="text-[#4a3c31]">WhatsApp</span>
                </div>
              </div>
            </div>
            <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] transition-colors flex items-center gap-1 font-medium mt-4">
              View details <AltArrowRight size={12} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
