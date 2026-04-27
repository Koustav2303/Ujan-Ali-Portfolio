import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, ArrowDownRight, Circle } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const visualRef = useRef(null);
  const ctaRef = useRef(null);
  const eqRefs = useRef([]);
  
  // Custom Cursor & Interaction Refs
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const hoverMediaRef = useRef(null);

  // Timecode state
  const [timecode, setTimecode] = useState('00:00:00:00');

  // Live Timecode Generator
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

      // Initial States
      gsap.set(textRefs.current, { y: 40, opacity: 0, filter: 'blur(10px)' });
      gsap.set([visualRef.current, ctaRef.current], { opacity: 0, y: 30, filter: 'blur(10px)' });
      gsap.set(hoverMediaRef.current, { scale: 0, opacity: 0, rotation: -10 });

      // Entrance Timeline
      tl.to(textRefs.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.15,
      })
      .to(visualRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out',
      }, "-=1.2")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
      }, "-=1.0");

      // Equalizer Animation
      eqRefs.current.forEach((bar) => {
        gsap.to(bar, {
          scaleY: "random(0.2, 1.2)",
          duration: "random(0.3, 0.6)",
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: 'bottom'
        });
      });

      // Fluid Cursor & Hover Image Setup
      const xSetDot = gsap.quickSetter(cursorDotRef.current, "x", "px");
      const ySetDot = gsap.quickSetter(cursorDotRef.current, "y", "px");
      const xSetOutline = gsap.quickSetter(cursorOutlineRef.current, "x", "px");
      const ySetOutline = gsap.quickSetter(cursorOutlineRef.current, "y", "px");
      
      const xSetMedia = gsap.quickTo(hoverMediaRef.current, "x", { duration: 0.5, ease: "power3.out" });
      const ySetMedia = gsap.quickTo(hoverMediaRef.current, "y", { duration: 0.5, ease: "power3.out" });

      window.addEventListener("mousemove", (e) => {
        xSetDot(e.clientX);
        ySetDot(e.clientY);
        gsap.to(cursorOutlineRef.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
        
        // Track floating media slightly offset from cursor
        xSetMedia(e.clientX + 20);
        ySetMedia(e.clientY + 20);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Show/Hide Floating Media on keyword hover
  const handleKeywordEnter = () => {
    gsap.to(hoverMediaRef.current, { scale: 1, opacity: 1, rotation: 5, duration: 0.5, ease: 'back.out(1.5)' });
    gsap.to(cursorOutlineRef.current, { scale: 0, opacity: 0, duration: 0.2 });
  };
  
  const handleKeywordLeave = () => {
    gsap.to(hoverMediaRef.current, { scale: 0.5, opacity: 0, rotation: -10, duration: 0.4, ease: 'power3.in' });
    gsap.to(cursorOutlineRef.current, { scale: 1, opacity: 1, duration: 0.2 });
  };

  // Parallax Effect for the Showreel Card
  const handleMouseMove = (e) => {
    if (!visualRef.current) return;
    const xPos = (e.clientX / window.innerWidth - 0.5) * 30; 
    const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
    gsap.to(visualRef.current, { x: xPos, y: yPos, rotationY: xPos * 0.5, rotationX: -yPos * 0.5, duration: 1, ease: 'power3.out' });
  };

  // Standard Cursor States
  const cursorHover = () => gsap.to(cursorOutlineRef.current, { scale: 2.5, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'transparent', duration: 0.3 });
  const cursorLeave = () => gsap.to(cursorOutlineRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.5)', duration: 0.3 });

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center pt-24 overflow-hidden bg-dark"
    >
      {/* Editor Workspace HUD Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Ambient Lighting */}
      <div className="absolute top-[10%] left-[20%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Floating Image Reveal (Triggered by hovering "Cinematic") */}
      <div 
        ref={hoverMediaRef} 
        className="fixed top-0 left-0 w-64 md:w-80 aspect-video rounded-2xl border border-white/20 shadow-2xl overflow-hidden pointer-events-none z-[110] transform-origin-center"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-80 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 bg-dark/40 backdrop-blur-md"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Play fill="white" size={32} className="opacity-80" />
        </div>
      </div>

      {/* Custom Fluid Cursor */}
      <div className="hidden md:block pointer-events-none z-[100]">
        <div ref={cursorDotRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
        <div ref={cursorOutlineRef} className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Refined Typography & HUD */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
          
          {/* Live Editor HUD */}
          <div className="mb-8" ref={(el) => (textRefs.current[0] = el)}>
            <div className="inline-flex items-center gap-6 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Circle size={10} className="text-red-500 fill-red-500 animate-pulse" />
                <span className="text-xs font-logo font-bold tracking-widest text-white uppercase">REC</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-sm font-logo font-medium tracking-[0.1em] text-gray-400 font-mono">
                {timecode}
              </span>
            </div>
          </div>

          <h1 className="font-logo text-5xl sm:text-6xl md:text-[5rem] lg:text-[6.5rem] font-black leading-[0.95] tracking-tight text-white mb-8 uppercase w-full">
            <div ref={(el) => (textRefs.current[1] = el)} className="break-words">Shaping</div>
            
            {/* Interactive Keyword */}
            <div 
              ref={(el) => (textRefs.current[2] = el)} 
              onMouseEnter={handleKeywordEnter}
              onMouseLeave={handleKeywordLeave}
              className="py-1 break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 cursor-none relative inline-block group"
            >
              Cinematic
              <span className="absolute bottom-2 md:bottom-4 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </div>
            <br />
            
            <div ref={(el) => (textRefs.current[3] = el)} className="break-words">Narratives.</div>
          </h1>

          <div className="mb-12 max-w-lg">
            <p 
              ref={(el) => (textRefs.current[4] = el)}
              className="text-base sm:text-lg font-body text-gray-400 font-light leading-relaxed"
            >
              Ujan Ali brings high-end, dynamic edits to life. From rapid-fire social cuts to legendary storytelling, built on demand.
            </p>
          </div>

          {/* Clean CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-start gap-6 sm:gap-8">
            <a 
              href="#contact" 
              onMouseEnter={cursorHover}
              onMouseLeave={cursorLeave}
              className="group relative inline-flex items-center gap-4 px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white rounded-full font-body font-bold uppercase tracking-[0.1em] overflow-hidden transition-all duration-500 hover:bg-white hover:text-dark"
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

        {/* Right Column: Refined Interactive Showreel */}
        <div className="col-span-1 lg:col-span-5 relative flex justify-center mt-12 lg:mt-0 perspective-[1200px]">
          <div 
            ref={visualRef}
            onMouseEnter={cursorHover}
            onMouseLeave={cursorLeave}
            className="relative w-full max-w-[340px] lg:max-w-[380px] aspect-[4/5] rounded-[2.5rem] bg-white/[0.02] backdrop-blur-2xl overflow-hidden group border border-white/10"
            style={{ boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-dark/90 to-black/90 mix-blend-overlay z-0"></div>
            
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[50px]"></div>
            
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

              {/* Animated Audio Equalizer */}
              <div className="flex items-end gap-1.5 mb-4 h-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    ref={(el) => (eqRefs.current[i] = el)}
                    className="w-1 bg-blue-500 rounded-full h-full opacity-80"
                  ></div>
                ))}
              </div>

              <h3 className="font-logo text-2xl font-black text-white tracking-wider text-center">2026 CUTS</h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;