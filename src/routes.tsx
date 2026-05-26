import { Navigate, type RouteObject } from 'react-router-dom';
import { LoginPage } from './features/auth';
import { DashboardPage } from './features/dashboard';
import { MasterLayout } from './components/layouts/MasterLayout';

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
      // You can easily add more routes here, e.g.:
      // { path: '/dashboard/property', element: <PropertyPage /> }
    ],
  },
  {
    // Fallback route
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
