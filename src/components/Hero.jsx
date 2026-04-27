import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, ArrowDownRight, Circle, AudioWaveform, MonitorStop } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const typeRefs = useRef([]);
  const visualRef = useRef(null);
  const ctaRef = useRef(null);
  
  // HUD Workflow Simulation Refs
  const audioHudBarRefs = useRef([]);
  const colorHudRefs = useRef([]);
  const recLightRef = useRef(null);

  // Custom Cursor Refs
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  // Timecode state
  const [timecode, setTimecode] = useState('00:00:00:00');

  // Creativity 1: Live Timecode & REC Monitor Generator
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      const frames = Math.floor((diff % 1000) / 33).toString().padStart(2, '0'); // Approx 30fps
      setTimecode(`${hours}:${minutes}:${seconds}:${frames}`);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Setup Initial States for Mask Reveals (Hiding elements)
      // We ensure the wrapper has enough overflow (y: 110%) to prevent mobile font cutoffs.
      gsap.set(typeRefs.current, { y: 110, skewY: 10 });
      gsap.set([visualRef.current, ctaRef.current], { opacity: 0, y: 30, filter: 'blur(10px)' });

      // Entrance Timeline - A Choreographed Unveiling
      tl.to(typeRefs.current, {
        y: 0,
        skewY: 0,
        opacity: 1, // Add slight opacity to the reveal for a cleaner fade
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.1,
      })
      .to(visualRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out',
      }, "-=1.2") // Starts slightly before text finishes
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
      }, "-=1.0");

      // Continuous Workflow Simulation Animations:
      // 1. Audio HUD (Simulated Live Mix)
      audioHudBarRefs.current.forEach((bar) => {
        gsap.to(bar, {
          scaleY: "random(0.3, 1.3)",
          duration: "random(0.2, 0.4)",
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          transformOrigin: 'bottom'
        });
      });
      // 2. Color Grade Monitor (Simulated Vector Scope distortion)
      colorHudRefs.current.forEach((scope) => {
        gsap.to(scope, {
          skewX: "random(-15, 15)",
          skewY: "random(-10, 10)",
          opacity: "random(0.2, 0.6)",
          duration: "random(1, 2)",
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      });
      // 3. REC Light Blinking
      gsap.to(recLightRef.current, { opacity: 0.2, duration: 0.6, yoyo: true, repeat: -1, ease: 'rough' });

      // Fluid Cursor Setup (kept from previous interaction for app-like experience)
      const xSetDot = gsap.quickSetter(cursorDotRef.current, "x", "px");
      const ySetDot = gsap.quickSetter(cursorDotRef.current, "y", "px");
      const xSetOutline = gsap.quickSetter(cursorOutlineRef.current, "x", "px");
      const ySetOutline = gsap.quickSetter(cursorOutlineRef.current, "y", "px");

      window.addEventListener("mousemove", (e) => {
        xSetDot(e.clientX);
        ySetDot(e.clientY);
        gsap.to(cursorOutlineRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax Effect for the Showreel Card
  const handleMouseMove = (e) => {
    if (!visualRef.current) return;
    // Calculate rotation based on center of visual card
    const rect = visualRef.current.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const xPos = (e.clientX - cardCenterX) * 0.05; // 0.05 strength
    const yPos = (e.clientY - cardCenterY) * 0.05;
    
    gsap.to(visualRef.current, { x: xPos, y: yPos, rotationY: xPos * 0.4, rotationX: -yPos * 0.4, duration: 1, ease: 'power3.out' });
  };

  // Cursor Hover States for interactive elements
  const cursorHover = () => gsap.to(cursorOutlineRef.current, { scale: 2.5, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'transparent', duration: 0.3 });
  const cursorLeave = () => gsap.to(cursorOutlineRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 overflow-hidden bg-dark"
    >
      {/* HUD background grid (Simulated Workspace Mesh) */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Ambient Visual Aberration Grid (A very subtle, blurred, color distortion mesh) */}
      <div className="absolute inset-0 z-0 opacity-10 blur-[120px] pointer-events-none scale-110">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-dark to-purple-900 mix-blend-screen animate-pulse duration-[10s]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,#ff000005_1px,transparent_1px)] bg-[size:10px_10px] "></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,#0000ff05_1px,transparent_1px)] bg-[size:10px_10px] transform translate-x-[2px]"></div>
      </div>

      {/* Lighting Orbs */}
      <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[5%] right-[10%] w-[35rem] h-[35rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Custom Fluid Cursor */}
      <div className="hidden md:block pointer-events-none z-[100]">
        <div ref={cursorDotRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
        <div ref={cursorOutlineRef} className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Post-Production HUD & Typography */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
          
          {/* Enhanced Live Workspace HUD - Detailing Ujan's world */}
          <div className="mb-10 w-fit" ref={(el) => (typeRefs.current[0] = el)}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              {/* Core REC Monitor */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <Circle ref={recLightRef} size={10} className="text-red-500 fill-red-500" />
                  <span className="text-xs font-logo font-bold tracking-[0.2em] text-white uppercase">REC</span>
                </div>
                <span className="text-sm font-logo font-medium tracking-[0.1em] text-gray-400 font-mono">
                  {timecode}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              {/* Complex Multi-Track Audio HUD Simulation */}
              <div className="flex items-end gap-1.5 h-6">
                <AudioWaveform size={14} className="text-blue-400" />
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-[3px] bg-blue-500 rounded-full h-full opacity-60">
                    <div ref={(el) => (audioHudBarRefs.current[i] = el)} className="w-full h-full bg-white opacity-40 rounded-full"></div>
                  </div>
                ))}
                 {[...Array(6)].map((_, i) => (
                  <div key={i+6} className="w-[3px] bg-purple-500 rounded-full h-full opacity-60">
                    <div ref={(el) => (audioHudBarRefs.current[i+6] = el)} className="w-full h-full bg-white opacity-40 rounded-full"></div>
                  </div>
                ))}
              </div>
               <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              {/* simulated Vector Scope (Color Grade) */}
              <div className="flex items-center gap-1.5 ">
                 <MonitorStop size={14} className="text-purple-400" />
                 <div className="w-6 h-6 border border-white/20 rounded-full flex items-center justify-center p-0.5">
                     <div ref={(el) => (colorHudRefs.current[0] = el)} className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 via-dark to-purple-400 opacity-60"></div>
                 </div>
              </div>
            </div>
          </div>

          <h1 className="font-logo text-5xl sm:text-6xl md:text-[5rem] lg:text-[6.5rem] font-black leading-[0.95] tracking-tight text-white mb-8 uppercase w-full">
            {/* Creativity 2: Enhanced Editorial Mask Reveal for typography */}
            {/* The wrapper div (`overflow-hidden`) gives room (skew + vertical space) for the font's design */}
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end">
              <div ref={(el) => (typeRefs.current[1] = el)} className="break-words transform-origin-left">Shaping</div>
            </div>
            
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end relative w-fit ">
              <div 
                ref={(el) => (typeRefs.current[2] = el)} 
                className="py-1 break-words text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600 relative inline-block group transform-origin-left"
              >
                Cinematic
                {/* Visual Accent Underline on large text - God tier detailed decoration */}
                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-dark/50 to-purple-600 blur-[2px] opacity-70"></span>
              </div>
            </div>
            
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end">
              <div ref={(el) => (typeRefs.current[3] = el)} className="break-words transform-origin-left">Narratives.</div>
            </div>
          </h1>

          <div className="mb-12 max-w-lg">
            <p 
              ref={(el) => (typeRefs.current[4] = el)}
              className="text-base sm:text-lg font-body text-gray-400 font-light leading-relaxed drop-shadow-lg"
            >
              Ujan Ali brings high-end, dynamic edits to life. From rapid-fire social cuts to legendary storytelling, built on demand. Every frame Deliberate. Every transition cinematic.
            </p>
          </div>

          {/* Clean Editorial CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-start gap-6 sm:gap-8">
            <a 
              href="#contact" 
              onMouseEnter={cursorHover}
              onMouseLeave={cursorLeave}
              className="group relative inline-flex items-center gap-4 px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-md text-white rounded-full font-body font-bold uppercase tracking-[0.1em] overflow-hidden transition-all duration-500 hover:bg-white hover:text-dark hover:-translate-y-1"
            >
              <span className="relative z-10 text-sm">Start a Project</span>
              <ArrowDownRight size={20} className="relative z-10 group-hover:rotate-[-45deg] transition-transform duration-500" />
            </a>
            
            <a 
              href="#work" 
              onMouseEnter={cursorHover}
              onMouseLeave={cursorLeave}
              className="group inline-flex items-center gap-3 text-sm font-body font-bold text-gray-500 uppercase tracking-[0.15em] hover:text-white transition-colors duration-300"
            >
              Explore Work
              <span className="block w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full absolute bottom-0 left-0"></span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Showreel Card (Refined) */}
        <div className="col-span-1 lg:col-span-5 relative flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-[1200px]">
          <div 
            ref={visualRef}
            onMouseEnter={cursorHover}
            onMouseLeave={cursorLeave}
            className="relative w-full max-w-[340px] lg:max-w-[380px] aspect-[4/5] rounded-[2.5rem] bg-white/[0.02] backdrop-blur-2xl overflow-hidden group border border-white/10"
            style={{ boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-dark/90 to-black/90 mix-blend-overlay z-0"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-[1.05] z-10">
              
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 mb-8 group-hover:bg-white/10 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_80px_rgba(59,130,246,0.2)]">
                <Play size={32} className="text-white ml-2" fill="currentColor" />
                
                <svg className="absolute w-[150%] h-[150%] animate-[spin_12s_linear_infinite] opacity-60" viewBox="0 0 100 100">
                  <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  <text>
                    <textPath href="#textPath" startOffset="0%" className="text-[9px] font-body font-bold fill-white uppercase tracking-[0.25em]">
                      Watch Showreel • Watch Showreel • 
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* simulated Equalizer Bars on Card visual - God Tier Visual Context */}
              <div className="flex items-end gap-1.5 mb-4 h-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    ref={(el) => (audioHudBarRefs.current[i+12] = el)} // using unique indices
                    className="w-1 bg-blue-500 rounded-full h-full opacity-80"
                  ></div>
                ))}
              </div>

              <h3 className="font-logo text-2xl font-black text-white tracking-wider text-center">2026 CUTS</h3>
            </div>
          </div>
        </div>

        {/* Global Bottom HUD decoration */}
         <div className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 font-logo text-gray-700 text-xs tracking-widest uppercase font-bold text-center pointer-events-none opacity-50 z-0">
          Ujan Ali // Post Production // Studio One // Bangalore
         </div>
      </div>
    </section>
  );
};

export default Hero;