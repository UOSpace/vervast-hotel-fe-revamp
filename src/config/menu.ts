import { 
  Globus, City, UsersGroupTwoRounded, HandShake, Wallet, Calendar, Bed, TagPrice, PieChart, Code, Bell
} from '@solar-icons/react';

export const sidebarMenu = [
  { name: 'Group View', icon: Globus, path: '/dashboard' },
  { name: 'Property View', icon: City, path: '/dashboard/property' },
  { name: 'Guests', icon: UsersGroupTwoRounded, path: '/dashboard/guests' },
  { name: 'Partners', icon: HandShake, path: '/dashboard/partners' },
  { name: 'Revenue', icon: Wallet, path: '/dashboard/revenue' },
  { name: 'Reservations', icon: Calendar, path: '/dashboard/reservations' },
  { name: 'Operations', icon: Bed, path: '/dashboard/operations' },
  { name: 'Sales', icon: TagPrice, path: '/dashboard/sales' },
  { name: 'Finance', icon: PieChart, path: '/dashboard/finance' },
  { name: 'Development', icon: Code, path: '/dashboard/development' },
  { name: 'Alerts', icon: Bell, path: '/dashboard/alerts' },
];
