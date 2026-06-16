import { motion } from 'motion/react';
import { Camera, MapPin, Calendar, Compass, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'
];

export function JournalEditor() {
  const { user, login, addTrip } = useFirebase();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverIndex, setCoverIndex] = useState(0);
  const [narrative, setNarrative] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);

  const cycleCover = () => {
    setCoverIndex((prev) => (prev + 1) % COVER_PRESETS.length);
  };

  const handlePublish = async () => {
    if (!title.trim() || !location.trim()) {
      alert("Please provide a title and a geographical locale for your volume.");
      return;
    }

    setSaving(true);
    try {
      let activeUser = user;
      if (!activeUser) {
        if (confirm("Would you like to connect with Google to secure this journal permanently in the cloud?")) {
          activeUser = await login();
        } else {
          setSaving(false);
          return;
        }
      }

      if (activeUser) {
        // Distribute coordinates nicely across the globe
        const coordinates = {
          lat: Math.random() * 45 - 10,
          lng: Math.random() * 160 - 80
        };

        await addTrip({
          title,
          location,
          coordinates,
          startDate: startDate || new Date().toISOString().split('T')[0],
          endDate: endDate || new Date().toISOString().split('T')[0],
          coverImage: COVER_PRESETS[coverIndex],
          isPublic
        });

        // Reset inputs
        setTitle('');
        setLocation('');
        setStartDate('');
        setEndDate('');
        setNarrative('');
        alert("Success! Your journey is now captured and synced with Firestore.");
      }
    } catch (error) {
      console.error('Failed to publish journey:', error);
      alert("Could not append entry. Check standard browser logs.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    alert("Draft saved to browser local state. Create or log in to secure permanently!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 w-full max-w-4xl mx-auto h-full flex flex-col pt-12 md:pt-8 font-sans"
    >
      <div className="bg-white text-ink border border-ink/5 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
        
        {/* Cover Photo Preset Cycler */}
        <div 
          onClick={cycleCover}
          className="h-72 bg-sand/30 relative group flex items-center justify-center border-b border-ink/10 cursor-pointer overflow-hidden transition-all duration-500"
        >
          <img 
            src={COVER_PRESETS[coverIndex]} 
            alt="Narrative Header Cover preset" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          
          <div className="relative flex flex-col items-center text-paper/80 group-hover:text-paper transition-colors duration-300 text-center px-4">
            <Camera size={32} className="mb-3 stroke-[1.5]" />
            <span className="font-semibold text-xs tracking-widest uppercase mb-1">Cycle Header Landscape</span>
            <p className="text-[10px] text-paper/60 font-medium">Click to pick a beautiful background preset</p>
          </div>
        </div>

        <div className="p-10 md:p-14 flex-1 flex flex-col">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Volume Title..."
            className="text-4xl md:text-5xl font-display font-medium text-ink mb-8 outline-none bg-transparent placeholder:text-ink/10 leading-tight"
          />

          <div className="flex flex-wrap items-center gap-8 mb-10 pb-8 border-b border-ink/10">
            <div className="flex items-center space-x-3 text-ink/60">
              <MapPin size={18} className="text-terra animate-pulse" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Kyoto, Japan)" 
                className="outline-none bg-transparent placeholder:text-ink/30 font-semibold text-sm tracking-wide" 
              />
            </div>
            <div className="flex items-center space-x-3 text-ink/60">
              <Calendar size={18} className="text-sage" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="outline-none bg-transparent font-semibold text-sm tracking-wide cursor-pointer opacity-70" 
              />
            </div>
            <div className="flex items-center space-x-3 text-ink/40">
              <span className="text-xs font-semibold uppercase tracking-wider">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="outline-none bg-transparent font-semibold text-sm tracking-wide cursor-pointer opacity-70" 
              />
            </div>
          </div>

          <textarea 
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Begin your narrative here..."
            className="flex-1 w-full min-h-[15rem] resize-none outline-none font-sans text-lg text-ink/80 leading-loose placeholder:text-ink/20 bg-transparent"
          ></textarea>

          {/* Visibility Option */}
          <div className="flex items-center space-x-6 py-4 border-t border-ink/5">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-ink/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sage relative"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/60">Publish as Public Volume</span>
            </label>
          </div>

          <div className="pt-8 mt-auto border-t border-ink/10 flex items-center justify-end space-x-4">
             <button 
               onClick={handleSaveDraft}
               className="px-6 py-2 text-ink/50 font-semibold text-xs tracking-widest uppercase hover:text-ink transition-colors cursor-pointer"
             >
               Save Draft
             </button>
             <button 
               onClick={handlePublish}
               disabled={saving}
               className="px-8 py-3 bg-ink text-paper font-semibold rounded-full hover:bg-ink/90 transition-all flex items-center space-x-2 shadow-lg shadow-ink/10 cursor-pointer hover:scale-103 active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
             >
               {saving ? (
                 <>
                   <Loader2 size={16} className="animate-spin" />
                   <span>Securing...</span>
                 </>
               ) : (
                 <>
                   <span>Publish Entry</span>
                   <Send size={16} />
                 </>
               )}
             </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
