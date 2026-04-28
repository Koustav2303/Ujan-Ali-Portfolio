import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IndianRupee, Clock, MonitorPlay, Wand2, Image as ImageIcon, PenTool, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const pricingData = [
  {
    id: '01',
    title: 'Lyrical Video Editing',
    price: '150',
    duration: 'Up to 1 Min',
    software: 'After Effects / Premiere',
    desc: 'Kinetic typography and seamless visual sync to the beat.',
    icon: <MonitorPlay size={32} strokeWidth={1.5} />,
    color: 'rgba(59, 130, 246, 0.2)', // Blue
  },
  {
    id: '02',
    title: 'Reel Editing',
    price: '200',
    priceAlt: '₹350 for up to 1 Min',
    duration: 'Up to 45 Sec',
    software: 'Premiere Pro',
    desc: 'High-retention vertical cuts engineered for algorithmic reach.',
    icon: <Clock size={32} strokeWidth={1.5} />,
    color: 'rgba(168, 85, 247, 0.2)', // Purple
  },
  {
    id: '03',
    title: 'Motion Graphics',
    price: '1,000',
    duration: 'Per Video',
    software: 'After Effects',
    desc: 'Advanced 2D/3D tracking, dynamic object animation, and VFX.',
    icon: <Wand2 size={32} strokeWidth={1.5} />,
    color: 'rgba(16, 185, 129, 0.2)', // Emerald
  },
  {
    id: '04',
    title: 'Poster Editing',
    price: '200',
    duration: 'Per Poster',
    software: 'Photoshop',
    desc: 'Cinematic key art, composite design, and color grading.',
    icon: <ImageIcon size={32} strokeWidth={1.5} />,
    color: 'rgba(239, 68, 68, 0.2)', // Red
  },
  {
    id: '05',
    title: 'Branding & Mockup',
    price: '500',
    duration: 'Per Package',
    software: 'Ps / Illustrator',
    desc: 'Complete brand identity mapping and high-fidelity mockups.',
    icon: <PenTool size={32} strokeWidth={1.5} />,
    color: 'rgba(245, 158, 11, 0.2)', // Amber
  },
];

// Interactive Card Component
const PricingCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !spotlightRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${item.color}, transparent 40%)`;
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'transparent';
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="pricing-card group relative flex flex-col justify-between w-full p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-white/20 cursor-none"
      style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
    >
      {/* Dynamic Mouse Spotlight */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 z-0 transition-colors duration-300 pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100"
      />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Icon & ID */}
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-colors duration-500 backdrop-blur-md">
            {item.icon}
          </div>
          <span className="font-logo text-3xl font-black text-transparent bg-clip-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
            {item.id}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-8">
          <h3 className="font-logo text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
            {item.title}
          </h3>
          <p className="font-body text-gray-400 text-sm md:text-base leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Specs: Duration & Software */}
        <div className="flex flex-col gap-3 mb-8 pb-8 border-b border-white/10 mt-auto">
          <div className="flex justify-between items-center">
             <span className="font-body text-xs text-gray-500 uppercase tracking-widest font-bold">Scope</span>
             <span className="font-body text-sm text-gray-300 font-semibold">{item.duration}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="font-body text-xs text-gray-500 uppercase tracking-widest font-bold">Engine</span>
             <span className="font-body text-sm text-gray-300 font-semibold">{item.software}</span>
          </div>
        </div>

        {/* Price Tag & Action */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <p className="font-body text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Investment</p>
            <div className="flex items-start text-white">
              <IndianRupee size={24} className="mt-1 text-blue-500" strokeWidth={2.5} />
              <span className="font-logo text-4xl md:text-5xl font-black tracking-tighter">{item.price}</span>
            </div>
            {item.priceAlt && (
              <span className="font-body text-[10px] text-gray-400 font-semibold tracking-wider mt-1">{item.priceAlt}</span>
            )}
          </div>

          <div className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 overflow-hidden shrink-0">
            <ArrowUpRight className="text-gray-400 group-hover:text-white group-hover:rotate-45 transition-all duration-500" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
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

      // Staggered Cards Reveal
      const cards = gsap.utils.toArray('.pricing-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 80 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="pricing" 
      ref={sectionRef} 
      className="relative w-full bg-dark py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Cinematic Ambient Lighting */}
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div ref={headingRef} className="flex flex-col items-center md:items-start text-center md:text-left mb-16 md:mb-24">
          <p className="font-body text-blue-400 text-sm font-bold tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
            <span className="w-10 h-px bg-blue-400"></span> Rate Card <span className="w-10 h-px bg-blue-400 md:hidden"></span>
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-8">
            <h2 className="font-logo text-5xl sm:text-6xl md:text-[5rem] font-black text-white uppercase tracking-tighter leading-[0.9]">
              Project <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
                Investment.
              </span>
            </h2>
            <p className="font-body text-gray-400 max-w-sm text-sm md:text-base leading-relaxed">
              Transparent pricing for god-tier post-production. Need a custom bulk package or long-term contract? Let's discuss your vision.
            </p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pricingData.map((item, index) => (
            <PricingCard key={item.id} item={item} index={index} />
          ))}
          
          {/* Custom Package CTA Card */}
          <div className="pricing-card group relative flex flex-col justify-center items-center text-center w-full p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] cursor-none">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
             
             <h3 className="font-logo text-3xl font-black text-white mb-4 uppercase tracking-tighter">Custom Vision?</h3>
             <p className="font-body text-gray-400 text-sm mb-8 leading-relaxed max-w-[250px]">
               Got a documentary, short film, or a massive bulk project? Let's map out a custom pipeline.
             </p>
             
             <a href="#contact" className="px-8 py-4 bg-white text-dark rounded-full font-body font-bold uppercase tracking-[0.1em] hover:bg-gray-200 transition-colors duration-300">
                Start a Dialogue
             </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;