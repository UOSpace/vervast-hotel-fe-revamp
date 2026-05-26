import { Link, useLocation } from 'react-router-dom';
import { sidebarMenu } from '../../config/menu';

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-[180px] h-full flex flex-col shrink-0 py-8 z-20 border-r border-[#d4c4b7]">
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <nav className="space-y-2">
          {sidebarMenu.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-[14px] transition-all ${
                  isActive 
                    ? 'bg-[#E3CCB2] text-[#6A5848] font-bold shadow-[-6px_0_0_0_#C3A481]' 
                    : 'text-[#6A5848] font-semibold hover:bg-[#E3CCB2]/50 hover:text-[#6A5848]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#6A5848]' : ''} />
                <span className="text-xs tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
