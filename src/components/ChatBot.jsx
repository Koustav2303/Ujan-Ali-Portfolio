import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, X, Send, User, Bot } from 'lucide-react';

// ==========================================
// UA.SYS KNOWLEDGE GRAPH (The "Huge Data")
// ==========================================
const botDatabase = [
  {
    intent: 'pricing',
    keywords: ['price', 'cost', 'rate', 'charge', 'fee', 'pricing', 'money', 'budget', 'pay', 'much'],
    response: "Here is Ujan's official rate card:\n\n• Lyrical Video: 150 INR (1 min)\n• Reel Editing: 200 INR (up to 45s) / 350 INR (up to 1 min)\n• Poster Editing: 200 INR per poster\n• Branding & Mockups: 500 INR per package\n• Motion Graphics: 1,000 INR per video\n\nFor bulk packages or long-term contracts, please reach out via the Contact section."
  },
  {
    intent: 'software',
    keywords: ['software', 'tool', 'app', 'program', 'edit with', 'stack', 'engine', 'arsenal'],
    response: "The post-production arsenal is powered by industry-standard engines:\n\n• Video & Motion: Premiere Pro, After Effects\n• 3D & VFX: Blender\n• Audio: Adobe Audition\n• Assets & Color: Photoshop, Illustrator, Lightroom\n• Layout: InDesign"
  },
  {
    intent: 'services',
    keywords: ['service', 'what do you do', 'offer', 'work', 'can you do', 'specialty', 'niche'],
    response: "Ujan specializes in high-end post-production. Core services include:\n\n1. Commercial Cuts (Brand films & promos)\n2. Music Videos (Rhythm-synced visual trips)\n3. Social Retention (High-CTR Reels/Shorts)\n4. Cinematic Color Grading (DaVinci/Lumetri pipelines)\n5. Custom Motion Graphics & VFX."
  },
  {
    intent: 'bio',
    keywords: ['who', 'ujan', 'about', 'bio', 'background', 'experience', 'profile', 'location', 'where'],
    response: "Ujan Ali is a Lead Video Editor and Post-Production Architect based in Bengaluru. He has mastered over 150+ projects, accumulating 10,000+ hours on the timeline and processing over 450 Terabytes of footage. He engineers visual rhythm rather than just cutting clips."
  },
  {
    intent: 'workflow',
    keywords: ['process', 'workflow', 'how do you work', 'steps', 'pipeline', 'method'],
    response: "The UA post-production pipeline operates in 4 phases:\n\n1. Sync & Ingest: Organizing footage and establishing the timeline frame rate.\n2. The Assembly: Building the narrative structure and aggressive pacing.\n3. Visual Engineering: Applying motion graphics, VFX, and sound design.\n4. Final Polish: Cinematic color grading and mastering for target platforms."
  },
  {
    intent: 'delivery',
    keywords: ['time', 'turnaround', 'how long', 'fast', 'deadline', 'delivery', 'days'],
    response: "Turnaround times depend on the project scope:\n\n• Social Reels: 24 to 48 hours.\n• Lyrical & Posters: 1 to 2 days.\n• Motion Graphics & Commercials: 3 to 7 days.\n\nRush delivery is available for high-priority projects upon consultation."
  },
  {
    intent: 'revisions',
    keywords: ['revision', 'change', 'edit again', 'modify', 'feedback'],
    response: "Standard projects include 2 rounds of complimentary revisions to ensure the final cut perfectly matches your vision. Further granular adjustments can be mapped out in the initial project scope."
  },
  {
    intent: 'contact',
    keywords: ['contact', 'hire', 'email', 'reach', 'message', 'book', 'start'],
    response: "To commence a project, scroll to the bottom of the portfolio and utilize the Contact module. You can also send a direct transmission via the linked social channels (Instagram, X, LinkedIn)."
  },
  {
    intent: 'developer',
    keywords: ['developer', 'who made this', 'koustav', 'website', 'coder', 'build', 'creator'],
    response: "This cinematic web experience was engineered by Koustav Pan, a frontend architect specializing in god-tier UI/UX and React/GSAP ecosystems. You can explore his work via the developer signature in the footer."
  },
  {
    intent: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'morning', 'evening'],
    response: "System online. I am UA's automated intelligence. How can I assist you with the portfolio today? Try asking about 'Pricing', 'Services', or 'Software'."
  }
];

// ==========================================
// CHATBOT COMPONENT
// ==========================================
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Terminal initialized. I am UA.SYS, Ujan's dedicated AI. Query me regarding rates, software, workflows, or availability." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Smooth scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clean open/close animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatWindowRef.current, 
        { opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  // The Knowledge Graph Search Engine
  const generateBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Find the best matching intent
    for (let data of botDatabase) {
      if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
        return data.response;
      }
    }

    // Fallback response if no keywords match
    return "Query unrecognized. My databanks cover Ujan's 'pricing', 'software', 'workflow', 'turnaround times', and 'services'. What would you like to know?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    
    // Add user message instantly
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Dynamic delay based on response length for realism
    setTimeout(() => {
      const botResponse = generateBotResponse(userMsg);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleQuickCommand = (cmd) => {
    setInputValue(cmd);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end pointer-events-none">
      
      {/* Sleek Minimal FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-dark shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 cursor-none overflow-hidden ${isOpen ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}
      >
        <Sparkles size={24} className="relative z-10" />
      </button>

      {/* Minimalist Glassmorphism Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="pointer-events-auto w-[calc(100vw-3rem)] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col rounded-[2rem] bg-[#111111]/85 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                 <Bot size={20} className="text-blue-400" />
                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111] rounded-full"></div>
              </div>
              <div>
                <h3 className="font-logo text-white font-bold tracking-wide text-sm">UA.SYS Assistant</h3>
                <p className="font-body text-[10px] text-gray-400 font-medium tracking-widest uppercase">Database Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-none rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Bot Avatar for left-side messages */}
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-2 mt-auto mb-1 border border-white/5">
                    <Bot size={12} className="text-gray-300" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[82%] font-body text-[13px] md:text-sm leading-relaxed p-4 rounded-2xl whitespace-pre-wrap shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-white/[0.04] border border-white/10 text-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* User Avatar for right-side messages */}
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 ml-2 mt-auto mb-1 border border-blue-500/30">
                    <User size={12} className="text-blue-300" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Smooth Typing Indicator */}
            {isTyping && (
              <div className="flex w-full justify-start items-end">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-2 mb-1 border border-white/5">
                  <Bot size={12} className="text-gray-300" />
                </div>
                <div className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-lg">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Command Chips */}
          {messages.length === 1 && !isTyping && (
            <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {['Pricing', 'Software', 'Workflow', 'Delivery Time'].map((cmd, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleQuickCommand(cmd)}
                  className="px-3 py-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/5 text-xs font-body text-gray-300 hover:bg-white/20 hover:text-white transition-all cursor-none"
                >
                  {cmd}
                </button>
              ))}
            </div>
          )}

          {/* Minimal Input Area */}
          <div className="p-4 border-t border-white/5 bg-transparent">
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-center w-full group"
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask UA.SYS anything..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white font-body focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors cursor-none placeholder:text-gray-500"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 rounded-full bg-white text-dark hover:bg-gray-200 disabled:opacity-50 transition-colors cursor-none"
              >
                <Send size={16} className={inputValue.trim() ? "translate-x-[1px] -translate-y-[1px]" : ""} />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatBot;