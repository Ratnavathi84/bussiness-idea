import { useState } from 'react';
import { ViewType } from './types';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './views/LandingPage';
import { Dashboard } from './views/Dashboard';
import { JournalEditor } from './views/JournalEditor';
import { AIAssistant } from './views/AIAssistant';
import { TravelMap } from './views/Map';

// Placeholder for unbuilt pages
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex-1 flex items-center justify-center p-8 text-center text-ink/50">
    <div className="glass-panel p-12 rounded-3xl">
      <h2 className="text-3xl font-display font-medium text-ink mb-4">{title}</h2>
      <p className="text-ink/60">This module is currently being crafted.</p>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  if (currentView === 'landing') {
    return <LandingPage onStart={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper text-ink">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 h-full overflow-y-auto relative no-scrollbar">
        {/* Subtle background decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-sage/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-terra/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full h-full min-h-screen">
          {currentView === 'dashboard' && <Dashboard onChangeView={setCurrentView} />}
          {currentView === 'editor' && <JournalEditor />}
          {currentView === 'ai' && <AIAssistant />}
          {currentView === 'map' && <TravelMap />}
          
          {/* Missing view placeholders */}
          {currentView === 'gallery' && <ComingSoon title="Curated Gallery" />}
          {currentView === 'bucket-list' && <ComingSoon title="Your Bucket List" />}
          {currentView === 'stats' && <ComingSoon title="Activity Statistics" />}
          {currentView === 'profile' && <ComingSoon title="Traveler Profile" />}
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 glass-panel rounded-full px-6 py-4 flex items-center justify-between z-50">
        <button onClick={() => setCurrentView('dashboard')} className={`p-2 rounded-full ${currentView === 'dashboard' ? 'text-ink bg-ink/5' : 'text-ink/40'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        </button>
        <button onClick={() => setCurrentView('editor')} className="p-3 rounded-full bg-ink text-paper shadow-lg shadow-ink/20 -mt-8 border-4 border-paper hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
        <button onClick={() => setCurrentView('ai')} className={`p-2 rounded-full ${currentView === 'ai' ? 'text-sage bg-sage/10' : 'text-ink/40'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M3 5h4"/></svg>
        </button>
      </nav>
    </div>
  );
}
