import { motion } from 'motion/react';
import { Sparkles, Send, Plane, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Good day. I am your Editorial Travel Assistant. I am here to help you draft eloquent stories, discover understated locales, or summarize your itineraries. How may I assist your writing today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I am thoughtfully reviewing your request. Imagine I am weaving your scattered notes into a cohesive, beautifully toned narrative." 
      }]);
    }, 1000);
    setInput('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 w-full max-w-4xl mx-auto h-full flex flex-col"
    >
      <div className="flex items-center space-x-4 mb-10 border-b border-ink/10 pb-8">
        <div className="p-4 bg-sage/10 rounded-full text-sage">
          <Sparkles size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-medium text-ink mb-1">Writing Assistant</h2>
          <p className="text-ink/50 text-sm font-medium tracking-widest uppercase">AI-Powered Editorial Companion</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-ink/10 shadow-2xl shadow-ink/5 rounded-3xl flex flex-col overflow-hidden relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-paper">
          {messages.map((msg, i) => (
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
            <button className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors">
              <Plane size={14} className="text-terra" />
              <span>Draft Itinerary</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors">
              <MapIcon size={14} className="text-sage" />
              <span>Explore Locales</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-ink/10 rounded-full text-xs font-medium text-ink/60 hover:text-ink hover:bg-ink/5 whitespace-nowrap shrink-0 transition-colors">
              <ImageIcon size={14} className="text-sand border-none bg-ink text-paper" />
              <span>Analyze Photo</span>
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
              className="p-4 bg-ink text-paper rounded-full hover:bg-ink/90 transition-transform hover:scale-105"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
