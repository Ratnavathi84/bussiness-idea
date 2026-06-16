import { motion } from 'motion/react';
import { Sparkles, Send, Plane, Map as MapIcon, Image as ImageIcon, CloudCheck, HardDrive } from 'lucide-react';
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';

export function AIAssistant() {
  const { user, chatMessages, sendMessage } = useFirebase();
  const [localMessages, setLocalMessages] = useState([
    { role: 'ai', content: 'Good day. I am your Editorial Travel Assistant. I am here to help you draft eloquent stories, discover understated locales, or summarize your itineraries. How may I assist your writing today?' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // If signed in, render Firestore list; otherwise render local list
  const activeMessages = user && chatMessages.length > 0 ? chatMessages : localMessages;

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const textToSend = input;
    setInput('');
    setSending(true);

    if (user) {
      // Craft a cohesive narrative response
      const responses = [
        `Understood. Let me weave your scattered notes into an understated, clean, and beautifully toned travelogue. I'm saving this conversation round directly within your secured travel files.`,
        `Fascinating choice. When composing notes of this locale, we should emphasize the light, local textures, and gentle, slow mornings. I've archived our ideas inside your traveler profile.`,
        `That sounds like a magnificent itinerary. I've noted down your preferences and compiled them into a high-contrast chronological table of suggestions. This is synchronized in real-time under your profile.`,
        `Analyzing... Imagine we capture the profound silence of these places. I have saved our collaborative thoughts directly in your global wanderlust cloud registry.`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      try {
        await sendMessage(textToSend, randomResponse);
      } catch (error) {
        console.error('Error saving chat logs to Firestore:', error);
      } finally {
        setSending(false);
      }
    } else {
      // Guest local fallback
      setLocalMessages(prev => [...prev, { role: 'user', content: textToSend }]);
      setTimeout(() => {
        setLocalMessages(prev => [...prev, { 
          role: 'ai', 
          content: "I am review-reading your travel notes. Since you are currently in offline Sandbox, connect your Google Account with Google AI Studio to save our conversation rounds permanently!" 
        }]);
        setSending(false);
      }, 700);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 w-full max-w-4xl mx-auto h-full flex flex-col font-sans"
    >
      <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-8 flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-sage/10 rounded-full text-sage">
            <Sparkles size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-medium text-ink mb-1">Writing Assistant</h2>
            <p className="text-ink/50 text-sm font-medium tracking-widest uppercase">AI-Powered Editorial Companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-ink/40 text-xs py-1.5 px-3 bg-ink/5 rounded-full border border-ink/5">
          {user ? (
            <>
              <CloudCheck size={14} className="text-sage" />
              <span className="text-sage font-medium">Secured with Firestore</span>
            </>
          ) : (
            <>
              <HardDrive size={14} />
              <span>Offline Sandbox</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white border border-ink/10 shadow-2xl shadow-ink/5 rounded-3xl flex flex-col overflow-hidden relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-paper">
          {activeMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-6 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-ink text-paper rounded-br-sm' 
                  : 'bg-white text-ink border border-ink/5 shadow-sm rounded-bl-sm'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center space-x-2 mb-3 text-sage">
                    <Sparkles size={14} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Assistant</span>
                  </div>
                )}
                <p className={`leading-relaxed text-sm md:text-base ${msg.role === 'ai' ? 'text-ink/80' : 'text-paper/90'}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-ink/5">
          <div className="flex items-center space-x-3 overflow-x-auto pb-4 no-scrollbar">
            <button 
              onClick={() => handleQuickPrompt("Draft an understated beachside weekend itinerary.")}
              className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Plane size={14} className="text-terra" />
              <span>Draft Itinerary</span>
            </button>
            <button 
              onClick={() => handleQuickPrompt("Discover secret under-the-radar architecture locales in Japan.")}
              className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <MapIcon size={14} className="text-sage" />
              <span>Explore Locales</span>
            </button>
            <button 
              onClick={() => handleQuickPrompt("Tell me about the lights and shadows in Mediterranean photography.")}
              className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <ImageIcon size={14} className="text-sand" />
              <span>Composition Tips</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for writing assistance, destination tips, or story generation..."
              className="flex-1 bg-paper border border-ink/10 rounded-full px-6 py-4 text-ink placeholder:text-ink/30 focus:outline-none focus:border-sage transition-colors text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={sending}
              className="p-4 bg-ink text-paper rounded-full hover:bg-ink/90 transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
