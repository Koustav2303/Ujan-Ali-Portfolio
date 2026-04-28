import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, MessageSquareQuote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Creativity Step 1: Realistic, high-end testimonials tailored for an editor
const testimonialsData = [
  {
    quote: "Ujan didn't just edit; he understood the narrative soul of the raw footage. His sense of pacing is god-tier.",
    name: "Sarah Chen",
                company: "Producer, Pixel Peak Studios",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "Absolute wizard with color grading. Turned our flat LOG footage into a legendary visual trip. Worth every penny.",
    name: "Marcus Rodriguez",
                company: "Director, Apex Kinetics",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "The sound design depth Ujan brought to our commercial was insane. He doesn't just cut visual; he edits the frequency.",
    name: "Aisha Khan",
                company: "Marketing Lead, Nova Innovations",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    quote: "Required a hype-reel cut on a impossible deadline. Ujan delivered a masterpiece with an hour to spare. Insane workflow.",
    name: "James Foster",
                company: "Founder, Chronos Collective",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
    {
    quote: "We needed the impossible narrative sync between five different cameras. Ujan calculated the visual rhythm perfectly.",
    name: "Elena Petrova",
                company: "Editor, Global Lens Features",
    avatar: "https://randomuser.me/api/portraits/women/78.jpg"
  }
];

const Testimonials = () => {
  const sectionRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const headingRef = useRef(null);
  const panelsRef = useRef([]);

  // Double the testimonials data for a flawless infinite loop
  const infiniteTestimonials = [...testimonialsData, ...testimonialsData];

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Entrance Animation for the heading
      gsap.fromTo(headingRef.current, 
        { y: 60, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: "expo.out",
        }
      );

      // 2. Continuous Automatic Infinite Loop (GSAP QuickTo for performance)
      const track = marqueeTrackRef.current;
      // Calculate half the width of the track (because we doubled the data)
      const loopWidth = track.scrollWidth / 2;

      // The core automated animation timeline
      const loopTl = gsap.timeline({ repeat: -1 });
      loopTl.to(track, {
        x: -loopWidth,
        duration: 35, // Adjust this number to control the speed (higher = slower)
        ease: "none",
        // Crucial: When it reaches the half-way point, instantly reset x to 0 
        // to create the seamless infinite effect
        onRepeat: () => gsap.set(track, { x: 0 }) 
      });

      // 3. Cinematic Depth-of-Field Effect (Desktop Only Interaction)
      // This makes center items bright and sharp, peripheral items blurred and darker.
      
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        
        // Setup initial blurred state for peripheral panels
        gsap.set(panelsRef.current, { scale: 0.9, opacity: 0.2, filter: 'blur(10px)' });
        
        // Pause automated loop on hover
        track.addEventListener('mouseenter', () => loopTl.pause());
        track.addEventListener('mouseleave', () => loopTl.resume());

        // Attach depth of field listener to the track movement
        panelsRef.current.forEach((panel) => {
          if (!panel) return;

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: loopTl, // Tie ScrollTrigger to the GSAP timeline, not the viewport
            start: "left center", // Trigger when panel enters center of screen
            end: "right center", // End when panel leaves center
            
            // This is where the magic happens:
            // "onUpdate" gets called continuously as the timeline plays
            onUpdate: (self) => {
              // Calculate distance of panel center from screen center
              const rect = panel.getBoundingClientRect();
              const panelCenter = rect.left + rect.width / 2;
              const screenCenter = window.innerWidth / 2;
              const distanceFromCenter = Math.abs(panelCenter - screenCenter);
              
              // Map the distance to scale, opacity, and blur values
              // Max distance (edge of screen) = blurry, dark, small. Min distance (center) = sharp, bright, large.
              const maxDistance = window.innerWidth / 2;
              const progress = Math.min(distanceFromCenter / maxDistance, 1); // Normalize distance (0 to 1)

              const targetScale = gsap.utils.mapRange(0, 1, 1.1, 0.9, progress);
              const targetOpacity = gsap.utils.mapRange(0, 1, 1, 0.2, progress);
              const targetBlur = gsap.utils.mapRange(0, 1, 0, 10, progress); // px blur

              // Apply values instantly for silky performance
              gsap.set(panel, {
                scale: targetScale,
                opacity: targetOpacity,
                filter: `blur(${targetBlur}px)`,
                overwrite: 'auto'
              });
            }
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="testimonials" 
      className="relative w-full bg-dark py-24 md:py-32 lg:py-48 overflow-hidden z-10"
    >
      
      {/* Cinematic Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-950/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div ref={headingRef} className="mb-16 md:mb-24 flex flex-col items-center text-center">
            <p className="font-body text-blue-400 text-sm font-bold tracking-[0.4em] uppercase mb-4flex items-center gap-4">
                <span className="w-16 h-px bg-blue-400"></span> Client Narratives <span className="w-16 h-px bg-blue-400"></span>
            </p>
            <h2 className="font-logo text-5xl sm:text-[5rem] md:text-[6rem] font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                The <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-300 to-gray-700"> Verdict.</span>
            </h2>
        </div>

        {/* Infinite Automated Reel Track Container */}
        <div className="relative w-full flex items-center lg:perspective-[2000px]">
          
          {/* Noise texture overlay specifically for the reel track */}
          <div className="absolute inset-x-[-20vw] inset-y-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10"></div>
          
          {/* Desktop Depth Vignette Overlays (Softly darkens the edges) */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[20vw] bg-gradient-to-r from-dark via-dark/80 to-transparent z-20 pointer-events-none"></div>
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[20vw] bg-gradient-to-l from-dark via-dark/80 to-transparent z-20 pointer-events-none"></div>

          {/* Core Infinite Track - doubled data scrolls horizontally */}
          <div 
            ref={marqueeTrackRef} 
            className="flex items-center gap-10 md:gap-16 w-[max-content] cursor-none py-10 lg:py-20"
            style={{ transformStyle: 'preserve-3d' }} // Required for potential 3D magnetic tilt
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                // Ref callback to populate panels array
                ref={(el) => (panelsRef.current[index] = el)}
                className="testimonial-panel group relative w-[320px] sm:w-[400px] md:w-[480px] lg:w-[550px] p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md overflow-hidden shrink-0 transform-origin-center transition-transform duration-700 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]"
                style={{
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.7)',
                    transformStyle: 'preserve-3d'
                }}
              >
                {/* Visual Decorative elements to reinforce "film strip" look */}
                <div className="absolute -top-6 -left-6 text-gray-800 opacity-20">
                    <Quote size={80} strokeWidth={1} />
                </div>
                
                {/* Internal HUD data points */}
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-dark/60 rounded-full border border-white/10 opacity-60">
                   <Star size={10} className="text-blue-400 fill-blue-400" />
                   <span className="font-logo text-[8px] text-white font-bold tracking-[0.2em] uppercase">Verified Verdict</span>
                </div>

                <div className="relative z-10 flex flex-col gap-8 md:gap-10" style={{ transform: 'translateZ(50px)' }}>
                  
                  {/* The Quote */}
                  <div className="relative">
                     <MessageSquareQuote size={28} className="text-blue-500 mb-6 opacity-80" />
                     <blockquote className="font-body text-base md:text-xl text-gray-300 font-light leading-relaxed drop-shadow-md">
                        {testimonial.quote}
                     </blockquote>
                  </div>

                  {/* Client Signature */}
                  <div className="flex items-center gap-4 md:gap-5 border-t border-white/10 pt-6 md:pt-8 mt-auto">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 overflow-hidden shrink-0">
                       <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                       />
                        <div className="absolute inset-0 bg-dark/10"></div>
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="font-logo text-lg md:text-xl font-bold text-white tracking-wide">{testimonial.name}</p>
                      <p className="font-body text-xs md:text-sm text-gray-500 font-medium tracking-wider">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
                
                {/* Background lighting detail inside panel on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-[2.5rem]"
                   style={{ background: `radial-gradient(400px circle at 50% 50%, rgba(37, 99, 235, 0.1), transparent 70%)` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Local Bottom decoration indicator */}
         <div className="mt-20 lg:mt-32 w-full flex items-center justify-center gap-3 font-logo text-xs text-gray-600 font-bold tracking-[0.3em] uppercase opacity-60">
            <span>Online Archive</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span>v2.1</span>
         </div>
      </div>
    </section>
  );
};

export default Testimonials;