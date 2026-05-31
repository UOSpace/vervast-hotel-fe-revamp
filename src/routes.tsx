import { Navigate, type RouteObject } from 'react-router-dom';
import { LoginPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { PropertyDashboardPage } from './features/dashboard/pages/PropertyDashboardPage';
import { MasterLayout } from './components/layouts/MasterLayout';
import { UnderConstructionPage } from './features/common/pages/UnderConstructionPage';

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
        path: '/dashboard/*',
        element: <UnderConstructionPage />,
      }
    ],
  },
  {
    // Fallback route
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
