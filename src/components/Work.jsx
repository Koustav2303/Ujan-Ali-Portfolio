import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: '01',
    title: 'Neon Nights',
    category: 'Music Video',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: '02',
    title: 'Urban Drift',
    category: 'Commercial',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: '03',
    title: 'Echoes',
    category: 'Short Film',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: '04',
    title: 'Velocity',
    category: 'Social Cut',
    color: 'from-emerald-400 to-teal-600',
  },
];

const Work = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate Section Title
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Responsive GSAP setup
      let mm = gsap.matchMedia();

      // Desktop: Horizontal Scroll
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        
        // Calculate the total width to move
        const scrollWidth = track.scrollWidth - window.innerWidth + window.innerWidth * 0.1;

        gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1, // Smooth scrubbing effect
            invalidateOnRefresh: true,
          }
        });

        // Parallax effect on images inside the cards during horizontal scroll
        cardsRef.current.forEach((card) => {
          const imageInner = card.querySelector('.image-inner');
          gsap.to(imageInner, {
            x: 100, // Move image slightly to the right as we scroll left
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${scrollWidth}`,
              scrub: 1,
            }
          });
        });
      });

      // Mobile: Vertical Staggered Fade-in
      mm.add("(max-width: 767px)", () => {
        cardsRef.current.forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="work" 
      ref={sectionRef} 
      className="relative bg-dark py-20 md:py-0 md:h-screen w-full overflow-hidden"
    >
      {/* Section Header */}
      <div className="absolute top-20 left-0 w-full px-6 md:px-12 z-10 pointer-events-none">
        <div ref={titleRef} className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-logo text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Work</span>
          </h2>
          <p className="font-body text-gray-400 uppercase tracking-widest text-sm md:text-base font-bold">
            [ 2024 - 2026 ]
          </p>
        </div>
      </div>

      {/* Projects Track (Pins on Desktop, Stacks on Mobile) */}
      <div 
        ref={trackRef} 
        className="mt-32 md:mt-0 flex flex-col md:flex-row items-center md:h-screen w-full px-6 md:px-12 gap-10 md:gap-20 md:w-[max-content]"
      >
        {/* Empty padding block for desktop to align first card under the title */}
        <div className="hidden md:block w-[10vw]"></div>

        {projects.map((project, index) => (
          <div 
            key={project.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group relative w-full md:w-[600px] lg:w-[800px] flex-shrink-0 cursor-pointer"
          >
            {/* Project Card Image/Video Container */}
            <div className="relative aspect-video w-full rounded-2xl md:rounded-[2rem] overflow-hidden glass-panel">
              {/* Inner div for parallax effect */}
              <div 
                className={`image-inner absolute inset-[-100px] bg-gradient-to-br ${project.color} opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105`}
              ></div>
              
              {/* Overlay styling */}
              <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500"></div>
              
              {/* Hover View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
                  <span className="font-body text-white text-sm font-bold tracking-widest uppercase">Play</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="mt-6 flex justify-between items-start">
              <div>
                <p className="font-logo text-blue-400 font-bold text-sm tracking-[0.2em] uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-logo text-3xl md:text-5xl font-bold text-white tracking-tight group-hover:text-gray-300 transition-colors">
                  {project.title}
                </h3>
              </div>
              
              {/* Animated Arrow */}
              <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-colors duration-300 overflow-hidden">
                <ArrowUpRight 
                  className="text-gray-400 group-hover:text-dark transition-colors duration-300" 
                  size={24} 
                />
              </div>
            </div>

            {/* Massive Background Number */}
            <div className="absolute -top-10 md:-top-20 -right-4 md:-right-10 text-[10rem] md:text-[15rem] font-logo font-black text-white/5 pointer-events-none z-[-1]">
              {project.id}
            </div>
          </div>
        ))}

        {/* Empty padding block to allow scrolling past the last item smoothly */}
        <div className="hidden md:block w-[10vw]"></div>
      </div>
    </section>
  );
};

export default Work;