import {
  Globus, City, UsersGroupTwoRounded, HandShake, Wallet, Calendar, Bed, TagPrice, PieChart, Bell, Buildings, Compass
} from '@solar-icons/react';
import { LotusIcon } from '../components/icons/LotusIcon';

export interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  children?: { name: string; path: string }[];
}

export const sidebarMenu: MenuItem[] = [
  { name: 'Group View', icon: Globus, path: '/dashboard' },
  { name: 'Property View', icon: City, path: '/dashboard/property' },
  {
    name: 'Guests', icon: UsersGroupTwoRounded, path: '/dashboard/guests',
    children: [
      { name: 'Individual', path: '/dashboard/guests/individual' },
      { name: 'Family', path: '/dashboard/guests/family' },
    ],
  },
  {
    name: 'Partners', icon: HandShake, path: '/dashboard/partners',
    children: [
      { name: 'Relationship Intelligence', path: '/dashboard/partners/relationship' },
      { name: 'Travel Agencies', path: '/dashboard/partners/agencies' },
      { name: 'Corporate', path: '/dashboard/partners/corporate' },
    ],
  },
  { name: 'Spa', icon: LotusIcon, path: '/dashboard/spa' },
  {
    name: 'Experience', icon: Compass, path: '/dashboard/experience',
    children: [
      { name: 'F&B', path: '/dashboard/experience/fnb' },
      { name: 'Activities', path: '/dashboard/experience/activities' },
    ],
  },
  { name: 'Revenue', icon: Wallet, path: '/dashboard/revenue' },
  {
    name: 'Reservations', icon: Calendar, path: '/dashboard/reservations',
    children: [
      { name: 'Leads', path: '/dashboard/reservations/leads' },
      { name: 'Bookings', path: '/dashboard/reservations/bookings' },
    ],
  },
  {
    name: 'Sales & Marketing', icon: TagPrice, path: '/dashboard/sales',
    children: [
      { name: 'Leads', path: '/dashboard/sales/leads' },
      { name: 'Bookings', path: '/dashboard/sales/bookings' },
      { name: 'Events', path: '/dashboard/sales/events' },
      { name: 'Activities', path: '/dashboard/sales/activities' },
      { name: 'Email Marketing', path: '/dashboard/sales/email' },
      { name: 'Web Forms', path: '/dashboard/sales/forms' },
    ],
  },
  {
    name: 'Operations', icon: Bed, path: '/dashboard/operations',
  },
  { name: 'Finance', icon: PieChart, path: '/dashboard/finance' },
  { name: 'Development', icon: Buildings, path: '/dashboard/development' },
  { name: 'Alerts', icon: Bell, path: '/dashboard/alerts' },
];
