import { motion } from 'motion/react';
import { Trip, Stat } from '../types';
import { mockTrips } from '../data';
import { MapPin, Globe, PlaneTakeoff, Award, Plus, Camera, Trash2, CloudCheck, HardDrive } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

export function Dashboard({ onChangeView }: { onChangeView: (view: any) => void }) {
  const { user, trips, deleteTrip } = useFirebase();

  // Show live trips from Firestore if signed in, otherwise default to high-fidelity mock data
  const isGuest = !user;
  const tripsToDisplay = trips.length > 0 ? trips : mockTrips;

  // Calculate stats dynamically
  const uniqueCountries = new Set(
    tripsToDisplay.map((t) => {
      const parts = t.location.split(',');
      return parts[parts.length - 1]?.trim() || '';
    }).filter(Boolean)
  ).size;

  const totalDestinations = tripsToDisplay.length;
  const flights = tripsToDisplay.length * 2;
  const curatorTokens = tripsToDisplay.length * 150 + (user ? 350 : 150);

  const dynamicStats: Stat[] = [
    { label: 'Countries Visited', value: uniqueCountries || 1, icon: Globe },
    { label: 'Destinations Curated', value: totalDestinations, icon: MapPin },
    { label: 'Virtual Flights', value: flights, icon: PlaneTakeoff },
    { label: 'Curator Rank', value: curatorTokens, icon: Award },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 pb-32 md:pb-12 w-full max-w-7xl mx-auto font-sans"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-ink/10 pb-8">
        <div>
          <h1 className="text-5xl font-display font-medium text-ink mb-3 tracking-tight">Your Journeys</h1>
          <p className="text-ink/60 font-medium tracking-wide text-sm uppercase">
            {isGuest ? "Local Sandbox (Guest Mode)" : `Curated Vault for ${user.displayName || "Traveler"}`}
          </p>
        </div>
        <button 
          onClick={() => onChangeView('editor')}
          className="mt-6 md:mt-0 px-6 py-3 bg-ink text-paper font-medium rounded-full hover:bg-ink/90 transition-colors flex items-center space-x-2 shadow-lg shadow-ink/10 cursor-pointer"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {dynamicStats.map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <stat.icon className="text-sage mb-4" size={28} strokeWidth={1.5} />
            <div className="text-4xl font-display font-medium text-ink mb-2">{stat.value}</div>
            <div className="text-xs uppercase tracking-widest font-semibold text-ink/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-medium text-ink">Recent Volumes</h2>
        <div className="flex items-center space-x-2 text-ink/40 text-xs">
          {isGuest ? (
            <>
              <HardDrive size={14} />
              <span>Offline presets shown</span>
            </>
          ) : (
            <>
              <CloudCheck size={14} className="text-sage" />
              <span className="text-sage">Syncing real-time with Firestore</span>
            </>
          )}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tripsToDisplay.map((trip) => {
          const isUserOwned = trips.some((t) => t.id === trip.id);
          return (
            <motion.div 
              whileHover={{ y: -8 }}
              key={trip.id} 
              className="group relative h-[28rem] rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-ink/5"
              onClick={() => onChangeView('gallery')}
            >
              <img 
                src={trip.coverImage} 
                alt={trip.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-80" />
              
              {/* Cloud badge indicator */}
              <div className="absolute top-4 right-4 bg-paper/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-paper/10 text-paper z-25">
                {isUserOwned ? (
                  <>
                    <CloudCheck size={12} className="text-green-300" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Cloud Sync</span>
                  </>
                ) : (
                  <>
                    <HardDrive size={12} className="text-paper/70" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-paper/70">Demo Space</span>
                  </>
                )}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 text-left z-20">
                <div className="flex items-center space-x-2 text-paper/80 mb-3">
                  <MapPin size={16} className="text-terra" />
                  <span className="text-xs tracking-widest uppercase font-semibold">{trip.location}</span>
                </div>
                <h3 className="text-3xl font-display font-medium text-paper mb-4 leading-tight">{trip.title}</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-paper/60 uppercase tracking-widest font-medium">
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {isUserOwned && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to bury this journey in the sand?')) {
                            deleteTrip(trip.id);
                          }
                        }}
                        title="Delete cloud journal"
                        className="p-3 bg-red-500/20 hover:bg-red-500 text-paper backdrop-blur-md rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 cursor-pointer hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="p-3 bg-paper/10 backdrop-blur-md rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Camera size={16} className="text-paper" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
