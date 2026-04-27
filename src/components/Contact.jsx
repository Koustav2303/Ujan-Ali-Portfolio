import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const formRef = useRef(null);
  const socialsRef = useRef([]);
  const submitBtnRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: '',
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Title Reveal
      tl.fromTo(
        textRef.current,
        { y: 100, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "power3.out" }
      )
      // Form Reveal
      .fromTo(
        formRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      // Socials Stagger
      .from(socialsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic Button Logic
  const handleMagneticMove = (e) => {
    const btn = submitBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    
    gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
  };

  const handleMagneticLeave = () => {
    gsap.to(submitBtnRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Connects directly to WhatsApp
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    
    const phoneNumber = "919883597344"; // Formatted without '+' or spaces
    const message = `Hello Ujan,\n\nMy name is ${formData.name}.\nMy email is ${formData.email}.\n\nProject Details:\n${formData.details}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  // Inline SVGs guarantee no missing export errors
  const socials = [
    { 
      name: 'Instagram', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, 
      href: '#' 
    },
    { 
      name: 'Facebook', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, 
      href: '#' 
    },
    { 
      name: 'Twitter / X', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, 
      href: '#' 
    },
    { 
      name: 'Threads', 
      // Threads approximate SVG representation
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"/></svg>, 
      href: '#' 
    },
  ];

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-dark flex flex-col justify-between pt-32 pb-10 overflow-hidden z-20"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Column: Typography & Socials */}
        <div className="flex flex-col justify-center">
          <p className="font-body text-blue-400 text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4">
            Got a Vision?
          </p>

          <div className="overflow-hidden mb-8 w-full">
            <h2 
              ref={textRef}
              className="font-logo text-6xl sm:text-7xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl"
            >
              Let's <span className="block text-transparent bg-clip-text bg-gradient-to-br from-gray-300 to-gray-700">Create.</span>
            </h2>
          </div>

          <p className="font-body text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Ready to bring your narrative to life? Drop the details here and hit send to chat directly with me on WhatsApp.
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {socials.map((social, index) => (
              <a
                key={index}
                ref={(el) => (socialsRef.current[index] = el)}
                href={social.href}
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="p-3 rounded-full border border-gray-800 bg-gray-900/50 group-hover:bg-white group-hover:text-dark transition-all duration-300">
                  {social.icon}
                </span>
                <span className="font-body text-sm font-bold tracking-widest uppercase hidden sm:block">
                  {social.name}
                </span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Glassmorphic Contact Form */}
        <div 
          ref={formRef}
          className="glass-panel p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg mx-auto lg:ml-auto border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative"
        >
          {/* Subtle inner glow for the form container */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>

          <form onSubmit={handleWhatsAppSubmit} className="relative z-10 flex flex-col gap-6">
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-body text-xs text-gray-400 uppercase tracking-widest font-semibold">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-dark/50 border border-gray-700 rounded-xl px-5 py-4 text-white font-body focus:outline-none focus:border-blue-500 focus:bg-dark/80 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-body text-xs text-gray-400 uppercase tracking-widest font-semibold">Your Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@creative.com"
                className="w-full bg-dark/50 border border-gray-700 rounded-xl px-5 py-4 text-white font-body focus:outline-none focus:border-blue-500 focus:bg-dark/80 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Details/Message Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="font-body text-xs text-gray-400 uppercase tracking-widest font-semibold">Project Details</label>
              <textarea 
                id="details" 
                name="details" 
                required
                value={formData.details}
                onChange={handleChange}
                placeholder="Tell me about the edit you need..."
                rows="4"
                className="w-full bg-dark/50 border border-gray-700 rounded-xl px-5 py-4 text-white font-body focus:outline-none focus:border-blue-500 focus:bg-dark/80 transition-all placeholder:text-gray-600 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-end">
              <div 
                className="p-4 -m-4" // Invisible padding for magnetic trigger area
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                <button 
                  ref={submitBtnRef}
                  type="submit"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-dark rounded-full font-body font-bold uppercase tracking-[0.1em] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10 text-sm">Send to WhatsApp</span>
                  <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* Cinematic Footer Bottom Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-32 flex flex-col md:flex-row items-center justify-between gap-10 z-10 border-t border-white/10 pt-12 pb-8 relative">
        
        {/* Subtle background glow for the footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

        {/* Left: Copyright */}
        <div className="flex flex-col gap-2 text-center md:text-left order-2 md:order-1">
          <p className="font-logo text-white text-lg font-bold tracking-widest uppercase">Ujan Ali<span className="text-blue-500">.</span></p>
          <p className="font-body text-gray-500 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>

        {/* Middle: Developer Signature */}
        <div className="font-body text-gray-400 text-xs md:text-sm font-semibold tracking-widest uppercase text-center order-1 md:order-2 flex flex-col sm:flex-row items-center gap-2">
          <span>Engineered with precision by</span>
          <a 
            href="https://koustav2303.github.io/koustavpan-portfolio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center cursor-none"
          >
            {/* The text */}
            <span className="relative z-10 text-blue-400 font-bold group-hover:text-white transition-colors duration-500 px-2 py-1">
              Koustav Pan
            </span>
            
            {/* Animated underline */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            
            {/* Cinematic ambient glow on hover */}
            <span className="absolute inset-0 bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
          </a>
        </div>
        
        {/* Right: Back to Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-4 font-body text-gray-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase hover:text-white transition-colors cursor-none order-3 md:order-3"
        >
          Back To Top 
          <div className="w-10 h-10 rounded-full border border-gray-700 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
             <ArrowUpRight className="text-gray-400 group-hover:text-dark transition-colors duration-500" size={18} />
          </div>
        </button>
      </div>
    </section>
  );
};

export default Contact;