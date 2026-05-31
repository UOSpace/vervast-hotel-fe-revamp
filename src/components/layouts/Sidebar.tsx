import { useLocation, useNavigate } from 'react-router-dom';
import { sidebarMenu } from '../../config/menu';

export function Sidebar({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-[148px] h-full flex flex-col shrink-0 py-6 z-20 border-r border-[#d4c4b7]">
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <nav className="space-y-0.5">
          {sidebarMenu.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate ? onNavigate(item.path) : navigate(item.path)}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-[10px] transition-all ${
                  isActive 
                    ? 'bg-[#E3CCB2]/70 text-[#6A5848] font-bold shadow-[-4px_0_0_0_#C3A481]' 
                    : 'text-[#6A5848] font-semibold hover:bg-[#E3CCB2]/40 hover:text-[#6A5848]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#6A5848] shrink-0' : 'shrink-0'} />
                <span className="text-[10px] tracking-wide leading-tight">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
