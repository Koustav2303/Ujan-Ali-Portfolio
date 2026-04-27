import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    // Smart detection: Only activate if the device uses a fine pointer (mouse/trackpad)
    const checkPointer = () => window.matchMedia("(pointer: fine)").matches;
    if (checkPointer()) {
      setHasMouse(true);
    }
  }, []);

  useEffect(() => {
    if (!hasMouse) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;

    // High-performance GSAP setters
    const xSetDot = gsap.quickSetter(dot, "x", "px");
    const ySetDot = gsap.quickSetter(dot, "y", "px");
    const xSetOutline = gsap.quickSetter(outline, "x", "px");
    const ySetOutline = gsap.quickSetter(outline, "y", "px");

    // Smooth Mouse Tracking
    const handleMouseMove = (e) => {
      xSetDot(e.clientX);
      ySetDot(e.clientY);
      gsap.to(outline, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.15, 
        ease: 'power2.out' 
      });
    };

    // Global Hover Listener (Detects ANY link or button on the page)
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        gsap.to(outline, { 
          scale: 2.5, 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          borderColor: 'transparent', 
          duration: 0.3 
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        gsap.to(outline, { 
          scale: 1, 
          backgroundColor: 'transparent', 
          borderColor: 'rgba(255,255,255,0.5)', 
          duration: 0.3 
        });
      }
    };

    // Attach Event Listeners to the Document
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [hasMouse]);

  // Completely unmount the cursor on touch devices (phones/tablets)
  if (!hasMouse) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-[9999]" 
      />
      <div 
        ref={outlineRef} 
        className="pointer-events-none fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors z-[9998]" 
      />
    </>
  );
};

export default CustomCursor;