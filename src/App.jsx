import React from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Testimonials from './components/Testimonials';
// Import the new Pricing component
import Pricing from './components/Pricing';
import Contact from './components/Contact';

function App() {
  return (
    <div className="bg-dark relative selection:bg-white selection:text-dark overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Pricing />
      <Testimonials />
      <Contact />
    </div>
  );
}

export default App;