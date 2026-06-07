import { Navigate, type RouteObject } from 'react-router-dom';
import { LoginPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { PropertyDashboardPage } from './features/dashboard/pages/PropertyDashboardPage';
import { MasterLayout } from './components/layouts/MasterLayout';
import { UnderConstructionPage } from './features/common/pages/UnderConstructionPage';
import { NotFoundPage } from './features/common/pages/NotFoundPage';
import { GuestsPage, GuestProfilePage } from './features/guests';
import { PartnersPage } from './features/partners';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // All routes that require the MasterLayout (Sidebar) go here
    element: <MasterLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/dashboard/property',
        element: <PropertyDashboardPage />,
      },
      {
        path: '/dashboard/guests',
        element: <Navigate to="/dashboard/guests/family" replace />,
      },
      {
        path: '/dashboard/guests/family',
        element: <GuestsPage />,
      },
      {
        path: '/dashboard/guests/family/:uuid',
        element: <GuestProfilePage />,
      },
      {
        path: '/dashboard/guests/individual',
        element: <GuestsPage />,
      },
      {
        path: '/dashboard/guests/individual/:uuid',
        element: <GuestProfilePage />,
      },
      {
        path: '/dashboard/partners',
        element: <PartnersPage />,
      },
      {
        path: '/dashboard/partners/relationship',
        element: <PartnersPage />,
      },
      {
        path: '/dashboard/partners/agencies',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/partners/corporate',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/reservations/leads',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/reservations/bookings',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/leads',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/bookings',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/events',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/activities',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/email',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/forms',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/operations/wellness',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/operations/housekeeping',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/operations/fnb',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/operations/activities',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/*',
        element: <NotFoundPage />,
      }
    ],
  },
  {
    // Fallback route
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
