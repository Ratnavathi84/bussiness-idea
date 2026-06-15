import { motion } from 'motion/react';
import { Trip, Stat } from '../types';
import { mockTrips } from '../data';
import { MapPin, Globe, PlaneTakeoff, Award, Plus, Camera } from 'lucide-react';

const stats: Stat[] = [
  { label: 'Countries Visited', value: 14, icon: Globe },
  { label: 'Cities Explored', value: 32, icon: MapPin },
  { label: 'Total Flights', value: 28, icon: PlaneTakeoff },
  { label: 'Travel Tokens', value: 1250, icon: Award },
];

export function Dashboard({ onChangeView }: { onChangeView: (view: any) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 md:p-12 pb-32 md:pb-12 w-full max-w-7xl mx-auto"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-ink/10 pb-8">
        <div>
          <h1 className="text-5xl font-display font-medium text-ink mb-3 tracking-tight">Your Journeys</h1>
          <p className="text-ink/60 font-medium tracking-wide text-sm uppercase">Curated Collections</p>
        </div>
        <button 
          onClick={() => onChangeView('editor')}
          className="mt-6 md:mt-0 px-6 py-3 bg-ink text-paper font-medium rounded-full hover:bg-ink/90 transition-colors flex items-center space-x-2 shadow-lg shadow-ink/10"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <stat.icon className="text-sage mb-4" size={28} strokeWidth={1.5} />
            <div className="text-4xl font-display font-medium text-ink mb-2">{stat.value}</div>
            <div className="text-xs uppercase tracking-widest font-semibold text-ink/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-medium text-ink">Recent Volumes</h2>
        <button className="text-sm font-semibold tracking-wider uppercase text-terra hover:text-terra/80 transition-colors">View All Gallery</button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockTrips.map((trip) => (
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
            
            <div className="absolute bottom-0 left-0 w-full p-8 text-left">
              <div className="flex items-center space-x-2 text-paper/80 mb-3">
                <MapPin size={16} className="text-terra" />
                <span className="text-xs tracking-widest uppercase font-semibold">{trip.location}</span>
              </div>
              <h3 className="text-3xl font-display font-medium text-paper mb-4 leading-tight">{trip.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-paper/60 uppercase tracking-widest font-medium">
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="p-3 bg-paper/10 backdrop-blur-md rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Camera size={16} className="text-paper" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
