import { motion } from 'motion/react';
import { Camera, MapPin, Calendar, Compass, Send } from 'lucide-react';

export function JournalEditor() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 w-full max-w-4xl mx-auto h-full flex flex-col pt-12 md:pt-8"
    >
      <div className="bg-white text-ink border border-ink/5 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
        
        {/* Cover Photo Placeholder */}
        <div className="h-72 bg-sand/30 relative group flex items-center justify-center border-b border-ink/10 cursor-pointer transition-colors hover:bg-sand/50">
          <div className="flex flex-col items-center text-ink/40 group-hover:text-ink/60 transition-colors duration-300">
            <Camera size={32} className="mb-3 stroke-[1.5]" />
            <span className="font-medium text-sm tracking-widest uppercase">Upload Header Image</span>
          </div>
        </div>

        <div className="p-10 md:p-14 flex-1 flex flex-col">
          <input 
            type="text" 
            placeholder="Volume Title..."
            className="text-5xl md:text-6xl font-display font-medium text-ink mb-8 outline-none bg-transparent placeholder:text-ink/10 leading-tight"
          />

          <div className="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-ink/10">
            <div className="flex items-center space-x-3 text-ink/60">
              <MapPin size={18} className="text-terra" />
              <input type="text" placeholder="Location" className="outline-none bg-transparent placeholder:text-ink/30 font-medium text-sm tracking-wide" />
            </div>
            <div className="flex items-center space-x-3 text-ink/60">
              <Calendar size={18} className="text-sage" />
              <input type="date" className="outline-none bg-transparent font-medium text-sm tracking-wide cursor-pointer opacity-70" />
            </div>
          </div>

          <textarea 
            placeholder="Begin your narrative here..."
            className="flex-1 w-full resize-none outline-none font-sans text-lg text-ink/80 leading-loose placeholder:text-ink/20 bg-transparent"
          ></textarea>

          <div className="pt-8 mt-auto border-t border-ink/10 flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <button className="p-3 text-ink/40 hover:text-ink hover:bg-ink/5 rounded-full transition-colors tooltip">
                 <Camera size={20} strokeWidth={1.5} />
               </button>
             </div>
             <div className="flex items-center space-x-4">
               <button className="px-6 py-2 text-ink/50 font-semibold text-sm tracking-widest uppercase hover:text-ink transition-colors">
                 Save Draft
               </button>
               <button className="px-8 py-3 bg-ink text-paper font-medium rounded-full hover:bg-ink/90 transition-colors flex items-center space-x-2 shadow-lg shadow-ink/10">
                 <span>Publish Entry</span>
                 <Send size={16} />
               </button>
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
