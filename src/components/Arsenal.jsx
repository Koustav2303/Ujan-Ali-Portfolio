import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Authentic Brand Colors & Styling for the "Periodic Table" Look
const softwareData = [
  { 
    id: 'Pr', 
    name: 'Premiere Pro', 
    type: 'Non-Linear Editing', 
    color: '#9999FF', 
    bgHover: 'group-hover:bg-[#9999FF]/10',
    borderHover: 'group-hover:border-[#9999FF]',
    glow: 'rgba(153, 153, 255, 0.4)', 
    desc: 'The core timeline. Where narrative structure is forged, multiple angles are synced, and pacing is perfected.' 
  },
  { 
    id: 'Ae', 
    name: 'After Effects', 
    type: 'Motion & VFX', 
    color: '#9999FF', 
    bgHover: 'group-hover:bg-[#9999FF]/10',
    borderHover: 'group-hover:border-[#9999FF]',
    glow: 'rgba(153, 153, 255, 0.4)', 
    desc: 'Advanced compositing, kinetic typography, node-based tracking, and seamless visual effects generation.' 
  },
  { 
    id: 'Au', 
    name: 'Audition', 
    type: 'Sound Design', 
    color: '#00E4B3', 
    bgHover: 'group-hover:bg-[#00E4B3]/10',
    borderHover: 'group-hover:border-[#00E4B3]',
    glow: 'rgba(0, 228, 179, 0.4)', 
    desc: 'Deep audio mixing, background noise isolation, frequency EQ, and cinematic soundscaping.' 
  },
  { 
    id: 'Ps', 
    name: 'Photoshop', 
    type: 'Asset Creation', 
    color: '#31A8FF', 
    bgHover: 'group-hover:bg-[#31A8FF]/10',
    borderHover: 'group-hover:border-[#31A8FF]',
    glow: 'rgba(49, 168, 255, 0.4)', 
    desc: 'Cinematic key art, custom layer masking, heavy retouching, and high-CTR thumbnail engineering.' 
  },
  { 
    id: 'Ai', 
    name: 'Illustrator', 
    type: 'Vector Architecture', 
    color: '#FF9A00', 
    bgHover: 'group-hover:bg-[#FF9A00]/10',
    borderHover: 'group-hover:border-[#FF9A00]',
    glow: 'rgba(255, 154, 0, 0.4)', 
    desc: 'Precision vector graphics, custom logo animation prep, and infinite-scale brand mapping.' 
  },
  { 
    id: 'Lr', 
    name: 'Lightroom', 
    type: 'Color Science', 
    color: '#31A8FF', 
    bgHover: 'group-hover:bg-[#31A8FF]/10',
    borderHover: 'group-hover:border-[#31A8FF]',
    glow: 'rgba(49, 168, 255, 0.4)', 
    desc: 'High-volume RAW processing, batch color correction, and preliminary cinematic LUT generation.' 
  },
  { 
    id: 'Id', 
    name: 'InDesign', 
    type: 'Layout & Pitch', 
    color: '#FF3366', 
    bgHover: 'group-hover:bg-[#FF3366]/10',
    borderHover: 'group-hover:border-[#FF3366]',
    glow: 'rgba(255, 51, 102, 0.4)', 
    desc: 'Professional pitch decks, director treatment creation, and grid-locked layout architecture.' 
  },
  { 
    id: 'Bl', 
    name: 'Blender', 
    type: '3D CGI Pipeline', 
    color: '#F5792A', 
    bgHover: 'group-hover:bg-[#F5792A]/10',
    borderHover: 'group-hover:border-[#F5792A]',
    glow: 'rgba(245, 121, 42, 0.4)', 
    desc: '3D environment generation, product rendering, camera tracking, and procedural modeling.' 
  }
];

const ArsenalCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  // Magnetic Pull Effect on the specific Adobe-style Icon
  const handleMouseMove = (e) => {
    if (!iconRef.current || !cardRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    
    gsap.to(iconRef.current, { x, y, duration: 0.3, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`software-card group relative flex flex-col p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-none ${item.bgHover} ${item.borderHover}`}
      style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
    >
      {/* Background Ambient Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at center, ${item.glow}, transparent 70%)` }}
      />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Top: The "Periodic Table" Icon & Type */}
        <div className="flex justify-between items-start mb-10">
          <div 
            ref={iconRef}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-[3px] flex items-center justify-center bg-dark transition-colors duration-500 shadow-xl"
            style={{ borderColor: item.color }}
          >
            <span 
              className="font-logo text-3xl md:text-4xl font-black"
              style={{ color: item.color }}
            >
              {item.id}
            </span>
          </div>
          
          <div className="px-3 py-1 rounded-full border border-white/10 bg-dark/50 backdrop-blur-md">
             <span className="font-body text-[10px] text-gray-400 font-bold tracking-widest uppercase">{item.type}</span>
          </div>
        </div>

        {/* Bottom: Title & Description */}
        <div className="mt-auto">
          <h3 className="font-logo text-2xl md:text-3xl font-black text-white mb-3 tracking-tight group-hover:tracking-normal transition-all duration-500">
            {item.name}
          </h3>
          <p className="font-body text-gray-500 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

const Arsenal = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bgTextRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Massive Background Text Scroll Effect
      gsap.to(bgTextRef.current, {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // Heading Reveal
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: "power3.out",
        }
      );

      // Staggered Bento Grid Reveal
      const cards = gsap.utils.toArray('.software-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="arsenal" 
      ref={sectionRef} 
      className="relative w-full bg-dark py-24 md:py-32 lg:py-48 overflow-hidden"
    >
      {/* Background Cinematic Text */}
      <div className="absolute top-1/4 left-0 w-full overflow-hidden flex whitespace-nowrap opacity-[0.02] pointer-events-none z-0">
        <h2 ref={bgTextRef} className="font-logo text-[15rem] font-black text-white tracking-tighter uppercase leading-none">
          SYSTEM ARCHITECTURE • ENGINE ROOM • SYSTEM ARCHITECTURE
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div ref={headingRef} className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <p className="font-body text-blue-400 text-sm font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
            <span className="w-12 h-px bg-blue-400"></span> Tech Stack <span className="w-12 h-px bg-blue-400"></span>
          </p>
          <h2 className="font-logo text-5xl sm:text-6xl md:text-[6rem] font-black text-white uppercase tracking-tighter leading-[0.9]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">Arsenal.</span>
          </h2>
          <p className="font-body text-gray-400 mt-8 max-w-2xl text-sm md:text-base leading-relaxed">
            God-tier edits require a god-tier ecosystem. A seamless integration of industry-standard engines utilized to manipulate pixels, frequencies, and vectors with absolute precision.
          </p>
        </div>

        {/* 4x2 Desktop Bento Grid, 2x4 Tablet, 1x8 Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {softwareData.map((item, index) => (
            <ArsenalCard key={item.id} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Arsenal;