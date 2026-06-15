import { Map, LayoutDashboard, PenTool, Image as ImageIcon, MapPin, Sparkles, BarChart3, User, LogOut } from 'lucide-react';
import { ViewType } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const navItems: { id: ViewType; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'My Journeys', icon: LayoutDashboard },
    { id: 'map', label: 'Travel Map', icon: Map },
    { id: 'editor', label: 'Journal Editor', icon: PenTool },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'bucket-list', label: 'Bucket List', icon: MapPin },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-screen hidden md:flex flex-col border-r border-ink/10 glass-panel-dark sticky top-0"
    >
      <div className="p-6 pt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
          Wanderlust.
        </h1>
        <p className="text-xs text-ink/40 uppercase tracking-widest mt-2 font-medium">Digital Journal</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-ink text-paper shadow-lg shadow-ink/10' 
                  : 'text-ink/60 hover:text-ink hover:bg-ink/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-paper' : 'text-ink/40'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-ink/5">
        <button 
          onClick={() => onChangeView('landing')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-ink/50 hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}
