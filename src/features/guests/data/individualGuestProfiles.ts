import maldivesImg from '../../../assets/contents/property_maldives.jpg';
import baliImg from '../../../assets/contents/property_bali.jpg';
import switzerlandImg from '../../../assets/contents/property_switzerland.jpg';
import urbanImg from '../../../assets/contents/property_urban.jpg';
import costaRicaImg from '../../../assets/contents/property_costa_rica.jpg';
import japanImg from '../../../assets/contents/property_japan.jpg';
import omanImg from '../../../assets/contents/property_oman.jpg';
import egyptImg from '../../../assets/contents/property_egypt.jpg';
import johnAndersonImg from '../../../assets/contents/john-anderson.jpg';

const PROPERTY_IMG: Record<string, string> = {
  'SOSEI Andermatt': switzerlandImg,
  'SOSEI El Gouna': egyptImg,
  'SOSEI AUH': maldivesImg,
  'SOSEI Melides': costaRicaImg,
  'SOSEI Umbria': japanImg,
  'SOSEI Tinos': omanImg,
  'SOSEI Barcelona': urbanImg,
  'SOSEI OSA': costaRicaImg,
  'SOSEI Bali': baliImg,
  'SOSEI Tokyo': urbanImg,
};

type Pair = [string, string];

export type GuestType = 'Individual' | 'Corporate' | 'Travel Agent';

export interface GuestJourneyStay {
  date: string;
  name: string;
  loc: string;
  img: string;
  bookingId?: string;
}

export interface GuestMoment {
  title: string;
  tag: string;
  desc: string;
  bookingId?: string;
}

export interface IndividualGuestProfile {
  id: string;
  name: string;
  tier: string;
  /** Guest status: a person, a corporate account, or a travel agent. */
  guestType: GuestType;
  memberSince: string;
  /** Portrait photo. When omitted the page renders an initials monogram. */
  photo?: string;
  location: string;
  email: string;
  phone: string;
  channel: string;
  language: string;
  rhythm: {
    morning: Pair;
    room: Pair;
    wellness: Pair;
    work: Pair;
    dining: Pair;
    leisure: Pair;
  };
  upcoming: {
    property: string;
    place: string;
    period: string;
    party: string;
    accommodation: string;
    service: string;
    img: string;
    bookingId?: string;
    items: { label: string; desc: string }[];
  };
  journey: GuestJourneyStay[];
  moments: GuestMoment[];
  recommendations: GuestMoment[];
  evolution: {
    steps: { label: string; year: string }[];
    trends: { label: string; value: string }[];
  };
  note: { quote: string; author: string };
  stats: { stays: string; properties: string; avLos: string; spend: string; avgSpend: string; yoy: string };
  booking: { window: string; channel: string; affiliation: string; contact: string; preferredChannel: string };
}

