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
        <div className="fixed top-6 -right-12 w-48 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center rotate-45 z-[9999] shadow-md pointer-events-none border border-zinc-700">
          Dummy Data
        </div>
      )}
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
