import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Award, Aperture, Layers3, AudioWaveform, Circle, Play, Pause, Volume2 } from 'lucide-react';

// Import Assets
import ujanPhoto from '../assets/editor/ujan.png';
import introAudio from '../assets/editor/intro.mp3';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const typeRefs = useRef([]);
  const statsRef = useRef([]);
  const bgMarqueeRef = useRef(null);
  
  // Interaction Refs
  const canvasStageRef = useRef(null); 
  const mainImageRef = useRef(null);  
  const floatingUI_1 = useRef(null);   
  const floatingUI_2 = useRef(null);   
  const floatingUI_3 = useRef(null);   
  const audioHudBarRefs = useRef([]); 

  // --- Live Timecode State ---
  const [timecode, setTimecode] = useState('00:00:00:00');

  // --- Audio Player State & Refs ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  // Timecode Generator
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      const frames = Math.floor((diff % 1000) / 33).toString().padStart(2, '0'); 
      setTimecode(`${hours}:${minutes}:${seconds}:${frames}`);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      
      gsap.fromTo(
        [...typeRefs.current, ...statsRef.current],
        { y: 80, opacity: 0, filter: 'blur(15px)', skewY: 10 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          skewY: 0,
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.1,
        }
      );

      gsap.from(canvasStageRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        x: -100, opacity: 0, scale: 0.8, duration: 1.5, ease: "power4.out",
      });

      gsap.to(bgMarqueeRef.current, {
        xPercent: -50, ease: "none", duration: 25, repeat: -1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // God Tier Mouse Parallax
  const handleCanvasMouseMove = (e) => {
    if (!canvasStageRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const rect = canvasStageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const xPos = (e.clientX - centerX) * 0.05;
    const yPos = (e.clientY - centerY) * 0.05;

    gsap.to(canvasStageRef.current, { rotateY: xPos * 0.1, rotateX: -yPos * 0.1, transformPerspective: 2000, duration: 0.8, ease: 'power3.out' });
    gsap.to(mainImageRef.current, { x: xPos * 0.2, y: yPos * 0.2, duration: 1, ease: 'power2.out' });
    gsap.to(floatingUI_1.current, { x: xPos * 0.6, y: yPos * 0.6, rotation: xPos * 0.1, duration: 1, ease: 'power2.out' });
    gsap.to(floatingUI_2.current, { x: xPos * -0.8, y: yPos * -0.8, rotation: xPos * -0.1, duration: 1.2, ease: 'power2.out' });
    gsap.to(floatingUI_3.current, { x: xPos * 1.0, y: yPos * 1.0, duration: 1.4, ease: 'power2.out' });
  };

  const resetCanvasElements = () => {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;
    gsap.to([canvasStageRef.current, mainImageRef.current, floatingUI_1.current, floatingUI_2.current, floatingUI_3.current], {
      x: 0, y: 0, rotateX: 0, rotateY: 0, rotation: 0, duration: 1, ease: 'power4.out'
    });
  };

  // --- Audio Player Logic ---
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(formatTime(current));
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percent = Math.max(0, Math.min(1, x / bounds.width));
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
  };

  const milestones = [
    { icon: <Award />, label: "Cinematic Cut Awards", value: "03+" },
    { icon: <Film />, label: "Hours Timeline Mastery", value: "10k+" },
    { icon: <Layers3 />, label: "Terabytes Processed", value: "450+" },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative w-full bg-dark overflow-hidden py-24 md:py-32 lg:py-48"
    >
      
      {/* Background Marquee */}
      <div className="absolute top-[30%] left-0 w-full overflow-hidden flex flex-col gap-1 opacity-[0.03] pointer-events-none z-0">
        <div ref={bgMarqueeRef} className="flex whitespace-nowrap gap-10 font-logo text-[12rem] font-black text-white uppercase tracking-tight">
          <span>POST-PRODUCTION EXPERT // UJAN ALI // POST-PRODUCTION EXPERT //</span>
          <span>POST-PRODUCTION EXPERT // UJAN ALI // POST-PRODUCTION EXPERT //</span>
        </div>
      </div>

      {/* Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Post-Production Workspace Canvas */}
        <div className="col-span-1 lg:col-span-5 w-full flex justify-center lg:justify-end">
          <div 
            ref={canvasStageRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={resetCanvasElements}
            className="card-stage relative w-full max-w-[360px] md:max-w-[420px] aspect-[4/5] perspective-[2000px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-full h-full rounded-[2.5rem] glass-panel border border-white/10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-10 group cursor-none">
              <img 
                ref={mainImageRef}
                src={ujanPhoto} 
                alt="Ujan Ali - Post Production" 
                className="w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700 ease-out group-hover:[filter:drop-shadow(2px_0_0_#ff000080)_drop-shadow(-2px_0_0_#0000ff80)]"
              />
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                style={{ background: `radial-gradient(400px circle at 50% 50%, rgba(37, 99, 235, 0.15), transparent 60%)` }}
              />
            </div>

            {/* Floating UIs */}
            <div ref={floatingUI_1} className="hidden lg:block absolute -top-8 -left-12 z-20 glass-panel border border-white/15 p-4 rounded-xl shadow-2xl w-36 pointer-events-none transform translate-z-[50px]">
               <p className="font-body text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">Monitor Sync A1</p>
               <div className="flex items-end gap-[3px] h-4">
                  {[...Array(8)].map((_, i) => <div key={i} className={`w-[2px] rounded-full bg-blue-500 h-${i%3+1}/3`}></div>)}
               </div>
            </div>

            <div ref={floatingUI_2} className="hidden lg:block absolute -bottom-10 -right-16 z-20 glass-panel border border-white/15 p-4 rounded-full shadow-2xl w-28 h-28 pointer-events-none transform translate-z-[-50px]">
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-dark to-purple-400 opacity-60"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                   <p className="font-logo font-black text-white/50 text-xl uppercase tracking-widest rotate-[-10deg]">Scope</p>
               </div>
            </div>

            <div ref={floatingUI_3} className="hidden lg:block absolute bottom-[20%] -left-16 z-20 flex flex-col gap-2 pointer-events-none transform translate-z-[100px]">
               <div className="flex gap-2 items-center">
                 <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold">1</div>
                 <div className="w-3 h-px bg-purple-500 opacity-50"></div>
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm"></div>
               </div>
                <p className="font-body text-[9px] text-purple-400 uppercase tracking-[0.2em] font-bold">Sequence Node</p>
            </div>
            
          </div>
        </div>

        {/* Right Column: Narrative & Stats */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0">
          
          <div className="mb-10 w-fit mx-auto lg:mx-0 border-t border-white/10 pt-4" ref={(el) => (typeRefs.current[0] = el)}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                  <Circle size={10} className="text-red-500 fill-red-500 animate-pulse" />
                  <span className="text-xs font-logo font-bold tracking-[0.2em] text-white uppercase">REC</span>
              </div>
              <span className="text-sm md:text-base font-logo font-medium tracking-[0.1em] text-gray-400 font-mono">
                {timecode}
              </span>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
               <span className="text-xs font-body text-gray-500 font-bold tracking-[0.1em] uppercase">Post Lead Studio One // BAN</span>
            </div>
          </div>

          <h1 className="font-logo text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-10 leading-[0.9]">
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start">
              <div ref={(el) => (typeRefs.current[1] = el)}>Dictating</div>
            </div>
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start relative">
              <div ref={(el) => (typeRefs.current[2] = el)} className="py-1 break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 relative inline-block group">
                Cinematic
                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-[2px] md:h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left blur-[1px]"></span>
              </div>
            </div>
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start">
              <div ref={(el) => (typeRefs.current[3] = el)}>Narratives.</div>
            </div>
          </h1>

          {/* =========================================
              CUSTOM AUDIO TIMELINE HUD
              ========================================= */}
          <div ref={(el) => (typeRefs.current[4] = el)} className="mb-8 w-full max-w-xl mx-auto lg:mx-0">
            <audio 
              ref={audioRef} 
              src={introAudio} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnd}
              className="hidden"
            />
            
            <div className="group relative w-full p-5 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-white/[0.04]">
               {/* Internal Glow */}
               <div className={`absolute inset-0 bg-blue-500/10 opacity-0 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : ''}`}></div>
               
               <div className="relative z-10 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Volume2 size={16} className={`${isPlaying ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`} />
                       <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">AUDIO_TRK_01 // UA_INTRO.WAV</span>
                    </div>
                    <span className="font-mono text-xs text-blue-400 font-bold">{currentTime} <span className="text-gray-600">/ {duration}</span></span>
                 </div>

                 <div className="flex items-center gap-5">
                   {/* Play/Pause Button */}
                   <button 
                     onClick={togglePlay}
                     className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-none"
                   >
                     {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                   </button>

                   {/* Timeline Scrubber */}
                   <div className="relative flex-1 h-10 flex items-center cursor-none group/timeline" onClick={handleSeek}>
                      {/* Fake Audio Waveform Pattern */}
                      <div className="absolute inset-0 flex items-center justify-between gap-[2px] opacity-30 px-1 pointer-events-none">
                         {[...Array(40)].map((_, i) => (
                           <div key={i} className={`w-1 rounded-full bg-gray-400 ${isPlaying ? 'animate-[wave_1s_ease-in-out_infinite]' : ''}`} style={{ height: `${Math.max(10, Math.random() * 100)}%`, animationDelay: `${i * 0.05}s` }}></div>
                         ))}
                      </div>
                      
                      {/* Interactive Progress Bar */}
                      <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                      </div>
                      
                      {/* Scrubber Playhead Indicator */}
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-100 ease-linear" style={{ left: `calc(${progress}% - 6px)` }}></div>
                   </div>
                 </div>
               </div>
            </div>
            {/* Inject Custom Waveform Animation CSS globally just for this block */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes wave {
                0%, 100% { transform: scaleY(0.5); }
                50% { transform: scaleY(1.5); }
              }
            `}} />
          </div>

          <div className="mb-14 max-w-xl mx-auto lg:mx-0 w-full">
            <p 
              ref={(el) => (typeRefs.current[5] = el)}
              className="text-lg md:text-xl font-body text-gray-400 font-light leading-relaxed drop-shadow-md"
            >
              Ujan Ali doesn't just assemble clips; he orchestrates visual momentum. Editing isn't a passive task; it's the final rewrite of the story, dictating the narrative pulse and emotional cadence of every frame. From standard promos to legendary cinematic storytelling, every frame is Deliberate. Every transition intentional.
            </p>
          </div>

          {/* Kinetic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0 w-full">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="group relative p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-blue-400 mb-5 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                  {milestone.icon}
                </div>
                <h4 className="font-logo text-3xl sm:text-4xl font-black text-white mb-2">{milestone.value}</h4>
                <p className="font-body text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">{milestone.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;