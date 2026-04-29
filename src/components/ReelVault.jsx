import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX, Crosshair, Activity, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Mock Data
const reelData = [
  {
    id: '01',
    title: 'Neon Drift',
    client: 'Apex Automotive',
    retention: '94.2%',
    views: '1.2M',
    poster: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    color: '#3B82F6', // Blue
  },
  {
    id: '02',
    title: 'Urban Kinetic',
    client: 'Streetwear Co.',
    retention: '89.7%',
    views: '850K',
    poster: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?q=80&w=600&auto=format&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    color: '#A855F7', // Purple
  },
  {
    id: '03',
    title: 'Rhythm Sync',
    client: 'DJ Nova',
    retention: '96.1%',
    views: '2.4M',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    color: '#10B981', // Emerald
  },
  {
    id: '04',
    title: 'Cyberpunk Aesthetic',
    client: 'Tech Reviewer',
    retention: '91.4%',
    views: '920K',
    poster: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=600&auto=format&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    color: '#EF4444', // Red
  },
  {
    id: '05',
    title: 'Fitness Hype',
    client: 'Ironclad Gym',
    retention: '93.8%',
    views: '1.8M',
    poster: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    color: '#F59E0B', // Amber
  }
];

// Interactive Holographic Reel Card
const ReelCard = ({ data, index }) => {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // 3D Magnetic Mouse Tracking for Desktop
  const handleMouseMove = (e) => {
    if (!cardRef.current || !glareRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Move the glare effect
    gsap.to(glareRef.current, {
      x: (x / rect.width) * 100 - 50 + '%',
      y: (y / rect.height) * 100 - 50 + '%',
      opacity: 0.4,
      duration: 0.5
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glareRef.current) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    gsap.to(glareRef.current, { opacity: 0, duration: 1 });
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        document.querySelectorAll('video').forEach(vid => {
          if (vid !== videoRef.current) vid.pause();
        });
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  // Stagger the vertical position of cards for a dynamic "Vault" layout
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`relative shrink-0 w-[280px] sm:w-[320px] md:w-[360px] transition-transform duration-1000 ${isEven ? 'lg:translate-y-8' : 'lg:-translate-y-8'}`}
      style={{ perspective: '2000px' }}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[9/16] rounded-[3rem] bg-dark overflow-hidden group cursor-none"
        style={{ 
          // Thick inner bezel simulating a phone device
          boxShadow: `inset 0 0 0 8px #0a0a0a, inset 0 0 0 9px rgba(255,255,255,0.1), 0 30px 60px -15px rgba(0,0,0,0.8)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Dynamic Neon Background Glow */}
        <div 
          className="absolute inset-[-10%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
          style={{ background: `radial-gradient(circle at 50% 50%, ${data.color}40, transparent 60%)`, filter: 'blur(30px)' }}
        />

        {/* Video Element */}
        <video
          ref={videoRef}
          src={data.video}
          poster={data.poster}
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-[1.02] filter-none' : 'scale-[1.05] grayscale-[40%] brightness-[0.6]'}`}
          style={{ padding: '8px', borderRadius: '3rem' }} // Fits inside the bezel
        />

        {/* Glare Effect for realism */}
        <div 
          ref={glareRef}
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300"
          style={{ 
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 50%)',
            borderRadius: '3rem'
          }}
        />

        {/* Cinematic Vignettes */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent transition-opacity duration-500 pointer-events-none ${isPlaying ? 'opacity-80' : 'opacity-100'}`} style={{ padding: '8px', borderRadius: '3rem' }} />
        <div className={`absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent transition-opacity duration-500 pointer-events-none h-1/3 ${isPlaying ? 'opacity-40' : 'opacity-100'}`} style={{ padding: '8px', borderRadius: '3rem' }} />

        {/* HUD Crosshairs */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-white/30 pointer-events-none transition-all duration-500 group-hover:border-blue-400 group-hover:scale-110"></div>
        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-white/30 pointer-events-none transition-all duration-500 group-hover:border-blue-400 group-hover:scale-110"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-white/30 pointer-events-none transition-all duration-500 group-hover:border-blue-400 group-hover:scale-110"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-white/30 pointer-events-none transition-all duration-500 group-hover:border-blue-400 group-hover:scale-110"></div>

        {/* Central Play/Pause Circular Progress Player */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          onClick={handlePlayPause}
        >
          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-500 ${isPlaying ? 'opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100 bg-black/40 backdrop-blur-md border border-white/20 hover:bg-blue-600/50 hover:border-blue-500/50'}`}>
            
            {/* The SVG Circular Progress Ring */}
            {isPlaying && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle 
                  cx="40" cy="40" r="38" 
                  stroke={data.color} 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: '238.76', // 2 * pi * r (approx 238.76 for r=38)
                    strokeDashoffset: 238.76 - (238.76 * progress) / 100,
                    transition: 'stroke-dashoffset 0.1s linear'
                  }} 
                />
              </svg>
            )}

            <div className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full ${isPlaying ? 'bg-black/60 backdrop-blur-md' : ''}`}>
               {isPlaying ? <Pause size={24} className="fill-white" /> : <Play size={28} className="fill-white ml-1" />}
            </div>
          </div>
        </div>

        {/* Top Data Bar */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-30 pointer-events-none">
           <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
             <span className="font-mono text-[9px] text-white font-bold tracking-widest uppercase">REC</span>
           </div>
           
           <button 
              onClick={handleMute}
              className={`w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 pointer-events-auto hover:bg-white/20 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-blue-400" />}
            </button>
        </div>

        {/* Bottom Metrics HUD */}
        <div className="absolute bottom-10 left-8 right-8 flex flex-col gap-4 pointer-events-none z-20">
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
              <Activity size={10} className="text-green-400" />
              <span className="font-mono text-[9px] text-green-400 font-bold tracking-widest">RET: {data.retention}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
              <Eye size={10} className="text-blue-400" />
              <span className="font-mono text-[9px] text-blue-400 font-bold tracking-widest">{data.views}</span>
            </div>
          </div>

          <div>
            <p className="font-body text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">
              Client // {data.client}
            </p>
            <h3 className="font-logo text-3xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {data.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReelVault = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
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
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: "power3.out",
        }
      );

      // Flawless Desktop Horizontal Scroll
      if (isDesktop && trackRef.current && containerRef.current) {
        // Calculate exact scroll distance needed
        const getScrollAmount = () => {
          let trackWidth = trackRef.current.scrollWidth;
          return -(trackWidth - window.innerWidth + 150); // 150px padding offset
        };

        const tween = gsap.to(trackRef.current, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "center center",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true
        });

        // Intro scaling effect for the cards as they appear
        const cards = gsap.utils.toArray('.reel-card-wrapper');
        cards.forEach((card) => {
          gsap.fromTo(card, 
            { scale: 0.8, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 90%",
                end: "center center",
                scrub: true,
              }
            }
          );
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="reels" 
      ref={sectionRef} 
      className="relative w-full bg-[#050505] overflow-hidden"
    >
      {/* Heavy Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] z-10"></div>
      
      {/* Core Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-blue-900/10 rounded-full blur-[200px] pointer-events-none"></div>

      <div ref={containerRef} className="py-24 md:py-32 h-full flex flex-col justify-center relative z-20">
        
        <div className="max-w-[1500px] mx-auto px-6 w-full mb-16 lg:mb-0 lg:absolute lg:top-32 lg:left-0 lg:right-0 lg:z-30 pointer-events-none">
          <div ref={headingRef} className="flex flex-col items-center lg:items-start text-center lg:text-left pointer-events-auto">
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-xl">
              <Crosshair size={16} className="text-blue-400 animate-[spin_4s_linear_infinite]" />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                Target: Algorithmic Dominance
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-8">
              <h2 className="font-logo text-5xl sm:text-6xl md:text-[6rem] font-black text-white uppercase tracking-tighter leading-[0.9]">
                The <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">Reel Vault.</span>
              </h2>
              <p className="font-body text-gray-400 max-w-sm text-sm md:text-base leading-relaxed mb-2">
                High-octane, rhythm-synced vertical edits engineered specifically to hijack the algorithm and maximize viewer retention. 
              </p>
            </div>
          </div>
        </div>

        {/* The Horizon Track */}
        <div className="w-full pl-6 md:pl-[calc((100vw-1500px)/2+1.5rem)] lg:pt-32">
          <div 
            ref={trackRef} 
            className="flex items-center gap-8 md:gap-12 lg:gap-20 w-max pr-[20vw] lg:pr-[50vw] overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none py-10"
          >
            {reelData.map((data, index) => (
              <div key={data.id} className="reel-card-wrapper snap-center shrink-0">
                 <ReelCard data={data} index={index} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ReelVault;