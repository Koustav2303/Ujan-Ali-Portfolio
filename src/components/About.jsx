import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Film, Scissors, MonitorPlay } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRefs = useRef([]);
  const imageRef = useRef(null);
  const statsRef = useRef([]);
  const marqueeRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Continuous Marquee Animation
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });

      // 2. ScrollTrigger Reveal for Text and Image
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Triggers when the top of the section hits 70% down the viewport
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Staggered text entrance
      tl.from(textRefs.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      })
      // Parallax/Scale image entrance
      .from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        rotationY: 15,
        duration: 1.2,
        ease: "power3.out",
      }, "-=0.8")
      // Pop in stats
      .from(statsRef.current, {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
      }, "-=0.6");

      // 3. Subtle Parallax on the Image while scrolling through the section
      gsap.to(imageRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <Film size={24} />, label: "Cinematic Edits", value: "150+" },
    { icon: <Scissors size={24} />, label: "Hours Timeline", value: "10k+" },
    { icon: <MonitorPlay size={24} />, label: "Global Clients", value: "40+" },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative w-full bg-dark overflow-hidden py-24 lg:py-32">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Infinite Scrolling Marquee */}
      <div className="w-full overflow-hidden flex whitespace-nowrap mb-20 opacity-40 mix-blend-screen pointer-events-none">
        <div ref={marqueeRef} className="flex gap-8 font-logo text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-dark uppercase tracking-widest">
          <span>COLOR GRADING // SOUND DESIGN // VFX & COMPOSITING // RHYTHM CUTS // </span>
          <span>COLOR GRADING // SOUND DESIGN // VFX & COMPOSITING // RHYTHM CUTS // </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Column: Image/Visual */}
        <div className="col-span-1 lg:col-span-5 order-2 lg:order-1 perspective-[1000px]">
          <div 
            ref={imageRef}
            className="relative w-full aspect-[3/4] rounded-3xl glass-panel overflow-hidden group"
          >
            {/* Placeholder for Ujan's Behind The Scenes photo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"></div>
            
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-logo text-2xl font-bold text-white uppercase tracking-wider mb-1">Ujan Ali</p>
              <p className="font-body text-sm text-blue-400 font-bold tracking-[0.2em] uppercase">Lead Editor</p>
            </div>
          </div>
        </div>

        {/* Right Column: Text & Stats */}
        <div className="col-span-1 lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
          
          <h2 className="font-logo text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-[1.1]">
            <div className="overflow-hidden py-1"><div ref={(el) => (textRefs.current[0] = el)}>Architect of</div></div>
            <div className="overflow-hidden py-1">
              <div ref={(el) => (textRefs.current[1] = el)} className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
                Visual Rhythm.
              </div>
            </div>
          </h2>

          <div className="space-y-6 mb-12">
            <p ref={(el) => (textRefs.current[2] = el)} className="text-lg md:text-xl font-body text-gray-300 font-light leading-relaxed">
              Editing isn't just about cutting footage; it's about dictating the emotional pulse of the narrative. I specialize in high-impact, rhythm-driven video editing that demands attention.
            </p>
            <p ref={(el) => (textRefs.current[3] = el)} className="text-base md:text-lg font-body text-gray-500 font-light leading-relaxed">
              Whether it's a high-octane commercial, a moody music video, or a cinematic short film, I bring an obsessive level of detail to pacing, sound design, and color grading. Every frame is deliberate.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                ref={(el) => (statsRef.current[index] = el)}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-blue-400 mb-4">{stat.icon}</div>
                <h4 className="font-logo text-3xl font-bold text-white mb-1">{stat.value}</h4>
                <p className="font-body text-xs text-gray-400 tracking-widest uppercase font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;