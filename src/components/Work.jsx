import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: '01',
    title: 'Neon Drift',
    category: 'Commercial / Automotive',
    image: 'https://images.unsplash.com/photo-1518115286591-1ca0eb29decd?q=80&w=1600&auto=format&fit=crop',
    client: 'Porsche / Spec',
  },
  {
    id: '02',
    title: 'Midnight Echo',
    category: 'Music Video',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop',
    client: 'The Weeknd / Unofficial',
  },
  {
    id: '03',
    title: 'Raw Framework',
    category: 'Documentary Short',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1600&auto=format&fit=crop',
    client: 'Canon Creative',
  },
  {
    id: '04',
    title: 'Cyber Pulse',
    category: 'VFX / Social Cut',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    client: 'Internal Studio',
  },
];

const Work = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const marqueeRef = useRef(null);
  const cardsRef = useRef([]);
  const playCursorRef = useRef(null);
  const playTextRef = useRef(null);
  
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // --- DESKTOP ANIMATIONS ---
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const scrollWidth = track.scrollWidth - window.innerWidth + window.innerWidth * 0.15;

        // 1. Horizontal Scroll Timeline
        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // 2. Reverse Background Marquee
        gsap.to(marqueeRef.current, {
          x: window.innerWidth * 0.5, // Move right as we scroll left
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: 1,
          }
        });

        // 3. Deep Inner Parallax for Images
        cardsRef.current.forEach((card) => {
          const imageInner = card.querySelector('.image-inner');
          gsap.to(imageInner, {
            x: "20%", // Move image right inside its container
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${scrollWidth}`,
              scrub: 1,
            }
          });
        });

        // 4. Custom Localized Play Cursor
        const xSet = gsap.quickSetter(playCursorRef.current, "x", "px");
        const ySet = gsap.quickSetter(playCursorRef.current, "y", "px");

        window.addEventListener("mousemove", (e) => {
          xSet(e.clientX);
          ySet(e.clientY);
        });
      });

      // --- MOBILE ANIMATIONS ---
      mm.add("(max-width: 1023px)", () => {
        cardsRef.current.forEach((card) => {
          const imageInner = card.querySelector('.image-inner');
          
          // Fade and slide up cards
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });

          // Vertical parallax for images
          gsap.to(imageInner, {
            y: "15%",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle Play Cursor Hover Effects
  const handleMouseEnter = () => {
    setIsHovering(true);
    gsap.to(playCursorRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
    gsap.to(playTextRef.current, { scale: 1, opacity: 1, duration: 0.3, delay: 0.1 });
    // Hide default custom cursor if you have one
    document.body.style.cursor = 'none';
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    gsap.to(playCursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(playTextRef.current, { scale: 0.5, opacity: 0, duration: 0.2 });
    document.body.style.cursor = '';
  };

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      className="relative bg-dark py-20 lg:py-0 lg:h-screen w-full overflow-hidden"
    >
      {/* Localized Play Cursor (Desktop Only) */}
      <div 
        ref={playCursorRef}
        className="hidden lg:flex fixed top-0 left-0 w-28 h-28 bg-white rounded-full items-center justify-center pointer-events-none z-[100] mix-blend-exclusion -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0"
      >
        <span ref={playTextRef} className="font-logo font-black text-dark text-xl tracking-widest uppercase scale-50 opacity-0">
          Play
        </span>
      </div>

      {/* Kinetic Background Marquee */}
      <div className="absolute top-[20%] left-0 w-[300vw] -translate-x-[50vw] z-0 pointer-events-none opacity-5 mix-blend-overlay overflow-hidden hidden lg:block">
        <h2 
          ref={marqueeRef}
          className="font-logo text-[20rem] font-black text-white whitespace-nowrap leading-none tracking-tighter"
        >
          SELECTED WORKS • CINEMATIC CUTS • SELECTED WORKS
        </h2>
      </div>

      {/* Section Header */}
      <div className="absolute top-10 lg:top-16 left-0 w-full px-6 lg:px-12 z-20 pointer-events-none">
        <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="font-body text-blue-400 text-sm font-bold tracking-[0.3em] uppercase mb-4">
              Showreel
            </p>
            <h2 className="font-logo text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
              Selected <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                Work.
              </span>
            </h2>
          </div>
          <p className="font-body text-gray-400 uppercase tracking-[0.2em] text-xs lg:text-sm font-bold bg-dark/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 w-fit">
            [ Archive 2024 - 2026 ]
          </p>
        </div>
      </div>

      {/* Projects Track */}
      <div 
        ref={trackRef} 
        className="mt-32 lg:mt-0 flex flex-col lg:flex-row items-center lg:h-screen w-full px-6 lg:px-12 gap-16 lg:gap-32 lg:w-[max-content] z-10 relative"
      >
        {/* Empty padding block for desktop to align first card under the title */}
        <div className="hidden lg:block w-[15vw] flex-shrink-0"></div>

        {projects.map((project, index) => (
          <div 
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group relative w-full lg:w-[800px] xl:w-[1000px] flex-shrink-0 cursor-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Cinematic Number */}
            <div className="absolute -top-10 lg:-top-20 -left-4 lg:-left-12 text-[8rem] lg:text-[15rem] font-logo font-black text-white/5 pointer-events-none z-0 transition-transform duration-700 group-hover:-translate-y-4">
              {project.id}
            </div>

            {/* Project Image Container */}
            <div className="relative aspect-[4/5] lg:aspect-[16/9] w-full rounded-2xl lg:rounded-[2rem] overflow-hidden glass-panel border border-white/10 z-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
              
              {/* Scaled-up inner image for parallax room */}
              <div 
                className="image-inner absolute inset-[-20%] w-[140%] h-[140%] bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              ></div>
              
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-dark/10 via-transparent to-dark/90 opacity-80 transition-opacity duration-500 group-hover:opacity-60"></div>
              
              {/* Grain Overlay */}
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

              {/* Mobile Play Button (Hidden on Desktop since we have the custom cursor) */}
              <div className="absolute inset-0 flex items-center justify-center lg:hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center">
                   <span className="font-body text-white text-xs font-bold tracking-widest uppercase">Play</span>
                </div>
              </div>
            </div>

            {/* Project Meta Details */}
            <div className="mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 z-20 relative">
              <div>
                <p className="font-logo text-blue-400 font-bold text-xs lg:text-sm tracking-[0.2em] uppercase mb-3 flex items-center gap-3">
                  <span className="w-8 h-px bg-blue-400"></span>
                  {project.category}
                </p>
                <h3 className="font-logo text-4xl lg:text-5xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all duration-500">
                  {project.title}
                </h3>
              </div>
              
              {/* Client & Arrow */}
              <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t border-white/10 lg:border-none pt-4 lg:pt-0">
                <div className="text-left lg:text-right">
                  <p className="font-body text-gray-500 text-[10px] tracking-widest uppercase font-bold mb-1">Client</p>
                  <p className="font-body text-white text-sm tracking-wider font-semibold">{project.client}</p>
                </div>
                
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-colors duration-500 overflow-hidden shrink-0">
                  <ArrowUpRight 
                    className="text-gray-400 group-hover:text-dark group-hover:rotate-45 transition-all duration-500" 
                    size={24} 
                  />
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Empty padding block to allow scrolling past the last item smoothly */}
        <div className="hidden lg:block w-[10vw] flex-shrink-0"></div>
      </div>
    </section>
  );
};

export default Work;