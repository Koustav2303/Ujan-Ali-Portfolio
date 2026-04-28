import React from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Arsenal from './components/Arsenal';
import Work from './components/Work';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
// Import the bot
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="bg-dark relative selection:bg-white selection:text-dark overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Arsenal />
      <Work />
      <Testimonials />
      <Pricing />
      <Contact />
      <ChatBot />
    </div>
  );
}

export default App;