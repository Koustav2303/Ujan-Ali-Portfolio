import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#work' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const socialsRef = useRef([]);
  const tl = useRef(null);
  const ctaRef = useRef(null);
  const lastScrollY = useRef(0);

  // 1. Smart Scroll Detection (Hide on scroll down, show on scroll up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add background blur after scrolling 50px
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Active Section Tracker (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Triggers when 30% of the section is visible
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // 3. Mobile Menu GSAP Timeline
  useEffect(() => {
    gsap.set(menuRef.current, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' });

    tl.current = gsap
      .timeline({ paused: true })
      .to(menuRef.current, {
        duration: 0.8,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power4.inOut',
      })
      .fromTo(
        linksRef.current,
        { y: 60, opacity: 0, rotate: 5 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        socialsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      );

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        tl.current.play();
      } else {
        document.body.style.overflow = '';
        tl.current.reverse();
      }
    }
  }, [isOpen]);

  // 4. Magnetic CTA Logic
  const handleMagneticMove = (e) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
  };

  const handleMagneticLeave = () => {
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <>
      {/* Smart Floating Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 p-4 transition-transform duration-500 pointer-events-none ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}
      >
        <div 
          className={`max-w-7xl mx-auto flex justify-between items-center px-6 py-4 rounded-full pointer-events-auto transition-all duration-500 ${
            isScrolled ? 'bg-dark/60 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent border-transparent'
          }`}
        >
          {/* Logo */}
          <a href="#home" className="relative group overflow-hidden cursor-none z-[60]">
            <span className="font-logo text-2xl font-black tracking-tighter text-white">
              UA<span className="text-blue-500">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={index}
                  href={link.href}
                  className={`relative px-5 py-2 text-xs font-body font-bold uppercase tracking-[0.15em] rounded-full transition-colors duration-300 cursor-none ${
                    isActive ? 'text-dark bg-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4 z-[60]">
            <div 
              className="hidden lg:block p-4 -m-4" 
              onMouseMove={handleMagneticMove} 
              onMouseLeave={handleMagneticLeave}
            >
              <a 
                ref={ctaRef}
                href="#contact" 
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-body font-bold uppercase tracking-[0.1em] text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-colors cursor-none shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                Let's Talk <ArrowUpRight size={16} />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative p-2 text-white hover:text-blue-400 transition-colors pointer-events-auto"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-3xl flex flex-col justify-between pt-32 pb-12 px-8 pointer-events-auto"
      >
        <nav className="flex flex-col gap-6 mt-10">
          {navLinks.map((link, index) => (
            <div key={index} className="overflow-hidden">
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                ref={(el) => (linksRef.current[index] = el)}
                className="inline-block font-logo text-5xl sm:text-6xl font-black tracking-tighter text-gray-400 hover:text-white transition-colors duration-300 uppercase"
              >
                {link.name}
              </a>
            </div>
          ))}
          <div className="overflow-hidden mt-4">
             <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                ref={(el) => (linksRef.current[navLinks.length] = el)}
                className="inline-flex items-center gap-3 font-logo text-3xl font-black text-blue-500 uppercase tracking-tighter"
              >
                Start a Project <ArrowUpRight size={28} />
              </a>
          </div>
        </nav>

        {/* Mobile Menu Footer (Socials) */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <p className="font-body text-xs text-gray-500 tracking-widest uppercase font-bold">Follow</p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'YouTube'].map((social, idx) => (
              <a 
                key={idx}
                ref={(el) => (socialsRef.current[idx] = el)}
                href="#" 
                className="font-body text-sm font-bold text-white tracking-widest uppercase"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;