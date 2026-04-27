import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Scissors, HardDrive, Aperture, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRefs = useRef([]);
  const statsRef = useRef([]);
  const trackRef = useRef(null);
  
  // Image Reveal Refs
  const imageContainerRef = useRef(null);
  const rawImageRef = useRef(null);
  const gradedImageRef = useRef(null);
  const wipeLineRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Endless Editing Timeline Track
      gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1,
      });

      // 2. Main Section Scroll Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Text Entrance
      tl.fromTo(textRefs.current, 
        { y: 80, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "power3.out", stagger: 0.15 }
      )
      // Stats Pop
      .from(statsRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "back.out(1.5)",
        stagger: 0.1,
      }, "-=0.8");

      // 3. The Color Grade Scrub Effect (Image Wipe)
      // This wipes from the "Raw" B&W image to the "Graded" Color image as you scroll
      gsap.fromTo(gradedImageRef.current,
        { clipPath: 'inset(0 100% 0 0)' }, // Starts fully hidden (clipped to the left)
        {
          clipPath: 'inset(0 0% 0 0)',   // Ends fully visible
          ease: "none",
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: "top 75%",
            end: "center center",
            scrub: 1, // Smoothly ties the wipe to the scrollbar
          }
        }
      );

      // The glowing wipe line that follows the clip-path
      gsap.fromTo(wipeLineRef.current,
        { left: '0%' },
        {
          left: '100%',
          ease: "none",
          scrollTrigger: {
            trigger: imageContainerRef.current,
            start: "top 75%",
            end: "center center",
            scrub: 1,
          }
        }
      );

      // Image Parallax Zoom
      gsap.to([rawImageRef.current, gradedImageRef.current], {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <Film size={24} />, label: "Projects Mastered", value: "150+" },
    { icon: <Scissors size={24} />, label: "Timeline Hours", value: "10k+" },
    { icon: <HardDrive size={24} />, label: "Terabytes Cut", value: "450+" },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative w-full bg-dark overflow-hidden py-24 lg:py-40">
      
      {/* Cinematic Lighting Background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      {/* Editing Timeline Background Element */}
      <div className="absolute top-20 left-0 w-full overflow-hidden flex flex-col gap-1 opacity-[0.03] pointer-events-none z-0">
        <div className="flex items-end gap-1 h-8 px-4 w-[200vw]">
           {[...Array(50)].map((_, i) => (
             <div key={i} className={`bg-white ${i % 5 === 0 ? 'h-full w-1' : 'h-1/2 w-px'} shrink-0 mx-2`}></div>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Interactive Viewfinder & Image */}
        <div className="col-span-1 lg:col-span-5 order-2 lg:order-1">
          <div className="relative">
            {/* Viewfinder HUD Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-blue-500/50 z-20 pointer-events-none"></div>
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-blue-500/50 z-20 pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-blue-500/50 z-20 pointer-events-none"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-blue-500/50 z-20 pointer-events-none"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-30 text-white">
              <Plus size={40} strokeWidth={1} />
            </div>

            {/* REC Indicator */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 bg-dark/60 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-logo text-[10px] text-white tracking-widest uppercase font-bold">RAW / LOG</span>
            </div>

            {/* Image Container with Scrub Reveal */}
            <div 
              ref={imageContainerRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-dark shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {/* Image 1: The RAW/Flat Look (Grayscale and low contrast via CSS) */}
              <div 
                ref={rawImageRef}
                className="absolute inset-0 bg-cover bg-center grayscale contrast-75 brightness-75"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574958113459-009c91b1062b?q=80&w=1000&auto=format&fit=crop')" }}
              ></div>

              {/* Image 2: The Final Graded Look (Vibrant) */}
              <div 
                ref={gradedImageRef}
                className="absolute inset-0 bg-cover bg-center brightness-110 contrast-125 saturate-150"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1574958113459-009c91b1062b?q=80&w=1000&auto=format&fit=crop')",
                  clipPath: 'inset(0 100% 0 0)' // Initial state, hidden to the left
                }}
              ></div>

              {/* The Wipe Line (Simulating a comparison slider) */}
              <div 
                ref={wipeLineRef}
                className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
                style={{ left: '0%' }}
              ></div>

              {/* Noise Overlay for cinematic texture */}
              <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
            </div>

            <div className="absolute -bottom-8 left-0 right-0 flex justify-between items-center text-gray-500 font-logo text-[10px] tracking-[0.2em] uppercase font-bold px-2">
               <span>ISO 800</span>
               <span>5600K</span>
               <span>f/1.8</span>
               <span>24 FPS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Text & Rendering Stats */}
        <div className="col-span-1 lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
          
          <div className="overflow-hidden mb-6">
             <div ref={(el) => (textRefs.current[0] = el)} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                <Aperture size={16} className="text-blue-400 animate-[spin_10s_linear_infinite]" />
                <span className="text-xs font-logo font-bold tracking-[0.2em] text-blue-400 uppercase">
                  The Architect
                </span>
             </div>
          </div>

          <h2 className="font-logo text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
            <div className="overflow-hidden py-1"><div ref={(el) => (textRefs.current[1] = el)}>Dictating</div></div>
            <div className="overflow-hidden py-1">
              <div ref={(el) => (textRefs.current[2] = el)} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500">
                Visual Rhythm.
              </div>
            </div>
          </h2>

          <div className="space-y-6 mb-12 max-w-2xl">
            <p ref={(el) => (textRefs.current[3] = el)} className="text-lg md:text-xl font-body text-gray-300 font-light leading-relaxed">
              Editing isn't just cutting footage—it's engineering emotion. I don't just assemble clips; I meticulously construct pacing, atmosphere, and momentum to ensure every frame hits with absolute precision.
            </p>
            <p ref={(el) => (textRefs.current[4] = el)} className="text-base md:text-lg font-body text-gray-500 font-light leading-relaxed">
              Whether it's the chaotic energy of a hype reel, the cinematic depth of a brand narrative, or the flawless sync of a music video, I bring a god-tier obsession to color spaces, sound design, and narrative flow. 
            </p>
          </div>

          {/* Rendering Metrics (Stats) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="relative p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl group hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="text-blue-400 mb-5 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <h4 className="font-logo text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</h4>
                <p className="font-body text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;