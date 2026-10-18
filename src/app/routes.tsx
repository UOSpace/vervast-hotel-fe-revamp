import { Navigate, type RouteObject } from 'react-router-dom';
import { LoginPage, PortalSelectionPage } from '@/features/auth';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import {
  DashboardPage,
  FnbDashboardPage,
  FnbCategoriesView,
  FnbRegionalView,
  FnbPropertyDashboardPage,
  ExperienceDashboardPage,
  ExperienceCategoriesView,
  ExperienceRegionalView,
  ExperiencePropertyDashboardPage,
  SpaDashboardPage,
} from '@/features/dashboard';
import { PropertyDashboardPage } from '@/features/dashboard/pages/PropertyDashboardPage';
import { MasterLayout } from '@/components/layouts/MasterLayout';
import { UnderConstructionPage } from '@/features/common/pages/UnderConstructionPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { GuestProfilePage, IndividualGuestsPage, FamilyGuestsPage, IndividualGuestProfilePage } from '@/features/guests';
import { PartnersPage, TravelAgenciesPage, CorporatePage, CorporateDetailPage } from '@/features/partners';
import { LeadsPage, LeadDetailPage, BookingsPage, BookingDetailPage, ReservationOverviewPage, FrontOfficeDashboardPage } from '@/features/reservations';
import { ActivitiesPage, EmailMarketingPage } from '@/features/sales';
import { FnbPosPage } from '@/features/fnb/pages/FnbPosPage';

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
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/portal',
    element: <PortalSelectionPage />,
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
        path: '/dashboard/categories',
        element: <DashboardPage />,
      },
      {
        path: '/dashboard/regional',
        element: <DashboardPage />,
      },
      {
        path: '/dashboard/property-categories',
        element: <Navigate to="/dashboard/categories" replace />,
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
        element: <CorporatePage />,
      },
      {
        path: '/dashboard/partners/corporate/:id',
        element: <CorporateDetailPage />,
      },
      {
        path: '/dashboard/fnb',
        element: <FnbDashboardPage />,
      },
      {
        path: '/dashboard/fnb/categories',
        element: <FnbCategoriesView />,
      },
      {
        path: '/dashboard/fnb/regional',
        element: <FnbRegionalView />,
      },
      {
        path: '/dashboard/fnb/property',
        element: <FnbPropertyDashboardPage />,
      },
      {
        path: '/dashboard/fnb/pos/:restaurantCode?',
        element: <FnbPosPage />,
      },
      {
        path: '/dashboard/experience',
        element: <ExperienceDashboardPage />,
      },
      {
        path: '/dashboard/experience/categories',
        element: <ExperienceCategoriesView />,
      },
      {
        path: '/dashboard/experience/regional',
        element: <ExperienceRegionalView />,
      },
      {
        path: '/dashboard/experience/property',
        element: <ExperiencePropertyDashboardPage />,
      },
      { path: '/dashboard/experience/fnb', element: <Navigate to="/dashboard/fnb" replace /> },
      { path: '/dashboard/experience/pos', element: <Navigate to="/dashboard/fnb/pos" replace /> },
      { path: '/dashboard/experience/activities', element: <Navigate to="/dashboard/experience" replace /> },
      {
        path: '/dashboard/reservations',
        element: <Navigate to="/dashboard/reservations/overview" replace />,
      },
      {
        path: '/dashboard/reservations/overview',
        element: <ReservationOverviewPage />,
      },
      {
        path: '/dashboard/reservations/front-office',
        element: <FrontOfficeDashboardPage />,
      },
      {
        path: '/dashboard/reservations/leads',
        element: <LeadsPage />,
      },
      {
        path: '/dashboard/reservations/leads/:id',
        element: <LeadDetailPage />,
      },
      {
        path: '/dashboard/reservations/bookings',
        element: <BookingsPage />,
      },
      {
        path: '/dashboard/reservations/bookings/:id',
        element: <BookingDetailPage />,
      },
      {
        path: '/dashboard/sales/leads',
        element: <LeadsPage />,
      },
      {
        path: '/dashboard/sales/leads/:id',
        element: <LeadDetailPage />,
      },
      {
        path: '/dashboard/sales/bookings',
        element: <BookingsPage />,
      },
      {
        path: '/dashboard/sales/bookings/:id',
        element: <BookingDetailPage />,
      },
      {
        path: '/dashboard/sales/events',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/sales/activities',
        element: <ActivitiesPage />,
      },
      {
        path: '/dashboard/sales/email',
        element: <EmailMarketingPage />,
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
        path: '/dashboard/reports',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/settings',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/profile',
        element: <UnderConstructionPage />,
      },
      {
        path: '/dashboard/development',
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
