import { motion } from 'motion/react';
import { ViewType } from '../types';
import { Compass, Camera, Sparkles, Map } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

export function LandingPage({ onStart }: { onStart: () => void }) {
  const { user, login } = useFirebase();

  const handleStartWithGoogle = async () => {
    if (user) {
      onStart();
    } else {
      try {
        await login();
        onStart();
      } catch (error) {
        console.warn('Sign-in cancelled or failed. Entering as Guest.', error);
        onStart();
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-paper overflow-hidden font-sans">
      <div className="flex-1 flex flex-col justify-center px-12 md:px-24 lg:px-32 z-10 max-w-4xl relative">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <Compass className="text-terra" size={24} />
            <span className="text-sm font-medium tracking-widest text-ink/60 uppercase">The Editorial Travel Journal</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-medium text-ink mb-8 leading-[1.1] tracking-tight">
            Chronicle your <br />
            <span className="italic text-sage font-light">beautiful</span> world.
          </h1>
          
          <p className="text-xl text-ink/60 max-w-xl mb-12 leading-relaxed">
            A minimalist digital sanctuary to document, reflect, and piece together the memories of your most profound journeys.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button 
              onClick={handleStartWithGoogle}
              className="group px-8 py-4 bg-ink text-paper hover:bg-ink/90 transition-all rounded-full flex items-center justify-center space-x-4 shadow-xl shadow-ink/10 cursor-pointer"
            >
              <span className="font-medium text-lg tracking-wide">
                {user ? "Open My Journal" : "Open with Google"}
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <button 
              onClick={onStart}
              className="px-6 py-4 border border-ink/10 hover:border-ink/30 text-ink/60 hover:text-ink transition-colors rounded-full text-sm font-semibold tracking-wider uppercase cursor-pointer"
            >
              Explore as Guest
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 gap-8 mt-24 max-w-2xl border-t border-ink/10 pt-12"
        >
          {[
            { title: "Curated Galleries", desc: "Your photos presented like an art exhibition." },
            { title: "Mindful Narratives", desc: "Turn raw thoughts into poetic travel memoirs." }
          ].map((feat, i) => (
            <div key={i}>
              <h3 className="text-lg font-display font-medium text-ink mb-2">{feat.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-[45%] bg-sand shadow-2xl z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1499696956244-67252277d3f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Minimalist Architecture / Travel"
          className="w-full h-full object-cover grayscale-[20%] contrast-[110%] object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper to-transparent w-32" />
      </motion.div>
    </div>
  );
}
