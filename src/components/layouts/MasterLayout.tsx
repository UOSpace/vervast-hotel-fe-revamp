import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function MasterLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden relative text-[#4a3c31] bg-[#EFE7D5]">
      <Sidebar />

      <main className="flex-1 overflow-hidden relative z-10 p-4 lg:p-6 flex flex-col h-full">
        <div className="w-full h-full max-w-[1920px] mx-auto">
          {/* Renders the matched child route component */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
