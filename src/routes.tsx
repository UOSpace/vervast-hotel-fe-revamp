import { Navigate, type RouteObject } from 'react-router-dom';
import { LoginPage } from './features/auth';
import { DashboardPage, FnbDashboardPage, SpaDashboardPage } from './features/dashboard';
import { PropertyDashboardPage } from './features/dashboard/pages/PropertyDashboardPage';
import { MasterLayout } from './components/layouts/MasterLayout';
import { UnderConstructionPage } from './features/common/pages/UnderConstructionPage';
import { NotFoundPage } from './features/common/pages/NotFoundPage';
import { GuestProfilePage, IndividualGuestsPage, FamilyGuestsPage, IndividualGuestProfilePage } from './features/guests';
import { PartnersPage, TravelAgenciesPage } from './features/partners';

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
        element: <FamilyGuestsPage />,
      },
      {
        path: '/dashboard/guests/family/:uuid',
        element: <GuestProfilePage />,
      },
      {
        path: '/dashboard/guests/individual',
        element: <IndividualGuestsPage />,
      },
      {
        path: '/dashboard/guests/individual/:uuid',
        element: <IndividualGuestProfilePage />,
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
        element: <TravelAgenciesPage />,
      },
      {
        path: '/dashboard/partners/corporate',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/experience/fnb',
        element: <FnbDashboardPage />,
      },
      {
        path: '/dashboard/experience/activities',
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
        path: '/dashboard/spa',
        element: <SpaDashboardPage />,
      },
      {
        // Redirect old wellness path to new /spa route
        path: '/dashboard/operations/wellness',
        element: <Navigate to="/dashboard/spa" replace />,
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
