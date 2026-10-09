import {
  Globus, City, UsersGroupTwoRounded, HandShake, Calendar, TagPrice, PieChart, Settings, User, ChefHat
} from '@solar-icons/react';

export interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  children?: { name: string; path: string; isDynamicOverview?: boolean }[];
}

export const sidebarMenu: MenuItem[] = [
  {
    name: 'Group View',
    icon: Globus,
    path: '/dashboard',
    children: [
      { name: 'Global Overview', path: '/dashboard', isDynamicOverview: true },
      { name: 'Property Categories', path: '/dashboard/categories' },
    ],
  },
  { name: 'Property View', icon: City, path: '/dashboard/property' },
  {
    name: 'Guest',
    icon: UsersGroupTwoRounded,
    path: '/dashboard/guests',
    children: [
      { name: 'Individual', path: '/dashboard/guests/individual' },
      { name: 'Group', path: '/dashboard/guests/family' },
    ],
  },
  {
    name: 'Partners',
    icon: HandShake,
    path: '/dashboard/partners',
    children: [
      { name: 'Relationship Intelligence', path: '/dashboard/partners/relationship' },
      { name: 'Travel Agencies', path: '/dashboard/partners/agencies' },
      { name: 'Corporate', path: '/dashboard/partners/corporate' },
    ],
  },
  {
    name: 'Reservations',
    icon: Calendar,
    path: '/dashboard/reservations',
    children: [
      { name: 'Leads', path: '/dashboard/reservations/leads' },
      { name: 'Bookings', path: '/dashboard/reservations/bookings' },
    ],
  },
  {
    name: 'Sales & Marketing',
    icon: TagPrice,
    path: '/dashboard/sales',
    children: [
      { name: 'Sales Activities', path: '/dashboard/sales/activities' },
      { name: 'Marketing Activities', path: '/dashboard/sales/email' },
      { name: 'Event', path: '/dashboard/sales/events' },
      { name: 'Communication', path: '/dashboard/sales/forms' },
    ],
  },
  { name: 'Reports', icon: PieChart, path: '/dashboard/reports' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'User Profile', icon: User, path: '/dashboard/profile' },
];

export const fnbSidebarMenu: MenuItem[] = [
  {
    name: 'Group View',
    icon: Globus,
    path: '/dashboard/experience/fnb',
    children: [
      { name: 'Global Overview', path: '/dashboard/experience/fnb', isDynamicOverview: true },
      { name: 'Property Categories', path: '/dashboard/categories' },
    ],
  },
  {
    name: 'Point of Sale (POS)',
    icon: ChefHat,
    path: '/dashboard/experience/pos',
  },
  { name: 'Property View', icon: City, path: '/dashboard/property' },
  {
    name: 'Guest',
    icon: UsersGroupTwoRounded,
    path: '/dashboard/guests',
    children: [
      { name: 'Individual', path: '/dashboard/guests/individual' },
      { name: 'Group', path: '/dashboard/guests/family' },
    ],
  },
  {
    name: 'Partners',
    icon: HandShake,
    path: '/dashboard/partners',
    children: [
      { name: 'Relationship Intelligence', path: '/dashboard/partners/relationship' },
      { name: 'Travel Agencies', path: '/dashboard/partners/agencies' },
      { name: 'Corporate', path: '/dashboard/partners/corporate' },
    ],
  },
  {
    name: 'Reservations',
    icon: Calendar,
    path: '/dashboard/reservations',
    children: [
      { name: 'Leads', path: '/dashboard/reservations/leads' },
      { name: 'Bookings', path: '/dashboard/reservations/bookings' },
    ],
  },
  {
    name: 'Sales & Marketing',
    icon: TagPrice,
    path: '/dashboard/sales',
    children: [
      { name: 'Sales Activities', path: '/dashboard/sales/activities' },
      { name: 'Marketing Activities', path: '/dashboard/sales/email' },
      { name: 'Event', path: '/dashboard/sales/events' },
      { name: 'Communication', path: '/dashboard/sales/forms' },
    ],
  },
  { name: 'Reports', icon: PieChart, path: '/dashboard/reports' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'User Profile', icon: User, path: '/dashboard/profile' },
];

export function getSidebarMenu(portal: string): MenuItem[] {
  if (portal === 'fnb-experience') {
    return fnbSidebarMenu;
  }
  return sidebarMenu;
}
