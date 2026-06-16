import { Map, LayoutDashboard, PenTool, Image as ImageIcon, MapPin, Sparkles, BarChart3, User, LogOut, LogIn } from 'lucide-react';
import { ViewType } from '../types';
import { motion } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const { user, login, logout } = useFirebase();

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

  const handleSignOutClick = async () => {
    try {
      await logout();
      onChangeView('landing');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignInClick = async () => {
    try {
      await login();
      onChangeView('dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-screen hidden md:flex flex-col border-r border-ink/10 glass-panel-dark sticky top-0 font-sans"
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

      <div className="p-4 mt-auto border-t border-ink/5 flex flex-col space-y-4">
        {user ? (
          <div className="flex items-center justify-between p-2 bg-ink/5 rounded-2xl border border-ink/5">
            <div className="flex items-center space-x-3 min-w-0">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "Avatar"} 
                  className="w-9 h-9 rounded-full object-cover border border-ink/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-sage/20 text-sage flex items-center justify-center font-display font-medium text-sm">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink truncate leading-tight">
                  {user.displayName || 'Traveler'}
                </p>
                <p className="text-[10px] text-ink/40 truncate leading-none mt-1">
                  Verified Vault
                </p>
              </div>
            </div>
            <button 
              onClick={handleSignOutClick}
              title="Sign Out"
              className="p-2 text-ink/40 hover:text-terra hover:bg-terra/10 rounded-xl transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSignInClick}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-sage/10 text-sage hover:bg-sage/20 rounded-xl transition-all font-semibold text-xs uppercase tracking-wider"
          >
            <LogIn size={14} />
            <span>Connect Firebase</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
