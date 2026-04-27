import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clapperboard, AudioWaveform, MonitorPlay, Palette, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: '01',
    title: 'Commercial Cuts',
    description: 'High-octane brand narratives that demand attention and drive conversion. We build pacing that keeps eyes locked on the screen from the first frame.',
    icon: <Clapperboard size={40} strokeWidth={1} />,
    tags: ['Brand Films', 'Promo', 'Ads'],
    color: 'rgba(59, 130, 246, 0.2)', // Blue
    bgGradient: 'from-[#050505] to-[#0a1930]'
  },
  {
    id: '02',
    title: 'Music Videos',
    description: 'Rhythm-driven visual trips synced perfectly to the beat and artist aesthetic. Every transition matches the frequency of the track.',
    icon: <AudioWaveform size={40} strokeWidth={1} />,
    tags: ['VFX', 'Rhythm', 'Sync'],
    color: 'rgba(168, 85, 247, 0.2)', // Purple
    bgGradient: 'from-[#050505] to-[#1a0b2e]'
  },
  {
    id: '03',
    title: 'Social Retention',
    description: 'Short-form, hyper-engaging content engineered for the algorithmic feed. Hook-heavy edits designed for maximum replay value.',
    icon: <MonitorPlay size={40} strokeWidth={1} />,
    tags: ['Reels', 'TikTok', 'Shorts'],
    color: 'rgba(16, 185, 129, 0.2)', // Emerald
    bgGradient: 'from-[#050505] to-[#062117]'
  },
  {
    id: '04',
    title: 'Color Grading',
    description: 'Cinematic color spaces that dictate the emotional tone of every frame. Turning raw, flat footage into legendary visual poetry.',
    icon: <Palette size={40} strokeWidth={1} />,
    tags: ['DaVinci', 'Look', 'Mood'],
    color: 'rgba(239, 68, 68, 0.2)', // Red
    bgGradient: 'from-[#050505] to-[#2a0808]'
  }
];

const ServiceCard = ({ service, index, totalCards }) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const spotlightRef = useRef(null);

  // 3D Tilt & Spotlight Logic
  const handleMouseMove = (e) => {
    if (!innerRef.current || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spotlight tracking
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, ${service.color}, transparent 40%)`;
    }

    // Calculate 3D rotation based on mouse position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(innerRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1500,
    });
  };

  const handleMouseLeave = () => {
    // Reset 3D tilt
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power3.out",
    });
    // Fade out spotlight
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'transparent';
    }
  };

  return (
    <div 
      ref={cardRef}
      className="card-container sticky flex items-center justify-center w-full"
      style={{
        // Stacking calculation: each card stops slightly lower than the previous one
        top: `calc(15vh + ${index * 30}px)`, 
        zIndex: index,
        marginBottom: index === totalCards - 1 ? '0' : '40vh', // Spacing for scrolling
      }}
    >
      <div 
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`card-inner relative w-full p-8 md:p-14 lg:p-20 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br ${service.bgGradient} border border-white/10 overflow-hidden cursor-none`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 -10px 30px rgba(0,0,0,0.3)',
          transformStyle: 'preserve-3d', // Crucial for 3D children
        }}
      >
        {/* Dynamic Spotlight */}
        <div 
          ref={spotlightRef}
          className="absolute inset-0 z-0 transition-colors duration-300 pointer-events-none mix-blend-screen"
        />

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12 lg:gap-20" style={{ transform: 'translateZ(50px)' }}>
          
          {/* Left Column: Number & Icon */}
          <div className="flex flex-col justify-between lg:w-1/3">
            <div className="text-gray-400 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-md">
              {service.icon}
            </div>
            
            <div className="mt-12 lg:mt-32">
              <div 
                className="text-[6rem] lg:text-[10rem] font-logo font-black leading-none text-transparent"
                style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}
              >
                {service.id}
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="font-logo text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight uppercase leading-[0.9]">
                {service.title}
              </h3>
              <p className="font-body text-gray-400 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl font-light">
                {service.description}
              </p>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-5 py-2 text-sm font-body font-bold text-gray-300 uppercase tracking-widest border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Huge Action Button */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center group hover:scale-110 transition-transform duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <ArrowUpRight className="text-dark group-hover:rotate-45 transition-transform duration-500" size={32} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Massive Title Reveal
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 100, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
        }
      );

      // Card Stacking Depth Effect (Scale down and darken previous cards)
      const cards = gsap.utils.toArray('.card-inner');
      
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Don't animate the very last card
        
        ScrollTrigger.create({
          trigger: card,
          start: `top 15%`, // Triggers when the card hits its sticky position
          endTrigger: ".card-container:last-child", // Ends when the last card arrives
          end: "top 15%",
          scrub: true,
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.3, // Pushes it visually into the background
            filter: 'blur(4px)', // Cinematic depth of field
            transformOrigin: "top center",
            ease: "none",
          })
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="relative w-full bg-dark pb-32 overflow-visible"
    >
      {/* Intro Header */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40">
        <div ref={titleRef} className="flex flex-col items-center text-center">
          <p className="font-body text-blue-400 text-sm md:text-base font-bold tracking-[0.4em] uppercase mb-6 flex items-center gap-4">
            <span className="w-16 h-[1px] bg-blue-400"></span> 
            The Arsenal 
            <span className="w-16 h-[1px] bg-blue-400"></span>
          </p>
          <h2 className="font-logo text-6xl sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
            Post <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-300 to-gray-700">
              Production.
            </span>
          </h2>
        </div>
      </div>

      {/* Stacking Cards Container */}
      <div 
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 relative"
      >
        {servicesData.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            index={index} 
            totalCards={servicesData.length} 
          />
        ))}
      </div>
      
    </section>
  );
};

export default Services;