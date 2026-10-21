import {
  Globus, City, UsersGroupTwoRounded, HandShake, Calendar, TagPrice, PieChart, Settings, User, ChefHat
} from '@solar-icons/react';

export interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  children?: { name: string; path: string; isDynamicOverview?: boolean }[];
}

/** Portal-specific menu (rendered under the portal name). */
export const sidebarMenu: MenuItem[] = [
  {
    name: 'Group View',
    icon: Globus,
    path: '/dashboard',
    children: [
      { name: 'Global Overview', path: '/dashboard', isDynamicOverview: true },
      { name: 'Property Categories', path: '/dashboard/categories' },
      { name: 'Regional View', path: '/dashboard/regional' },
    ],
  },
  { name: 'Property View', icon: City, path: '/dashboard/property' },
  {
    name: 'Reservations',
    icon: Calendar,
    path: '/dashboard/reservations',
    children: [
      { name: 'Overview', path: '/dashboard/reservations/overview' },
      // { name: 'Front Office', path: '/dashboard/reservations/front-office' },
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
];

export const fnbSidebarMenu: MenuItem[] = [
  {
    name: 'Group View',
    icon: Globus,
    path: '/dashboard/fnb',
    children: [
      { name: 'Global Overview', path: '/dashboard/fnb', isDynamicOverview: true },
      // { name: 'Property Categories', path: '/dashboard/fnb/categories' },
      // { name: 'Regional View', path: '/dashboard/fnb/regional' },
    ],
  },
  { name: 'Property View', icon: City, path: '/dashboard/fnb/property' },
  {
    name: 'Point of Sale (POS)',
    icon: ChefHat,
    path: '/dashboard/fnb/pos',
  },
  {
    name: 'Reservations',
    icon: Calendar,
    path: '/dashboard/reservations',
    children: [
      { name: 'Overview', path: '/dashboard/reservations/overview' },
      // { name: 'Front Office', path: '/dashboard/reservations/front-office' },
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
];

/** Shared across every portal (rendered under the "General" label). */
export const generalSidebarMenu: MenuItem[] = [
  {
    name: 'Contacts',
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
  { name: 'Reports', icon: PieChart, path: '/dashboard/reports' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'User Profile', icon: User, path: '/dashboard/profile' },
];

export function getSidebarMenu(portal: string): MenuItem[] {
  if (portal === 'fnb-experience') {
    return fnbSidebarMenu;
  }
  if (portal === 'sanctuary') {
    // Sanctuary has no Property Categories / Regional View (Hospitality-only views),
    // and its Property View points to /dashboard/sanctuary/property.
    return sidebarMenu.map((item) => {
      if (item.name === 'Group View') {
        return {
          ...item,
          children: item.children?.filter(
            (c) => c.path !== '/dashboard/categories' && c.path !== '/dashboard/regional',
          ),
        };
      }
      if (item.name === 'Property View') {
        return {
          ...item,
          path: '/dashboard/sanctuary/property',
        };
      }
      return item;
    });
  }
  return sidebarMenu;
}

export interface MenuSection {
  label: string | null;
  items: MenuItem[];
}

/**
 * Menu groups for a portal. Experiences & F&B is a single portal whose
 * sidebar is split into two header groups (Experiences / F&B).
 */
export function getPortalSections(portal: string): MenuSection[] {
  if (portal === 'fnb-experience') {
    const [fnbGroup, fnbProperty, pos, ...rest] = fnbSidebarMenu;
    return [
      { label: 'F&B', items: [fnbGroup, fnbProperty, pos] },
      {
        label: 'Experiences',
        items: [
          {
            name: 'Group View',
            icon: Globus,
            path: '/dashboard/experience',
            children: [
              { name: 'Global Overview', path: '/dashboard/experience', isDynamicOverview: true },
              // { name: 'Property Categories', path: '/dashboard/experience/categories' },
              // { name: 'Regional View', path: '/dashboard/experience/regional' },
            ],
          },
          { name: 'Property View', icon: City, path: '/dashboard/experience/property' },
        ],
      },
      { label: 'Operations', items: rest },
    ];
  }
  return [{ label: null, items: getSidebarMenu(portal) }];
}

export function getGeneralMenu(): MenuItem[] {
  return generalSidebarMenu;
}