export const individualGuestProfiles: Record<string, IndividualGuestProfile> = {
  'GST-001': {
    id: 'GST-001',
    guestType: 'Individual',
    name: 'John Anderson',
    tier: 'Gold',
    memberSince: 'May 2021',
    photo: johnAndersonImg,
    location: 'New York, USA',
    email: 'john.anderson@vervast.com',
    phone: '+1 (212) 555-7842',
    channel: 'Email, WhatsApp',
    language: 'English, French',
    rhythm: {
      morning: ['Early riser, espresso on terrace', 'Breakfast at 7:30 AM'],
      room: ['Top floor corner suite', 'Feather pillows & quiet area'],
      wellness: ['Daily cardio & sauna session', 'Deep tissue massage'],
      work: ['High-speed Wi-Fi required', 'Quiet workspace in suite'],
      dining: ['Omakase & Mediterranean', 'Prefers natural biodynamic wine'],
      leisure: ['Sailing, private yacht charter', 'Contemporary art galleries'],
    },
    upcoming: {
      property: 'SOSEI AUH',
      place: 'Abu Dhabi, UAE',
      period: 'May 24 – 30, 2027',
      party: '1 Adult',
      accommodation: 'Sunset Water Villa',
      service: 'Butler Maria',
      img: PROPERTY_IMG['SOSEI AUH'],
      bookingId: 'BK-JA-01',
      items: [
        { label: 'Airport Transfer', desc: 'Private Yacht Transfer' },
        { label: 'Villa Preference', desc: 'Sunset Water Villa · Unobstructed' },
        { label: 'Dining Reservation', desc: 'Omakase Counter · May 25' },
        { label: 'Special Requests', desc: 'In-villa Yoga Mat & Foam Roller' },
      ],
    },
    journey: [
      { date: 'Mar 2025', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'], bookingId: 'BK-JA-02' },
      { date: 'Aug 2024', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'], bookingId: 'BK-JA-03' },
      { date: 'Feb 2024', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'], bookingId: 'BK-JA-04' },
      { date: 'May 2023', name: 'SOSEI AUH', loc: 'UAE', img: PROPERTY_IMG['SOSEI AUH'], bookingId: 'BK-JA-05' },
    ],
    moments: [
      { title: 'Private Alpine Excursion', tag: 'Mar 2025', desc: 'Helicopter tour over glacier with mountain guide.', bookingId: 'BK-JA-02' },
      { title: 'Preferred Butler', tag: 'Maria', desc: 'Always requests Butler Maria when staying at Ocean properties.', bookingId: 'BK-JA-01' },
      { title: 'Culinary Passion', tag: 'Wine & Dining', desc: 'Enjoys private cellar tastings and chef pairings.', bookingId: 'BK-JA-03' },
    ],
    recommendations: [
      { title: 'Private Sommelier Tasting', tag: 'May 26', desc: 'Curated cellar exploration of rare vintage sakes.' },
      { title: 'Wellness Recovery Ritual', tag: 'May 27', desc: 'Post-flight hydrotherapy & therapeutic massage.' },
      { title: 'Sunset Yacht Voyage', tag: 'May 28', desc: 'Private charter to secluded reef lagoons.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2021' },
        { label: 'Silver', year: '2022' },
        { label: 'Gold', year: '2024' },
        { label: 'VIP', year: '2026' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 3.2 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ Very High' },
        { label: 'Culinary Focus', value: '↑ High' },
      ],
    },
    note: {
      quote: 'John values efficient service, privacy, and curated culinary experiences. Always confirm dietary preferences before arrival.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '6', properties: '5 properties', avLos: '4.8', spend: '$78,460', avgSpend: '$13,077', yoy: '+18% YoY' },
    booking: { window: '94', channel: 'Virtuoso Advisor', affiliation: 'Amex FHR', contact: 'PA Lisa Morgan', preferredChannel: 'WhatsApp' },
  },

  'GST-002': {
    id: 'GST-002',
    guestType: 'Individual',
    name: 'Theodore Laurence',
    tier: 'Platinum',
    memberSince: 'Jan 2022',
    location: 'Boston, USA',
    email: 't.laurence@laurence.org',
    phone: '+1 (617) 555-0143',
    channel: 'Phone, Email',
    language: 'English, Italian',
    rhythm: {
      morning: ['Sunrise run along the shoreline', 'Green juice & light breakfast'],
      room: ['Ocean-facing villa, high floor', 'Firm mattress & blackout curtains'],
      wellness: ['Pilates & cold plunge', 'Sports recovery massage'],
      work: ['Video-call ready workspace', 'Late checkout on weekdays'],
      dining: ['Seafood tasting menus', 'Pairs with crisp Italian whites'],
      leisure: ['Scuba diving & spearfishing', 'Classical music evenings'],
    },
    upcoming: {
      property: 'SOSEI Bali',
      place: 'Uluwatu, Bali, Indonesia',
      period: 'Jan 12 – 20, 2027',
      party: '2 Adults',
      accommodation: 'Cliffside Pool Villa',
      service: 'Butler Made',
      img: PROPERTY_IMG['SOSEI Bali'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Car · Ngurah Rai' },
        { label: 'Villa Preference', desc: 'Cliffside Pool Villa · Sunset side' },
        { label: 'Dining Reservation', desc: 'Chef’s Table · Jan 14' },
        { label: 'Special Requests', desc: 'Guided dive at Nusa Penida' },
      ],
    },
    journey: [
      { date: 'Sep 2025', name: 'SOSEI AUH', loc: 'UAE', img: PROPERTY_IMG['SOSEI AUH'] },
      { date: 'Apr 2025', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
      { date: 'Nov 2024', name: 'SOSEI Bali', loc: 'Indonesia', img: PROPERTY_IMG['SOSEI Bali'] },
      { date: 'Jun 2023', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
    ],
    moments: [
      { title: 'Anniversary Dive', tag: 'Sep 2025', desc: 'Private manta ray dive arranged with a reef biologist.' },
      { title: 'Seafood Devotee', tag: 'Dining', desc: 'Requests daily catch tasting at every ocean property.' },
      { title: 'Early Departures', tag: 'Logistics', desc: 'Prefers 5:30 AM check-out with packed breakfast.' },
    ],
    recommendations: [
      { title: 'Reef Conservation Dive', tag: 'Jan 14', desc: 'Guided coral restoration session with marine team.' },
      { title: 'Sunset Seafood Barbecue', tag: 'Jan 16', desc: 'Private beach grill with local fishermen’s catch.' },
      { title: 'Recovery Hydrotherapy', tag: 'Jan 18', desc: 'Post-dive thermal circuit and deep massage.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2022' },
        { label: 'Silver', year: '2023' },
        { label: 'Gold', year: '2024' },
        { label: 'Platinum', year: '2025' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 4.0 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ High' },
        { label: 'Culinary Focus', value: '→ Steady' },
      ],
    },
    note: {
      quote: 'Theodore is a loyal repeat guest who loves the sea. Pre-arrange dive equipment fitting and keep morning schedules quiet.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '9', properties: '4 properties', avLos: '5.6', spend: '$142,300', avgSpend: '$15,811', yoy: '+12% YoY' },
    booking: { window: '62', channel: 'Direct Phone', affiliation: 'SOSEI Circle', contact: 'Assistant Mark Doyle', preferredChannel: 'Phone' },
  },

  'GST-003': {
    id: 'GST-003',
    guestType: 'Individual',
    name: 'Josephine March',
    tier: 'Gold',
    memberSince: 'Mar 2022',
    location: 'Concord, USA',
    email: 'jo.march@plumfield.edu',
    phone: '+1 (617) 555-0188',
    channel: 'Email',
    language: 'English',
    rhythm: {
      morning: ['Slow start with tea & journaling', 'Breakfast in the library nook'],
      room: ['Quiet garden-facing suite', 'Writing desk by the window'],
      wellness: ['Morning forest walks', 'Aromatherapy & sound bath'],
      work: ['Distraction-free writing space', 'No housekeeping before noon'],
      dining: ['Seasonal vegetarian tasting', 'Herbal infusions over wine'],
      leisure: ['Literary salons & bookshops', 'Watercolor painting'],
    },
    upcoming: {
      property: 'SOSEI Umbria',
      place: 'Umbria, Italy',
      period: 'Apr 3 – 10, 2027',
      party: '1 Adult',
      accommodation: 'Garden Villa Suite',
      service: 'Concierge Luca',
      img: PROPERTY_IMG['SOSEI Umbria'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Car · Rome Airport' },
        { label: 'Villa Preference', desc: 'Garden Villa · Olive grove view' },
        { label: 'Dining Reservation', desc: 'Umbrian Tasting · Apr 5' },
        { label: 'Special Requests', desc: 'Watercolor workshop with master' },
      ],
    },
    journey: [
      { date: 'Oct 2025', name: 'SOSEI OSA', loc: 'Costa Rica', img: PROPERTY_IMG['SOSEI OSA'] },
      { date: 'Apr 2025', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Nov 2024', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'May 2023', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
    ],
    moments: [
      { title: 'Writers’ Retreat', tag: 'Oct 2025', desc: 'Completed a manuscript chapter in a private jungle pavilion.' },
      { title: 'Tea Ceremony', tag: 'Ritual', desc: 'Prefers a quiet afternoon tea with a seasonal pairing.' },
      { title: 'Bookshop Hunts', tag: 'Leisure', desc: 'Loves curated visits to antique bookshops.' },
    ],
    recommendations: [
      { title: 'Watercolor Masterclass', tag: 'Apr 5', desc: 'One-to-one session in the Umbrian hills.' },
      { title: 'Estate Garden Walk', tag: 'Apr 6', desc: 'Early-morning private access before visitors arrive.' },
      { title: 'Forest Bathing Session', tag: 'Apr 8', desc: 'Guided walk in the oak and olive grove.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2022' },
        { label: 'Silver', year: '2023' },
        { label: 'Gold', year: '2025' },
        { label: 'Platinum', year: 'Next' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 2.4 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ High' },
        { label: 'Culinary Focus', value: '↑ Rising' },
      ],
    },
    note: {
      quote: 'Josephine travels to write. Protect her quiet hours and keep room service discreet and minimal.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '5', properties: '4 properties', avLos: '7.2', spend: '$61,900', avgSpend: '$12,380', yoy: '+9% YoY' },
    booking: { window: '121', channel: 'Direct Web', affiliation: 'SOSEI Circle', contact: 'Self-managed', preferredChannel: 'Email' },
  },

  'GST-004': {
    id: 'GST-004',
    guestType: 'Corporate',
    name: 'Amy Curtis',
    tier: 'Silver',
    memberSince: 'Aug 2022',
    location: 'Paris, France',
    email: 'amy.curtis@atelier-paris.fr',
    phone: '+33 1 42 68 55 00',
    channel: 'WhatsApp',
    language: 'French, English',
    rhythm: {
      morning: ['Late riser, café crème in bed', 'Brunch around 10:30 AM'],
      room: ['Design-forward suite with art', 'Soft linen, scent-free'],
      wellness: ['Facial & skin rituals', 'Evening yoga'],
      work: ['Moodboard wall in suite', 'Fabric & sample deliveries'],
      dining: ['Patisserie & French bistro', 'Champagne at golden hour'],
      leisure: ['Fashion ateliers & galleries', 'Vintage markets'],
    },
    upcoming: {
      property: 'SOSEI Tinos',
      place: 'Tinos, Greece',
      period: 'Nov 9 – 15, 2026',
      party: '2 Adults',
      accommodation: 'Aegean Design Suite',
      service: 'Concierge Eleni',
      img: PROPERTY_IMG['SOSEI Tinos'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Yacht · Mykonos to Tinos' },
        { label: 'Villa Preference', desc: 'Aegean Design Suite · High terrace' },
        { label: 'Dining Reservation', desc: 'Cycladic Tasting · Nov 11' },
        { label: 'Special Requests', desc: 'Private Pyrgos marble atelier viewing' },
      ],
    },
    journey: [
      { date: 'Jun 2026', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
      { date: 'Mar 2025', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Oct 2024', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Aug 2022', name: 'SOSEI Bali', loc: 'Indonesia', img: PROPERTY_IMG['SOSEI Bali'] },
    ],
    moments: [
      { title: 'Fashion Week Suite', tag: 'Jun 2026', desc: 'Suite converted into a private styling showroom.' },
      { title: 'Signature Scent', tag: 'Preference', desc: 'Requests a fragrance-free room with fresh peonies.' },
      { title: 'Atelier Visits', tag: 'Culture', desc: 'Enjoys behind-the-scenes studio access.' },
    ],
    recommendations: [
      { title: 'Private Atelier Viewing', tag: 'Nov 10', desc: 'After-hours visit to a local marble & craft atelier.' },
      { title: 'Patisserie Masterclass', tag: 'Nov 12', desc: 'Hands-on session with a pastry chef.' },
      { title: 'Rooftop Champagne Hour', tag: 'Nov 13', desc: 'Aegean terrace with curated pairings.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2022' },
        { label: 'Silver', year: '2024' },
        { label: 'Gold', year: 'Next' },
        { label: 'VIP', year: '—' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 3.0 Trips/Yr' },
        { label: 'Wellness Focus', value: '→ Moderate' },
        { label: 'Culinary Focus', value: '↑ High' },
      ],
    },
    note: {
      quote: 'Amy is design-led and spontaneous. Keep communication brief on WhatsApp and surprise her with local craft pieces.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '4', properties: '4 properties', avLos: '3.9', spend: '$38,200', avgSpend: '$9,550', yoy: '+24% YoY' },
    booking: { window: '38', channel: 'Direct App', affiliation: 'Fashion Group Corporate', contact: 'Studio Manager Elise', preferredChannel: 'WhatsApp' },
  },

  'GST-005': {
    id: 'GST-005',
    guestType: 'Individual',
    name: 'John Brooke',
    tier: 'Silver',
    memberSince: 'Nov 2022',
    location: 'Concord, USA',
    email: 'john.brooke@megandjohn.com',
    phone: '+1 (617) 555-0199',
    channel: 'Email',
    language: 'English',
    rhythm: {
      morning: ['Family breakfast at 8:00 AM', 'Coffee & newspaper on veranda'],
      room: ['Connecting family suite', 'Child-safe amenities'],
      wellness: ['Light stretching & swimming', 'Couples spa afternoon'],
      work: ['Minimal; phone-free after 6 PM', 'Occasional morning calls'],
      dining: ['Family-style Italian', 'Kids’ cooking class'],
      leisure: ['Beach days & snorkeling', 'Nature trails'],
    },
    upcoming: {
      property: 'SOSEI OSA',
      place: 'Osa, Costa Rica',
      period: 'Dec 20 – 28, 2026',
      party: '2 Adults, 2 Children',
      accommodation: 'Rainforest Family Villa',
      service: 'Butler Diego',
      img: PROPERTY_IMG['SOSEI OSA'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Charter · Puerto Jiménez' },
        { label: 'Villa Preference', desc: 'Family Villa · Near pool' },
        { label: 'Dining Reservation', desc: 'Family Beach Dinner · Dec 24' },
        { label: 'Special Requests', desc: 'Turtle hatchery visit for children' },
      ],
    },
    journey: [
      { date: 'Dec 2025', name: 'SOSEI OSA', loc: 'Costa Rica', img: PROPERTY_IMG['SOSEI OSA'] },
      { date: 'Jul 2025', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Dec 2024', name: 'SOSEI Melides', loc: 'Portugal', img: PROPERTY_IMG['SOSEI Melides'] },
      { date: 'Nov 2022', name: 'SOSEI Bali', loc: 'Indonesia', img: PROPERTY_IMG['SOSEI Bali'] },
    ],
    moments: [
      { title: 'Holiday Tradition', tag: 'Dec', desc: 'Returns each December for a family beach celebration.' },
      { title: 'Kids’ Club Favorites', tag: 'Family', desc: 'Children love the junior naturalist program.' },
      { title: 'Early Dinners', tag: 'Dining', desc: 'Prefers a 6:30 PM family seating.' },
    ],
    recommendations: [
      { title: 'Junior Naturalist Trek', tag: 'Dec 22', desc: 'Guided rainforest walk made for children.' },
      { title: 'Family Pizza Night', tag: 'Dec 23', desc: 'Wood-fired pizza with the pastry team.' },
      { title: 'Sunset Catamaran', tag: 'Dec 26', desc: 'Relaxed family sail with snorkeling stop.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2022' },
        { label: 'Silver', year: '2024' },
        { label: 'Gold', year: 'Next' },
        { label: 'VIP', year: '—' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '→ 2.0 Trips/Yr' },
        { label: 'Wellness Focus', value: '→ Moderate' },
        { label: 'Culinary Focus', value: '→ Moderate' },
      ],
    },
    note: {
      quote: 'John travels with young children. Confirm cribs, high chairs and allergy notes before every arrival.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '4', properties: '4 properties', avLos: '8.0', spend: '$44,750', avgSpend: '$11,188', yoy: '+6% YoY' },
    booking: { window: '150', channel: 'Direct Web', affiliation: 'Family Plan', contact: 'Meg Brooke', preferredChannel: 'Email' },
  },

  'GST-006': {
    id: 'GST-006',
    guestType: 'Travel Agent',
    name: 'Margaret March',
    tier: 'Platinum',
    memberSince: 'Dec 2022',
    location: 'London, UK',
    email: 'meg.march@manor-estate.co.uk',
    phone: '+44 20 7946 0912',
    channel: 'Phone, Email',
    language: 'English',
    rhythm: {
      morning: ['Early tea at 6:45 AM', 'Breakfast served in suite'],
      room: ['Grand suite, lower floor', 'Extra pillows & fresh flowers'],
      wellness: ['Thermal bath ritual', 'Gentle reflexology'],
      work: ['Estate calls in mornings', 'Printer & stationery in suite'],
      dining: ['Classic British & fine pastry', 'Afternoon tea daily'],
      leisure: ['Garden tours & horticulture', 'Chamber music'],
    },
    upcoming: {
      property: 'SOSEI Tinos',
      place: 'Tinos, Greece',
      period: 'Feb 6 – 14, 2027',
      party: '2 Adults',
      accommodation: 'Aegean Terrace Suite',
      service: 'Butler Nikos',
      img: PROPERTY_IMG['SOSEI Tinos'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Yacht · Mykonos' },
        { label: 'Villa Preference', desc: 'Terrace Suite · Aegean garden view' },
        { label: 'Dining Reservation', desc: 'Herbal Tea Ceremony · Feb 8' },
        { label: 'Special Requests', desc: 'Guided botanical terrace visit' },
      ],
    },
    journey: [
      { date: 'Oct 2025', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Mar 2025', name: 'SOSEI El Gouna', loc: 'Egypt', img: PROPERTY_IMG['SOSEI El Gouna'] },
      { date: 'Aug 2024', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Dec 2022', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
    ],
    moments: [
      { title: 'Rose Garden Walk', tag: 'Mar 2025', desc: 'Private dawn walk through a heritage rose terrace.' },
      { title: 'Afternoon Tea', tag: 'Ritual', desc: 'Daily 4:00 PM service, same table, same pot.' },
      { title: 'Anniversary Notes', tag: 'Personal', desc: 'Enjoys handwritten notes and fresh-cut flowers.' },
    ],
    recommendations: [
      { title: 'Botanical Distillery', tag: 'Feb 8', desc: 'Private tour with a master distiller.' },
      { title: 'Mountain Thermal Ritual', tag: 'Feb 10', desc: 'Warm mineral bath with herbal compress.' },
      { title: 'Stargazing Terrace Dinner', tag: 'Feb 12', desc: 'Candlelit dinner under Aegean skies.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2022' },
        { label: 'Silver', year: '2023' },
        { label: 'Gold', year: '2024' },
        { label: 'Platinum', year: '2026' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 3.5 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ High' },
        { label: 'Culinary Focus', value: '→ Steady' },
      ],
    },
    note: {
      quote: 'Margaret appreciates routine and gentle personal touches. Keep her tea ritual and floral preferences consistent.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '8', properties: '5 properties', avLos: '6.4', spend: '$126,800', avgSpend: '$15,850', yoy: '+15% YoY' },
    booking: { window: '84', channel: 'Luxury Travel Agent', affiliation: 'Tzell Travel', contact: 'Agent Helen Price', preferredChannel: 'Phone' },
  },

  'GST-007': {
    id: 'GST-007',
    guestType: 'Corporate',
    name: 'Arthur Pendennis',
    tier: 'Gold',
    memberSince: 'Feb 2023',
    location: 'London, UK',
    email: 'arthur.pendennis@fairoaks.co.uk',
    phone: '+44 18 6549 6001',
    channel: 'Email',
    language: 'English, German',
    rhythm: {
      morning: ['Black coffee & financial press', 'Breakfast at 6:30 AM'],
      room: ['Corner suite near lift', 'Desk with dual monitors'],
      wellness: ['Pre-dawn gym session', 'Sauna & cold plunge'],
      work: ['24/7 business center access', 'Secure meeting room on demand'],
      dining: ['Steakhouse & whisky bar', 'Business dinners for 4–6'],
      leisure: ['Skiing & mountaineering', 'Cigar lounge'],
    },
    upcoming: {
      property: 'SOSEI Andermatt',
      place: 'Andermatt, Switzerland',
      period: 'Jan 26 – Feb 2, 2027',
      party: '1 Adult',
      accommodation: 'Andermatt Chalet Suite',
      service: 'Butler Lukas',
      img: PROPERTY_IMG['SOSEI Andermatt'],
      items: [
        { label: 'Airport Transfer', desc: 'Helicopter · Zurich to Andermatt' },
        { label: 'Villa Preference', desc: 'Chalet Suite · Gemsstock view' },
        { label: 'Dining Reservation', desc: 'Private Raclette Dinner · Jan 28' },
        { label: 'Special Requests', desc: 'Pre-fitted ski gear & early lift pass' },
      ],
    },
    journey: [
      { date: 'Feb 2026', name: 'SOSEI Melides', loc: 'Portugal', img: PROPERTY_IMG['SOSEI Melides'] },
      { date: 'Sep 2025', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
      { date: 'Jan 2025', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Feb 2023', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
    ],
    moments: [
      { title: 'Heli-Ski Day', tag: 'Feb 2026', desc: 'Backcountry heli-ski with certified mountain guide.' },
      { title: 'Board Dinner', tag: 'Business', desc: 'Hosted a six-guest private dinner in the wine cellar.' },
      { title: 'Whisky Collection', tag: 'Preference', desc: 'Favors single-malt flights after dinner.' },
    ],
    recommendations: [
      { title: 'Private Heli-Ski Guide', tag: 'Jan 28', desc: 'Fresh powder run with lunch at altitude.' },
      { title: 'Whisky Cellar Tasting', tag: 'Jan 30', desc: 'Rare malts paired with Alpine cheese.' },
      { title: 'Thermal Recovery Circuit', tag: 'Feb 1', desc: 'Post-ski sauna, ice bath and sports massage.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Silver', year: '2024' },
        { label: 'Gold', year: '2025' },
        { label: 'Platinum', year: 'Next' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 5.0 Trips/Yr' },
        { label: 'Wellness Focus', value: '→ Moderate' },
        { label: 'Culinary Focus', value: '↑ High' },
      ],
    },
    note: {
      quote: 'Arthur is time-sensitive and mixes business with leisure. Ensure Wi-Fi, meeting space and transfers run to the minute.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '7', properties: '4 properties', avLos: '3.6', spend: '$97,400', avgSpend: '$13,914', yoy: '+21% YoY' },
    booking: { window: '29', channel: 'Corporate Travel', affiliation: 'Fairoaks Capital', contact: 'EA Charlotte Rowe', preferredChannel: 'Email' },
  },

  'GST-008': {
    id: 'GST-008',
    guestType: 'Individual',
    name: 'Marian Halcombe',
    tier: 'Gold',
    memberSince: 'Apr 2023',
    location: 'Cumberland, UK',
    email: 'm.halcombe@limmeridge.co.uk',
    phone: '+44 12 2855 0122',
    channel: 'WhatsApp, Email',
    language: 'English, Spanish',
    rhythm: {
      morning: ['Sunrise hike before breakfast', 'Protein-rich breakfast'],
      room: ['Mountain-view room with balcony', 'Hypoallergenic bedding'],
      wellness: ['Trail running & yoga', 'Sports physio session'],
      work: ['Offline-first; emergency calls only', 'Charging station in room'],
      dining: ['Farm-to-table & foraged menus', 'Local craft ale'],
      leisure: ['Trekking & rock climbing', 'Wildlife photography'],
    },
    upcoming: {
      property: 'SOSEI Melides',
      place: 'Melides, Portugal',
      period: 'Jul 15 – 22, 2027',
      party: '2 Adults',
      accommodation: 'Coastal Dune Suite',
      service: 'Guide Olivia',
      img: PROPERTY_IMG['SOSEI Melides'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Car · Lisbon' },
        { label: 'Villa Preference', desc: 'Dune Suite · Pine forest side' },
        { label: 'Dining Reservation', desc: 'Foraged Tasting · Jul 17' },
        { label: 'Special Requests', desc: 'Guided coastal trek with gear fitting' },
      ],
    },
    journey: [
      { date: 'Aug 2025', name: 'SOSEI OSA', loc: 'Costa Rica', img: PROPERTY_IMG['SOSEI OSA'] },
      { date: 'Jan 2025', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Jun 2024', name: 'SOSEI El Gouna', loc: 'Egypt', img: PROPERTY_IMG['SOSEI El Gouna'] },
      { date: 'Apr 2023', name: 'SOSEI Melides', loc: 'Portugal', img: PROPERTY_IMG['SOSEI Melides'] },
    ],
    moments: [
      { title: 'Summit Breakfast', tag: 'Aug 2025', desc: 'Served breakfast at a volcano overlook after dawn hike.' },
      { title: 'Wildlife Spotting', tag: 'Nature', desc: 'Keeps a personal journal; loves guide-led tracking.' },
      { title: 'Gear Preferences', tag: 'Active', desc: 'Prefers pre-fitted boots and lightweight packs.' },
    ],
    recommendations: [
      { title: 'Coastal Cliff Trek', tag: 'Jul 17', desc: 'Full-day guided hike with picnic.' },
      { title: 'Wildlife Photography Walk', tag: 'Jul 19', desc: 'Dawn tracking with a naturalist.' },
      { title: 'Thermal Recovery', tag: 'Jul 20', desc: 'Evening soak with sports massage.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Silver', year: '2024' },
        { label: 'Gold', year: '2025' },
        { label: 'Platinum', year: 'Next' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 3.8 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ Very High' },
        { label: 'Culinary Focus', value: '→ Steady' },
      ],
    },
    note: {
      quote: 'Marian is an outdoorsy traveller who values authenticity over luxury trimmings. Pair her with expert guides.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '6', properties: '5 properties', avLos: '5.5', spend: '$68,900', avgSpend: '$11,483', yoy: '+14% YoY' },
    booking: { window: '70', channel: 'Direct App', affiliation: 'SOSEI Circle', contact: 'Self-managed', preferredChannel: 'WhatsApp' },
  },

  'GST-009': {
    id: 'GST-009',
    guestType: 'Individual',
    name: 'Walter Hartright',
    tier: 'Silver',
    memberSince: 'Jul 2023',
    location: 'London, UK',
    email: 'w.hartright@drawing-academy.org',
    phone: '+44 20 7946 0885',
    channel: 'Email',
    language: 'English',
    rhythm: {
      morning: ['Sketching on the terrace at dawn', 'Light breakfast & strong tea'],
      room: ['North-light studio suite', 'Large table for drawing'],
      wellness: ['Walking meditation', 'Tai chi in the garden'],
      work: ['Quiet space for lessons', 'Art supply delivery on arrival'],
      dining: ['Simple Mediterranean home cooking', 'Herbal tea & pastries'],
      leisure: ['Museums & historic chapels', 'Plein-air painting'],
    },
    upcoming: {
      property: 'SOSEI Umbria',
      place: 'Umbria, Italy',
      period: 'Nov 14 – 21, 2026',
      party: '1 Adult',
      accommodation: 'Studio Estate Suite',
      service: 'Concierge Luca',
      img: PROPERTY_IMG['SOSEI Umbria'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Car · Perugia Airport' },
        { label: 'Villa Preference', desc: 'Studio Suite · Olive garden' },
        { label: 'Dining Reservation', desc: 'Vegetarian Umbrian Menu · Nov 16' },
        { label: 'Special Requests', desc: 'Fresco & plein-air painting class' },
      ],
    },
    journey: [
      { date: 'Apr 2026', name: 'SOSEI Umbria', loc: 'Italy', img: PROPERTY_IMG['SOSEI Umbria'] },
      { date: 'Oct 2025', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Mar 2025', name: 'SOSEI Barcelona', loc: 'Spain', img: PROPERTY_IMG['SOSEI Barcelona'] },
      { date: 'Jul 2023', name: 'SOSEI Melides', loc: 'Portugal', img: PROPERTY_IMG['SOSEI Melides'] },
    ],
    moments: [
      { title: 'Autumn Sketchbook', tag: 'Oct 2025', desc: 'Gifted a bound sketchbook of the estate at checkout.' },
      { title: 'Studio Setup', tag: 'Preference', desc: 'Requests an easel and natural-light desk on arrival.' },
      { title: 'Quiet Evenings', tag: 'Rhythm', desc: 'Prefers early nights and minimal turn-down interruptions.' },
    ],
    recommendations: [
      { title: 'Fresco & Watercolor Workshop', tag: 'Nov 16', desc: 'Private lesson with a local Umbrian master.' },
      { title: 'Hilltop Chapel Sketch Walk', tag: 'Nov 18', desc: 'Guided access to quiet historic estates.' },
      { title: 'Olive Harvest Tasting', tag: 'Nov 19', desc: 'Traditional new-press olive oil ceremony.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Silver', year: '2025' },
        { label: 'Gold', year: 'Next' },
        { label: 'VIP', year: '—' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '→ 2.0 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ Rising' },
        { label: 'Culinary Focus', value: '→ Steady' },
      ],
    },
    note: {
      quote: 'Walter is a thoughtful artist on a modest budget. Offer value-led experiences and generous natural light.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '4', properties: '4 properties', avLos: '6.8', spend: '$29,600', avgSpend: '$7,400', yoy: '+8% YoY' },
    booking: { window: '110', channel: 'Direct Web', affiliation: 'Academy Faculty Rate', contact: 'Self-managed', preferredChannel: 'Email' },
  },

  'GST-010': {
    id: 'GST-010',
    guestType: 'Individual',
    name: 'Laura Fairlie',
    tier: 'Gold',
    memberSince: 'Sep 2023',
    location: 'Cumberland, UK',
    email: 'laura.fairlie@limmeridge.co.uk',
    phone: '+44 12 2855 0144',
    channel: 'WhatsApp',
    language: 'English, French',
    rhythm: {
      morning: ['Quiet reading with herbal tea', 'Breakfast at 9:00 AM'],
      room: ['Bright wellness suite', 'Organic linen & air purifier'],
      wellness: ['Daily massage & yoga', 'Hydrotherapy circuit'],
      work: ['Digital detox; devices in safe', 'No scheduled calls'],
      dining: ['Plant-based & raw cuisine', 'Fresh-pressed juices'],
      leisure: ['Meditation & spa rituals', 'Garden bathing'],
    },
    upcoming: {
      property: 'SOSEI El Gouna',
      place: 'El Gouna, Egypt',
      period: 'Jan 9 – 18, 2027',
      party: '1 Adult',
      accommodation: 'Lagoon Healing Villa',
      service: 'Therapist Nour',
      img: PROPERTY_IMG['SOSEI El Gouna'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Car · Hurghada to El Gouna' },
        { label: 'Villa Preference', desc: 'Healing Villa · Lagoon front' },
        { label: 'Dining Reservation', desc: 'Raw Garden Menu · Jan 11' },
        { label: 'Special Requests', desc: ' Thalassotherapy floating sessions' },
      ],
    },
    journey: [
      { date: 'Sep 2025', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
      { date: 'Mar 2025', name: 'SOSEI OSA', loc: 'Costa Rica', img: PROPERTY_IMG['SOSEI OSA'] },
      { date: 'Dec 2024', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Sep 2023', name: 'SOSEI El Gouna', loc: 'Egypt', img: PROPERTY_IMG['SOSEI El Gouna'] },
    ],
    moments: [
      { title: 'Detox Week', tag: 'Sep 2025', desc: 'Completed a seven-day guided digital detox program.' },
      { title: 'Healing Rituals', tag: 'Wellness', desc: 'Favors sound bath and cranio-sacral therapy.' },
      { title: 'Sleep Sanctuary', tag: 'Preference', desc: 'Requires blackout, 18°C room and silent turn-down.' },
    ],
    recommendations: [
      { title: 'Salt-Lagoon Floating', tag: 'Jan 11', desc: 'Weightless floating session at dawn.' },
      { title: 'Desert Sound Bath', tag: 'Jan 13', desc: 'Private session under the stars.' },
      { title: 'Herbal Cleanse Menu', tag: 'Jan 15', desc: 'Three-day plant-based nutrition plan.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Silver', year: '2024' },
        { label: 'Gold', year: '2025' },
        { label: 'Platinum', year: 'Next' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 3.4 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ Very High' },
        { label: 'Culinary Focus', value: '↑ Rising' },
      ],
    },
    note: {
      quote: 'Laura travels to restore. Protect her calm: no unsolicited calls and keep amenities natural and unscented.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '7', properties: '5 properties', avLos: '8.4', spend: '$112,500', avgSpend: '$16,071', yoy: '+22% YoY' },
    booking: { window: '55', channel: 'Wellness Concierge', affiliation: 'SOSEI Wellness Club', contact: 'Care Coordinator Anna', preferredChannel: 'WhatsApp' },
  },

  'GST-011': {
    id: 'GST-011',
    guestType: 'Individual',
    name: 'Gabriel Betteredge',
    tier: 'VIP',
    memberSince: 'Oct 2023',
    location: 'Yorkshire, UK',
    email: 'g.betteredge@vervast-vip.org',
    phone: '+44 19 8221 4401',
    channel: 'Phone',
    language: 'English',
    rhythm: {
      morning: ['Tea at 7:00 AM sharp', 'Breakfast in the dining room'],
      room: ['Heritage suite with fireplace', 'Same room each visit'],
      wellness: ['Thermal baths & steam', 'Traditional massage'],
      work: ['Estate paperwork in mornings', 'Daily newspapers delivered'],
      dining: ['Roast dinners & game', 'Vintage port after dinner'],
      leisure: ['Fishing & shooting', 'Chess in the library'],
    },
    upcoming: {
      property: 'SOSEI Melides',
      place: 'Melides, Portugal',
      period: 'Aug 12 – 21, 2027',
      party: '2 Adults',
      accommodation: 'Estate Manor Suite',
      service: 'Butler Ethan',
      img: PROPERTY_IMG['SOSEI Melides'],
      items: [
        { label: 'Airport Transfer', desc: 'Chauffeur · Lisbon' },
        { label: 'Villa Preference', desc: 'Estate Suite · Fireplace room' },
        { label: 'Dining Reservation', desc: 'Game Dinner · Aug 14' },
        { label: 'Special Requests', desc: 'Private coastal fishing charter' },
      ],
    },
    journey: [
      { date: 'Aug 2026', name: 'SOSEI Melides', loc: 'Portugal', img: PROPERTY_IMG['SOSEI Melides'] },
      { date: 'Feb 2026', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Aug 2025', name: 'SOSEI Andermatt', loc: 'Switzerland', img: PROPERTY_IMG['SOSEI Andermatt'] },
      { date: 'Oct 2023', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
    ],
    moments: [
      { title: 'Opening Season Fishing', tag: 'Aug 2026', desc: 'First-cast ceremony on a private coastal charter.' },
      { title: 'Same Room, Always', tag: 'Preference', desc: 'Always requests the heritage fireplace suite.' },
      { title: 'Port & Chess', tag: 'Evenings', desc: 'Expects a chess partner in the library after dinner.' },
    ],
    recommendations: [
      { title: 'Private Fishing Charter', tag: 'Aug 14', desc: 'Guided day with skipper and coastal lunch.' },
      { title: 'Whisky & Cigar Evening', tag: 'Aug 16', desc: 'Whisky tasting with a master blender.' },
      { title: 'Estate Carriage Tour', tag: 'Aug 19', desc: 'Horse-drawn tour of the Alentejo estate.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Gold', year: '2024' },
        { label: 'Platinum', year: '2025' },
        { label: 'VIP', year: '2026' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 4.5 Trips/Yr' },
        { label: 'Wellness Focus', value: '→ Moderate' },
        { label: 'Culinary Focus', value: '↑ High' },
      ],
    },
    note: {
      quote: 'Gabriel is a long-standing VIP who values tradition. Greet him by name, keep his room and rituals unchanged.',
      author: 'General Manager',
    },
    stats: { stays: '10', properties: '5 properties', avLos: '6.0', spend: '$214,600', avgSpend: '$21,460', yoy: '+17% YoY' },
    booking: { window: '45', channel: 'Private Office', affiliation: 'Betteredge Estate', contact: 'Secretary Mrs. Clack', preferredChannel: 'Phone' },
  },

  'GST-012': {
    id: 'GST-012',
    guestType: 'Travel Agent',
    name: 'Rachel Verinder',
    tier: 'Platinum',
    memberSince: 'Nov 2023',
    location: 'London, UK',
    email: 'rachel.verinder@moonstone.co.uk',
    phone: '+44 20 7946 0773',
    channel: 'Email, Phone',
    language: 'English, Hindi',
    rhythm: {
      morning: ['Meditation at 6:00 AM', 'Fresh fruit & spiced chai'],
      room: ['Jewel-toned suite, private plunge pool', 'Silk bedding'],
      wellness: ['Ayurvedic treatments', 'Evening yoga nidra'],
      work: ['Jewellery design reviews by video', 'Secure safe & courier access'],
      dining: ['Modern Indian & Persian', 'Rose & cardamom desserts'],
      leisure: ['Antique markets & gemstone fairs', 'Private gallery visits'],
    },
    upcoming: {
      property: 'SOSEI AUH',
      place: 'Abu Dhabi, UAE',
      period: 'Mar 3 – 11, 2027',
      party: '2 Adults',
      accommodation: 'Moonlight Overwater Villa',
      service: 'Butler Maria',
      img: PROPERTY_IMG['SOSEI AUH'],
      items: [
        { label: 'Airport Transfer', desc: 'Private Yacht · Abu Dhabi' },
        { label: 'Villa Preference', desc: 'Overwater Villa · Plunge pool' },
        { label: 'Dining Reservation', desc: 'Moonlit Sandbank Dinner · Mar 6' },
        { label: 'Special Requests', desc: 'Ayurvedic therapist in residence' },
      ],
    },
    journey: [
      { date: 'Nov 2025', name: 'SOSEI AUH', loc: 'UAE', img: PROPERTY_IMG['SOSEI AUH'] },
      { date: 'Jun 2025', name: 'SOSEI Tinos', loc: 'Greece', img: PROPERTY_IMG['SOSEI Tinos'] },
      { date: 'Feb 2025', name: 'SOSEI Umbria', loc: 'Italy', img: PROPERTY_IMG['SOSEI Umbria'] },
      { date: 'Nov 2023', name: 'SOSEI El Gouna', loc: 'Egypt', img: PROPERTY_IMG['SOSEI El Gouna'] },
    ],
    moments: [
      { title: 'Moonlit Proposal Dinner', tag: 'Nov 2025', desc: 'Private sandbank dinner arranged with floating lanterns.' },
      { title: 'Gemstone Sourcing', tag: 'Business', desc: 'Hosted a private appraisal with a local gem dealer.' },
      { title: 'Aroma Preferences', tag: 'Ritual', desc: 'Prefers rose & sandalwood in the suite.' },
    ],
    recommendations: [
      { title: 'Moonlit Sandbank Dinner', tag: 'Mar 6', desc: 'Candlelit table on a private sandbank.' },
      { title: 'Ayurvedic Immersion', tag: 'Mar 8', desc: 'Three-treatment day with a visiting vaidya.' },
      { title: 'Pearl Farm Visit', tag: 'Mar 9', desc: 'Private tour with a local pearl cultivator.' },
    ],
    evolution: {
      steps: [
        { label: 'Standard', year: '2023' },
        { label: 'Gold', year: '2024' },
        { label: 'Platinum', year: '2025' },
        { label: 'VIP', year: 'Next' },
      ],
      trends: [
        { label: 'Travel Frequency', value: '↑ 4.2 Trips/Yr' },
        { label: 'Wellness Focus', value: '↑ Very High' },
        { label: 'Culinary Focus', value: '↑ High' },
      ],
    },
    note: {
      quote: 'Rachel blends business and renewal. Ensure secure storage for her pieces and arrange meaningful, private rituals.',
      author: 'Guest Experience Manager',
    },
    stats: { stays: '8', properties: '5 properties', avLos: '6.2', spend: '$168,900', avgSpend: '$21,113', yoy: '+26% YoY' },
    booking: { window: '78', channel: 'Luxury Travel Agent', affiliation: 'Virtuoso', contact: 'Agent Sofia Lang', preferredChannel: 'Email' },
  },
};

export function getIndividualGuestProfile(id?: string): IndividualGuestProfile | undefined {
  return id ? individualGuestProfiles[id] : undefined;
}
