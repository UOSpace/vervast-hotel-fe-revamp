import { useSyncExternalStore } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { AppProviders } from './providers';

const router = createBrowserRouter(routes);

export function App() {
  const isDummyData = import.meta.env.VITE_DATA === 'dummy';
  const pathname = useSyncExternalStore(
    (cb) => router.subscribe(cb),
    () => router.state.location.pathname,
  );
  const isLoginPage = pathname.startsWith('/login');

  return (
    <AppProviders>
      {isDummyData && !isLoginPage && (
        <div className="fixed top-3 -right-8 w-28 bg-zinc-800/95 text-white text-[7.5px] font-semibold uppercase tracking-wider py-0.5 text-center rotate-45 z-[9999] shadow-xs pointer-events-none border-y border-zinc-700">
          Dummy Data
        </div>
      )}
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
