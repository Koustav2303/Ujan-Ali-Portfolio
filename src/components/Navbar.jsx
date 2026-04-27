import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X, ArrowUpRight, Circle } from 'lucide-react';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const socialsRef = useRef([]);
  const tl = useRef(null);
  const ctaRef = useRef(null);
  const lastScrollY = useRef(0);

  // 1. Smart Scroll Detection & Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Update Progress Bar
      setScrollProgress((currentScrollY / totalScroll) * 100);
      
      // Add background blur after scrolling 50px
      setIsScrolled(currentScrollY > 50);

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

  // 2. High-Accuracy Intersection Observer for Active States
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to get the most prominent section
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { 
        threshold: [0.2, 0.5, 0.8], // Multiple thresholds for better accuracy
        rootMargin: "-10% 0px -40% 0px" // Offset to trigger slightly before center
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // 3. Cinematic Mobile Menu Timeline
  useEffect(() => {
    gsap.set(menuRef.current, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' });

    tl.current = gsap
      .timeline({ paused: true })
      // Unveil the dark glass background
      .to(menuRef.current, {
        duration: 0.8,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power4.inOut',
      })
      // Stagger in the massive typography
      .fromTo(
        linksRef.current,
        { y: 80, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      )
      // Pop in the social links and HUD elements
      .fromTo(
        socialsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  // Handle Mobile Menu Open/Close States
  useEffect(() => {
    if (tl.current) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // Lock scroll
        tl.current.play();
      } else {
        document.body.style.overflow = ''; // Unlock scroll
        tl.current.reverse();
      }
    }
  }, [isOpen]);

  // 4. Advanced Smooth Scroll Click Handler
  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    // Logic to close menu first if on mobile
    if (isOpen) {
      setIsOpen(false);
      // Wait for menu to slide up before scrolling
      setTimeout(() => {
        executeScroll(href);
      }, 800); 
    } else {
      executeScroll(href);
    }
  };

  const executeScroll = (href) => {
    if (href === '#home') {
      // Direct scroll to top for "Home"
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        // Calculate offset to account for the sticky navbar height
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // 5. Magnetic CTA Logic
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
      {/* Global Cinematic Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[100] bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
          style={{ width: `${scrollProgress}%`, transition: 'width 0.1s ease-out' }}
        ></div>
      </div>

      {/* Smart Floating Header Pill */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 p-4 md:p-6 transition-transform duration-500 pointer-events-none ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}
      >
        <div 
          className={`max-w-7xl mx-auto flex justify-between items-center px-6 py-4 rounded-full pointer-events-auto transition-all duration-500 ${
            isScrolled ? 'bg-dark/70 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent'
          }`}
        >
          {/* Logo (Scrolls to top) */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="relative group overflow-hidden cursor-none z-[60]"
          >
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
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-6 py-2.5 text-xs font-body font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 cursor-none ${
                    isActive ? 'text-dark bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4 z-[60]">
            <div 
              className="hidden lg:block p-4 -m-4" 
              onMouseMove={handleMagneticMove} 
              onMouseLeave={handleMagneticLeave}
            >
              <a 
                ref={ctaRef}
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-body font-bold uppercase tracking-[0.1em] text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-colors cursor-none shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                Let's Talk <ArrowUpRight size={16} />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative p-2 text-white hover:text-blue-400 transition-colors pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay (Post-Production Aesthetic) */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-3xl flex flex-col justify-between pt-32 pb-12 px-8 pointer-events-auto"
      >
        {/* Decorative HUD Background for Mobile Menu */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <nav className="flex flex-col gap-6 mt-10 z-10 perspective-[1000px]">
          {navLinks.map((link, index) => (
            <div key={index} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                ref={(el) => (linksRef.current[index] = el)}
                className="inline-block font-logo text-[3.5rem] sm:text-6xl font-black tracking-tighter text-gray-400 hover:text-white transition-colors duration-300 uppercase transform-origin-left"
              >
                {link.name}
              </a>
            </div>
          ))}
          <div className="overflow-hidden mt-8">
             <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                ref={(el) => (linksRef.current[navLinks.length] = el)}
                className="inline-flex items-center gap-4 font-logo text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-tighter"
              >
                Start a Project <ArrowUpRight size={28} className="text-purple-500" />
              </a>
          </div>
        </nav>

        {/* Mobile Menu Footer (Socials & Status) */}
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 z-10">
          
          {/* Simulated Workspace Status */}
          <div ref={(el) => (socialsRef.current[0] = el)} className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
             <Circle size={8} className="text-red-500 fill-red-500 animate-pulse" />
             <span className="text-[10px] font-logo font-bold tracking-[0.2em] text-white uppercase">System Online</span>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-4">
              <p ref={(el) => (socialsRef.current[1] = el)} className="font-body text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold">Socials</p>
              <div className="flex gap-6">
                {['Insta', 'X', 'YT'].map((social, idx) => (
                  <a 
                    key={idx}
                    ref={(el) => (socialsRef.current[idx + 2] = el)}
                    href="#" 
                    className="font-body text-sm font-bold text-white tracking-widest uppercase hover:text-blue-400 transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <p ref={(el) => (socialsRef.current[5] = el)} className="font-logo text-xs text-gray-600 font-bold tracking-widest uppercase">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;