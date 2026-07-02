import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { ToastProvider } from './components/ui/toast';
import { ThemeProvider } from './config/theme-provider';

const router = createBrowserRouter(routes);

function App() {
  const isDummyData = import.meta.env.VITE_DATA === 'dummy';

  return (
    <ThemeProvider defaultTheme="light" storageKey="vervast-hotel-theme">
      <ToastProvider>
        {isDummyData && (
          <div className="fixed top-6 -right-12 w-48 bg-[#947b66] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center rotate-45 z-[9999] shadow-md pointer-events-none border border-[#7d6b5e]">
            Dummy Data
          </div>
        )}
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

