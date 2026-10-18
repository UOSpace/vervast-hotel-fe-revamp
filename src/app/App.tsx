import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { AppProviders } from './providers';

const router = createBrowserRouter(routes);

function findScrollContainer(): HTMLElement {
  const el = document.querySelector<HTMLElement>('main .overflow-y-auto, main .overflow-auto');
  if (el) {
    if (window.getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    if (el.scrollLeft !== 0) {
      el.scrollLeft = 0;
    }
    return el;
  }
  return document.body;
}

export function App() {
  const isDummyData = import.meta.env.VITE_DATA === 'dummy';
  const locationKey = useSyncExternalStore(
    (cb) => router.subscribe(cb),
    () => `${router.state.location.pathname}${router.state.location.search}`,
  );
  const isLoginPage = locationKey.startsWith('/login');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isLoginPage) {
      setPortalTarget(null);
      return;
    }

    const updateTarget = () => {
      const target = findScrollContainer();
      setPortalTarget((prev) => (prev === target ? prev : target));
    };

    updateTarget();
    const rafId = requestAnimationFrame(updateTarget);
    const observer = new MutationObserver(() => {
      updateTarget();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [isLoginPage, locationKey]);

  useEffect(() => {
    if (!portalTarget) return;
    if (portalTarget.scrollLeft !== 0) {
      portalTarget.scrollLeft = 0;
    }
    const handleScroll = () => {
      if (portalTarget.scrollLeft !== 0) {
        portalTarget.scrollLeft = 0;
      }
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };
    portalTarget.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      portalTarget.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [portalTarget]);

  return (
    <AppProviders>
      {isDummyData && !isLoginPage && portalTarget &&
        createPortal(
          <div className="absolute top-0 right-0 w-28 h-28 overflow-clip pointer-events-none z-30">
            <div className="absolute top-3 -right-8 w-28 bg-zinc-800/95 text-white text-[7.5px] font-semibold uppercase tracking-wider py-0.5 text-center rotate-45 shadow-xs border-y border-zinc-700">
              Dummy Data
            </div>
          </div>,
          portalTarget,
        )}
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
