import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Award, Aperture, Layers3, AudioWaveform, Circle, Play } from 'lucide-react';

// Import the specific asset
import ujanPhoto from '../assets/editor/ujan.png';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const typeRefs = useRef([]);
  const statsRef = useRef([]);
  const bgMarqueeRef = useRef(null);
  
  // Interaction Refs
  const canvasStageRef = useRef(null); // The overall 3D perspective stage
  const mainImageRef = useRef(null);  // The full image element
  const floatingUI_1 = useRef(null);   // Floating UI Mockup 1
  const floatingUI_2 = useRef(null);   // Floating UI Mockup 2
  const floatingUI_3 = useRef(null);   // Floating UI Mockup 3
  const audioHudBarRefs = useRef([]); // Audio meter mockups

  // Timecode state
  const [timecode, setTimecode] = useState('00:00:00:00');

  // Creativity 1: Live Timecode Generator
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
      
      // 1. Entrance Animations: Choreographed staggering blur/skew reveals
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

      // Entrance of the visual canvas
      gsap.from(canvasStageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        x: -100,
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power4.out",
      });

      // Continuous Background Marquee Decoration
      gsap.to(bgMarqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
      });

      // Animated Waveform mockups
      audioHudBarRefs.current.forEach((bar) => {
        gsap.to(bar, {
          scaleY: "random(0.3, 1.4)",
          duration: "random(0.2, 0.5)",
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          transformOrigin: 'bottom'
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Creativity 2: God Tier Mouse Parallax & 3D Tilt for Post-Production Workspace Canvas
  const handleCanvasMouseMove = (e) => {
    if (!canvasStageRef.current) return;
    
    // Check if desktop view (can use matchMedia or reliable resize listener in production)
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    const rect = canvasStageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Parallax strength calculations (tweak multipliers for desired "pull")
    const xPos = (e.clientX - centerX) * 0.05;
    const yPos = (e.clientY - centerY) * 0.05;

    // Apply smooth 3D tilt to the overall visual stage container
    gsap.to(canvasStageRef.current, {
      rotateY: xPos * 0.1, // Subtle tilt
      rotateX: -yPos * 0.1,
      transformPerspective: 2000,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate the main image itself (slightly different depth)
    gsap.to(mainImageRef.current, {
      x: xPos * 0.2,
      y: yPos * 0.2,
      duration: 1,
      ease: 'power2.out'
    });

    // Animate the floating technical UI mockups with aggressive depth
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
      
      {/* Background HUD Text Decoration (Kinetic Typography) */}
      <div className="absolute top-[30%] left-0 w-full overflow-hidden flex flex-col gap-1 opacity-[0.03] pointer-events-none z-0">
        <div ref={bgMarqueeRef} className="flex whitespace-nowrap gap-10 font-logo text-[12rem] font-black text-white uppercase tracking-tight">
          <span>POST-PRODUCTION EXPERT // UJAN ALI // POST-PRODUCTION EXPERT //</span>
          <span>POST-PRODUCTION EXPERT // UJAN ALI // POST-PRODUCTION EXPERT //</span>
        </div>
      </div>

      {/* Cinematic Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Post-Production Workspace Canvas (Mobile stack, Desktop Stage) */}
        <div className="col-span-1 lg:col-span-5 w-full flex justify-center lg:justify-end">
          
          <div 
            ref={canvasStageRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={resetCanvasElements}
            className="card-stage relative w-full max-w-[360px] md:max-w-[420px] aspect-[4/5] perspective-[2000px]"
            style={{ transformStyle: 'preserve-3d' }} // Crucial for 3D depth of children
          >
            {/* 1. Main Full Image Container ([REquirement Met: Full Image Seen]) */}
            {/* The photo uses object-contain within this glassmorphic border frame */}
            <div className="relative w-full h-full rounded-[2.5rem] glass-panel border border-white/10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-10 group cursor-none">
              <img 
                ref={mainImageRef}
                src={ujanPhoto} 
                alt="Ujan Ali - Post Production" 
                // Creativity 3: Added subtle animated chromatic aberration glow on hover
                className="w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700 ease-out group-hover:[filter:drop-shadow(2px_0_0_#ff000080)_drop-shadow(-2px_0_0_#0000ff80)]"
              />
              {/* Noise overlay for texture */}
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
               {/* Visual Accent Inner Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
                style={{ background: `radial-gradient(400px circle at 50% 50%, rgba(37, 99, 235, 0.15), transparent 60%)` }}
              />
            </div>

            {/* Creativity 4: Floating Post-Production UI Mockups (Desktop Only Interaction) */}
            {/* These float in front/around the image in 3D perspective */}
            
            {/* Floating UI 1: Audio Ticker Box */}
            <div ref={floatingUI_1} className="hidden lg:block absolute -top-8 -left-12 z-20 glass-panel border border-white/15 p-4 rounded-xl shadow-2xl w-36 pointer-events-none transform translate-z-[50px]">
               <p className="font-body text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">Monitor Sync A1</p>
               <div className="flex items-end gap-[3px] h-4">
                  {[...Array(8)].map((_, i) => <div key={i} className={`w-[2px] rounded-full bg-blue-500 h-${i%3+1}/3`}></div>)}
               </div>
            </div>

            {/* Floating UI 2: Vector Scope (Color Wheel Mockup) */}
            <div ref={floatingUI_2} className="hidden lg:block absolute -bottom-10 -right-16 z-20 glass-panel border border-white/15 p-4 rounded-full shadow-2xl w-28 h-28 pointer-events-none transform translate-z-[-50px]">
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-dark to-purple-400 opacity-60"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                   <p className="font-logo font-black text-white/50 text-xl uppercase tracking-widest rotate-[-10deg]">Scope</p>
               </div>
            </div>

            {/* Floating UI 3: Timeline Keyframe Node */}
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

        {/* Right Column: Narrative & Kinetic Stats (Stacks beneath visual on mobile) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0">
          
          {/* Post-Production Status HUD */}
          <div className="mb-10 w-fit mx-auto lg:mx-0 border-t border-white/10 pt-4" ref={(el) => (typeRefs.current[0] = el)}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              {/* REC Monitor */}
              <div className="flex items-center gap-2.5">
                  <Circle size={10} className="text-red-500 fill-red-500 animate-pulse" />
                  <span className="text-xs font-logo font-bold tracking-[0.2em] text-white uppercase">REC</span>
              </div>
               {/* Running Timecode */}
              <span className="text-sm md:text-base font-logo font-medium tracking-[0.1em] text-gray-400 font-mono">
                {timecode}
              </span>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              {/* Target Specs */}
               <span className="text-xs font-body text-gray-500 font-bold tracking-[0.1em] uppercase">Post Lead Studio One // BAN</span>
            </div>
          </div>

          <h1 className="font-logo text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-10 leading-[0.9]">
            {/* Detailed Mask reveal with skew triggers on entrance */}
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start">
              <div ref={(el) => (typeRefs.current[1] = el)}>Dictating</div>
            </div>
            
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start relative">
              <div 
                ref={(el) => (typeRefs.current[2] = el)} 
                className="py-1 break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 relative inline-block group"
              >
                Cinematic
                {/* Glowing detail indicator under "Cinematic" - reinforces the "editor" vibe */}
                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-[2px] md:h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left blur-[1px]"></span>
              </div>
            </div>
            
            <div className="overflow-hidden py-1 h-[1.1em] flex items-end justify-center lg:justify-start">
              <div ref={(el) => (typeRefs.current[3] = el)}>Narratives.</div>
            </div>
          </h1>

          <div className="mb-14 max-w-xl mx-auto lg:mx-0 w-full">
            <p 
              ref={(el) => (typeRefs.current[4] = el)}
              className="text-lg md:text-xl font-body text-gray-400 font-light leading-relaxed drop-shadow-md"
            >
              Ujan Ali doesn't just assemble clips; he orchestrates visual momentum. Editing isn't a passive task; it's the final rewrite of the story, dictating the narrative pulse and emotional cadence of every frame. From standard promos to legendary cinematic storytelling, every frame is Deliberate. Every transition intentional.
            </p>
          </div>

          {/* Kinetic Stats Grid (Designed as sleek Post-Production Milestones) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0 w-full">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="group relative p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Hover Glow Accent */}
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