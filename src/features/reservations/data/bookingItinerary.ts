import urbanImg from '@/assets/contents/property_urban.jpg';
import baliImg from '@/assets/contents/property_bali.jpg';
import maldivesImg from '@/assets/contents/property_maldives.jpg';
import switzerlandImg from '@/assets/contents/property_switzerland.jpg';
import costaRicaImg from '@/assets/contents/property_costa_rica.jpg';
import japanImg from '@/assets/contents/property_japan.jpg';
import omanImg from '@/assets/contents/property_oman.jpg';
import egyptImg from '@/assets/contents/property_egypt.jpg';

// Diversified experience and setting imagery
import alpineImg from '@/assets/contents/alpine.png';
import sunsetCruiseImg from '@/assets/contents/sunset_cruise.png';
import wellnessRetreatImg from '@/assets/contents/wellness_retreat.png';
import privateDinnerImg from '@/assets/contents/private_dinner_alpine.png';
import oceanImg from '@/assets/contents/ocean.png';
import desertImg from '@/assets/contents/desert.png';
import forestImg from '@/assets/contents/forest.png';
import productWorkshopImg from '@/assets/contents/product_workshop.png';

import type { BookingItineraryItem, BookingRecord } from './bookings';

/** Generate property-specific, context-aware itinerary with rich diverse imagery */
export function buildBookingItinerary(booking: BookingRecord): BookingItineraryItem[] {
  const hotel = booking.hotel;
  const arr = booking.arrivalDate;
  const dep = booking.departureDate;
  const tktCode = booking.crsNo.replace('CRS-', 'TKT-');

  // 1. SKI RESORT ITINERARY (Switzerland, Canada)
  if (booking.hotel === 'SOSEI Switzerland' || booking.hotel === 'SOSEI Canada') {
    return [
      {
        day: 'Day 1',
        date: arr,
        time: '14:30',
        title: 'Alpine Helicopter Transfer & Private Chalet Check-in',
        location: `${hotel} • Heli-pad & Private Ski Lounge`,
        description: 'Chauffeured arrival from airport by private twin-engine helicopter. Welcome spiced Glühwein, in-chalet fitting of Stöckli handcrafted skis, heated boot warmers, and private ski pass issuance.',
        category: 'arrival',
        image: switzerlandImg,
        ticket: {
          code: `${tktCode}-HELI`,
          label: 'Helicopter Transfer & Priority Ski Valet Pass',
          downloadUrl: '#',
          fileSize: '1.8 MB',
        },
      },
      {
        day: 'Day 2',
        date: 'Morning Session',
        time: '08:45',
        title: 'Matterhorn Glacier Paradise 3S Cable Car & First Tracks',
        location: 'Zermatt International Ski Area • 3,883m Peak',
        description: 'Exclusive 30-minute early access to Klein Matterhorn before the general public. Guided off-piste powder descent across pristine Theodul glacier with Olympic mountain guide.',
        category: 'ski',
        image: alpineImg,
        ticket: {
          code: `${tktCode}-CABLE`,
          label: 'VIP Glacier 3S Cable Car & Unlimited Ski Pass',
          downloadUrl: '#',
          fileSize: '2.1 MB',
        },
      },
      {
        day: 'Day 3',
        date: 'Full Day Adventure',
        time: '10:00',
        title: 'High Altitude Heli-Skiing & Champagne Glacier Picnic',
        location: 'Monte Rosa Massif • Backcountry Bowl',
        description: 'Air drop into untouched alpine powder fields. Includes avalanche beacon briefing, video recording by drone operator, and fondue banquet in a heated expedition dome.',
        category: 'ski',
        image: privateDinnerImg,
        ticket: {
          code: `${tktCode}-HELI-SKI`,
          label: 'Heli-Ski Permit & Guide Dispatch Authorization',
          downloadUrl: '#',
          fileSize: '950 KB',
        },
      },
      {
        day: 'Day 4',
        date: 'Afternoon & Evening',
        time: '16:00',
        title: 'Thermal Alpine Hydrotherapy & Cedar Hot Tub Après-Ski',
        location: `${hotel} • Thermal Mountain Spa`,
        description: 'Finnish outdoor sauna overlooking snow-capped peaks, mineral ice bath, hot stone massage, followed by fireside vintage cognac and truffle raclette.',
        category: 'wellness',
        image: wellnessRetreatImg,
      },
      {
        day: 'Final Day',
        date: dep,
        time: '11:00',
        title: 'Glacier Express Scenic Train Escort & Departure',
        location: 'Alpine Panoramic Rail Station',
        description: 'Luggage checked directly through to final destination. First-class panoramic rail carriage with gourmet lunch and champagne toast across Swiss viaducts.',
        category: 'departure',
        image: switzerlandImg,
        ticket: {
          code: `${tktCode}-TRAIN`,
          label: 'Glacier Express Excellence Class Boarding Ticket',
          downloadUrl: '#',
          fileSize: '1.3 MB',
        },
      },
    ];
  }

  // 2. BEACH / LAGOON RESORT (Maldives, Bali)
  if (booking.hotel === 'SOSEI Maldives' || booking.hotel === 'SOSEI Bali') {
    const mainImg = booking.hotel === 'SOSEI Maldives' ? maldivesImg : baliImg;
    return [
      {
        day: 'Day 1',
        date: arr,
        time: '13:00',
        title: 'Twin-Otter Seaplane Water Landing & Lagoon Welcome',
        location: `${hotel} • Turquoise Lagoon Jetty`,
        description: 'Scenic aerial arrival over coral atolls. Boduberu drum greeting, chilled young coconut water, and golf-buggy transfer to the private overwater pool residence.',
        category: 'arrival',
        image: mainImg,
        ticket: {
          code: `${tktCode}-SEAPLANE`,
          label: 'VIP Seaplane Flight Ticket & Lagoon Escort Pass',
          downloadUrl: '#',
          fileSize: '1.6 MB',
        },
      },
      {
        day: 'Day 2',
        date: 'Morning Expedition',
        time: '09:00',
        title: 'Private Yacht Cruise with Marine Biologist to Coral Atoll',
        location: 'Baa Atoll UNESCO Biosphere Reserve',
        description: 'Snorkeling alongside manta rays and gentle whale sharks. Coral planting session with marine conservation team, followed by sashimi lunch on a deserted sandbank.',
        category: 'nature',
        image: oceanImg,
        ticket: {
          code: `${tktCode}-YACHT`,
          label: 'Private Catamaran Charter & Sandbank Landing Permit',
          downloadUrl: '#',
          fileSize: '1.2 MB',
        },
      },
      {
        day: 'Day 3',
        date: 'Sunset Ritual',
        time: '17:30',
        title: 'Overwater Glass-Floor Spa Treatment & Sunset Yoga',
        location: `${hotel} • Floating Wellness Pavilion`,
        description: 'Soothing body scrub with indigenous sea minerals, aromatherapy wrap, sound healing with Tibetan singing bowls as the sun dips into the Indian Ocean.',
        category: 'wellness',
        image: wellnessRetreatImg,
      },
      {
        day: 'Day 4',
        date: 'Dinner Experience',
        time: '19:45',
        title: 'Sub-aquatic 5-Meter Underwater Wine Cellar Degustation',
        location: 'SEA Deep Ocean Dining Chamber',
        description: 'Surrounded by coral reefs illuminated by ambient moonlight. 7-course seafood journey curated by chef and head sommelier.',
        category: 'dining',
        image: sunsetCruiseImg,
      },
      {
        day: 'Final Day',
        date: dep,
        time: '12:00',
        title: 'Speedboat Transfer & VIP Airport Lounge Assistance',
        location: 'Malé International Seaplane Terminal',
        description: 'Express bag transfer, customized pearl souvenir presentation, and private lounge access prior to international departure.',
        category: 'departure',
        image: mainImg,
        ticket: {
          code: `${tktCode}-LOUNGE`,
          label: 'Executive Airport Lounge Pass & Speedboat Voucher',
          downloadUrl: '#',
          fileSize: '890 KB',
        },
      },
    ];
  }

  // 3. NATURE / RAINFOREST / DESERT (Costa Rica, Oman)
  if (booking.hotel === 'SOSEI Costa Rica' || booking.hotel === 'SOSEI Oman') {
    const isDesert = booking.hotel === 'SOSEI Oman';
    const mainImg = isDesert ? omanImg : costaRicaImg;
    return [
      {
        day: 'Day 1',
        date: arr,
        time: '15:00',
        title: isDesert ? 'Private 4x4 Dune Convoy & Omani Coffee Welcome' : 'Rainforest Cloud Canopy Arrival & Thermal Welcome',
        location: `${hotel} • Sanctuary Gates`,
        description: isDesert
          ? 'Traversing towering red sand dunes with experienced desert drivers. Fresh dates, frankincense aroma, and private pavilion check-in.'
          : 'Suspension bridge walk into primary rainforest canopy. Organic lemongrass infusion and private hot springs plunge in-suite.',
        category: 'arrival',
        image: mainImg,
        ticket: {
          code: `${tktCode}-CONVOY`,
          label: isDesert ? 'Desert 4x4 Convoy & Camel Voucher' : 'Canopy Rainforest Escort Pass',
          downloadUrl: '#',
          fileSize: '1.4 MB',
        },
      },
      {
        day: 'Day 2',
        date: 'Morning Safari',
        time: '08:30',
        title: isDesert ? 'Bedouin Falconry & Arabian Horse Riding over Sunset Dunes' : 'Hanging Bridges Wildlife Trek & Volcanic Thermal Bath',
        location: isDesert ? 'Wahiba Sands Reserve' : 'Arenal Volcano National Reserve',
        description: isDesert
          ? 'Hands-on falconry demonstration with master falconer followed by gallop across open sands and traditional nomad lunch under tent.'
          : 'Encounter toucans, sloths, and iridescent hummingbirds with senior naturalist. Soak in natural mineral hot spring cascade.',
        category: 'nature',
        image: isDesert ? desertImg : forestImg,
        ticket: {
          code: `${tktCode}-EXP`,
          label: 'National Park Private Entry & Specialist Ranger Permit',
          downloadUrl: '#',
          fileSize: '1.1 MB',
        },
      },
      {
        day: 'Day 3',
        date: 'Evening',
        time: '20:00',
        title: isDesert ? 'Astronomy Stargazing & Bedouin Firepit Feast' : 'Night Canopy Bioluminescent Walk & Farm-to-Table Dinner',
        location: isDesert ? 'Desert Observatory Dome' : 'Rainforest Organic Greenhouse',
        description: isDesert
          ? 'Deep-sky telescope viewing of the Milky Way without light pollution. Roasted lamb, spiced flatbread, and live oud poetry.'
          : 'Discover glowing mushrooms, tree frogs, and nocturnal fauna, followed by chef tasting menu using ingredients picked that afternoon.',
        category: 'cultural',
        image: isDesert ? privateDinnerImg : sunsetCruiseImg,
      },
      {
        day: 'Final Day',
        date: dep,
        time: '10:30',
        title: 'Departure Transfer to Capital & Farewell Gift',
        location: `${hotel} • Main Outpost`,
        description: 'Chauffeured luxury SUV escort to international airport with artisanal craft gifts and custom photography book.',
        category: 'departure',
        image: mainImg,
        ticket: {
          code: `${tktCode}-SUV`,
          label: 'Executive SUV Transfer Confirmation',
          downloadUrl: '#',
          fileSize: '720 KB',
        },
      },
    ];
  }

  // 4. URBAN / CULTURAL / WELLNESS (Barcelona, Tokyo, Japan, Egypt)
  const urbanMain = booking.hotel === 'SOSEI Japan' ? japanImg : (booking.hotel === 'SOSEI Egypt' ? egyptImg : urbanImg);
  return [
    {
      day: 'Day 1',
      date: arr,
      time: '14:00',
      title: 'Private Chauffeured Transfer & Penthouse Welcome',
      location: `${hotel} • Presidential Lobby & Private Lift`,
      description: 'Chauffeured hybrid sedan airport transfer. Welcome fine champagne, bespoke pillow menu selection, and private butler unpacking service.',
      category: 'arrival',
      image: urbanMain,
      ticket: {
        code: `${tktCode}-CHAUFFEUR`,
        label: 'VIP Private Chauffeur & Priority Check-in Voucher',
        downloadUrl: '#',
        fileSize: '1.5 MB',
      },
    },
    {
      day: 'Day 2',
      date: 'Culture & Immersion',
      time: '10:00',
      title: 'Exclusive After-Hours Private Museum & Heritage Tour',
      location: `${booking.destinationCountry} • Iconic Landmark`,
      description: 'Curated private tour led by distinguished historian. Access to restricted vaults and private art collections closed to the public.',
      category: 'cultural',
      image: productWorkshopImg,
      ticket: {
        code: `${tktCode}-MUSEUM`,
        label: 'Private Curatorial Access Pass & Fast Track',
        downloadUrl: '#',
        fileSize: '1.9 MB',
      },
    },
    {
      day: 'Day 3',
      date: 'Evening',
      time: '19:30',
      title: 'Michelin Star Chef’s Table Degustation',
      location: `${hotel} • Private Dining Room`,
      description: 'Nine-course seasonal culinary masterpiece featuring regional farm provenance and rare vintage wine pairings by chief sommelier.',
      category: 'dining',
      image: privateDinnerImg,
    },
    {
      day: 'Final Day',
      date: dep,
      time: '11:30',
      title: 'Executive Valet Checkout & International Flight Escort',
      location: `${hotel} • VIP Valet Exit`,
      description: 'Expedited room settlement, luxury vehicle transfer, and airline terminal curbside concierge check-in assistance.',
      category: 'departure',
      image: urbanMain,
      ticket: {
        code: `${tktCode}-DEP`,
        label: 'Airport Terminal Fast Track & Chauffeur Ticket',
        downloadUrl: '#',
        fileSize: '980 KB',
      },
    },
  ];
}
