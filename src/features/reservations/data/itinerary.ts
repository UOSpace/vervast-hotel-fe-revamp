import urbanImg from '@/assets/contents/property_urban.jpg';
import baliImg from '@/assets/contents/property_bali.jpg';
import maldivesImg from '@/assets/contents/property_maldives.jpg';
import switzerlandImg from '@/assets/contents/property_switzerland.jpg';
import costaRicaImg from '@/assets/contents/property_costa_rica.jpg';
import japanImg from '@/assets/contents/property_japan.jpg';
import omanImg from '@/assets/contents/property_oman.jpg';
import egyptImg from '@/assets/contents/property_egypt.jpg';

// Activity & experiential images
import alpineImg from '@/assets/contents/alpine.png';
import sunsetCruiseImg from '@/assets/contents/sunset_cruise.png';
import wellnessRetreatImg from '@/assets/contents/wellness_retreat.png';
import privateDinnerImg from '@/assets/contents/private_dinner_alpine.png';
import oceanImg from '@/assets/contents/ocean.png';
import desertImg from '@/assets/contents/desert.png';
import forestImg from '@/assets/contents/forest.png';
import productWorkshopImg from '@/assets/contents/product_workshop.png';

import type { ItineraryItem, LeadRecord } from './leads';


/** Select authentic varied imagery matching the activity and destination context */
function getItineraryImages(hotel: string) {
  if (hotel === 'SOSEI Andermatt') {
    return {
      arrival: switzerlandImg,
      activity: alpineImg,
      wellness: wellnessRetreatImg,
      dining: privateDinnerImg,
      departure: switzerlandImg,
    };
  }
  if (hotel === 'SOSEI AUH' || hotel === 'SOSEI BALI' || hotel === 'SOSEI Bali' || hotel === 'SOSEI Melides') {
    return {
      arrival: hotel === 'SOSEI AUH' ? maldivesImg : baliImg,
      activity: oceanImg,
      wellness: wellnessRetreatImg,
      dining: sunsetCruiseImg,
      departure: oceanImg,
    };
  }
  if (hotel === 'SOSEI Tinos' || hotel === 'SOSEI El Gouna') {
    return {
      arrival: hotel === 'SOSEI Tinos' ? omanImg : egyptImg,
      activity: desertImg,
      wellness: wellnessRetreatImg,
      dining: privateDinnerImg,
      departure: desertImg,
    };
  }
  if (hotel === 'SOSEI OSA') {
    return {
      arrival: costaRicaImg,
      activity: forestImg,
      wellness: wellnessRetreatImg,
      dining: sunsetCruiseImg,
      departure: costaRicaImg,
    };
  }
  // Urban / Estate: Barcelona, Umbria
  return {
    arrival: hotel === 'SOSEI Umbria' ? japanImg : urbanImg,
    activity: productWorkshopImg,
    wellness: wellnessRetreatImg,
    dining: privateDinnerImg,
    departure: urbanImg,
  };
}

/** Generate dynamic, realistic timeline itinerary per lead from arrival to departure. */
export function buildLeadItinerary(lead: LeadRecord): ItineraryItem[] {
  const hotelName = lead.hotel;
  const arr = lead.arrivalDate;
  const dep = lead.departureDate;
  const codePrefix = lead.confirmationNumber && lead.confirmationNumber !== 'N/A' && lead.confirmationNumber !== 'Pending'
    ? lead.confirmationNumber
    : `TKT-${lead.id}`;

  const imgs = getItineraryImages(lead.hotel);

  return [
    {
      day: 'Day 1',
      date: arr,
      time: '14:00',
      title: `VIP Private Arrival & Escort`,
      location: `${hotelName} • Arrival Pavilion`,
      description: `Chauffeured luxury transfer and private dock / helipad greeting with personalized welcoming ceremony, chilled refreshment and in-suite expedited check-in.`,
      category: 'arrival',
      image: imgs.arrival,
      ticket: {
        code: `${codePrefix}-ARR`,
        label: 'Boarding Pass & Private Transfer Voucher',
        downloadUrl: '#',
        fileSize: '1.4 MB',
      },
    },
    {
      day: 'Day 2',
      date: 'Next Morning',
      time: '09:30',
      title: `Curated Destination Experience & Immersion`,
      location: `${lead.country} • Regional Private Reserve`,
      description: `Exclusive guided excursion tailored for ${lead.company.name}. Private access with heritage naturalists and bespoke gourmet field lunch.`,
      category: 'activity',
      image: imgs.activity,
      ticket: {
        code: `${codePrefix}-EXP`,
        label: 'VIP Access Pass & Guide Dispatch',
        downloadUrl: '#',
        fileSize: '880 KB',
      },
    },
    {
      day: 'Day 3',
      date: 'Mid Stay',
      time: '17:00',
      title: `Thermal Sanctuary & Holistic Wellness`,
      location: `${hotelName} • Spa & Longevity Center`,
      description: `Signature restorative treatments, sound bath therapy, and customized private hydrotherapy session with executive wellness master.`,
      category: 'wellness',
      image: imgs.wellness,
      ticket: {
        code: `${codePrefix}-SPA`,
        label: 'Wellness Voucher & Treatment Schedule',
        downloadUrl: '#',
        fileSize: '620 KB',
      },
    },
    {
      day: 'Day 4',
      date: 'Evening Prior',
      time: '19:30',
      title: `Signature Private Chef Gala Dinner`,
      location: `${hotelName} • Private Deck / Panorama Pavilion`,
      description: `Multi-course bespoke degustation paired with sommelier reserve wines, live acoustic performance, and twilight panoramic vistas.`,
      category: 'dining',
      image: imgs.dining,
    },
    {
      day: `Final Day`,
      date: dep,
      time: '11:00',
      title: `Luggage Valet & Farewell Departure`,
      location: `${hotelName} • Concierge Departure Lounge`,
      description: `Seamless in-suite checkout, commemorative SOSEI gift presentation, and chauffeured transfer coordination to international airport.`,
      category: 'departure',
      image: imgs.departure,
      ticket: {
        code: `${codePrefix}-DEP`,
        label: 'Departure Transfer Ticket & Luggage Tag',
        downloadUrl: '#',
        fileSize: '1.1 MB',
      },
    },
  ];
}
