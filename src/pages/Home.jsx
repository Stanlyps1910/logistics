import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Ship, Truck, CheckCircle2, Star, Cpu } from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";
import StatsCounter from "../components/StatsCounter";
import InteractiveGlobe from "../components/InteractiveGlobe";

// Page Transition Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Word Reveal Animations for Hero
const wordRevealContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const wordRevealItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  const heroText = "Delivering Tomorrow, Today. Fast and Reliable Supply Chains.";
  const heroWords = heroText.split(" ");

  const previewServices = [
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Smart Road Freight",
      description: "Electric vehicle fleets utilizing advanced sensors and route planning to navigate highways safely.",
    },
    {
      icon: <Plane className="w-8 h-8 text-primary" />,
      title: "Express Air Delivery",
      description: "Priority air freight utilizing optimized flight corridors and fast regional connections to bypass bottlenecks.",
    },
    {
      icon: <Ship className="w-8 h-8 text-primary" />,
      title: "Smart Maritime Freight",
      description: "Smart shipping containers with real-time tracking ensuring precision routing and safe delivery across oceans.",
    }
  ];

  const testimonials = [
    {
      quote: "NexaFreight revolutionized our cold chain distribution. Temperature monitoring is extremely precise, saving millions in pharmaceuticals.",
      author: "Dr. Aris Vance",
      company: "BioHelix Pharmaceuticals",
      rating: 5,
    },
    {
      quote: "Their delivery fleet is incredibly consistent. The predictive transit timelines have reshaped how we manage warehousing inventory.",
      author: "Elena Rostova",
      company: "Apex Robotic Systems",
      rating: 5,
    },
    {
      quote: "We calculated shipping costs to 12 different ports instantly. The quote tool was within 1% of the final invoice. Unparalleled accuracy.",
      author: "Marcus Vance",
      company: "OmniTech Global",
      rating: 5,
    }
  ];

  const logos = [
    "QUANTUM CORP", "HYPERLOOP SYSTEMS", "AEROTECH", "BIOPHARMA", "NEPTUNE MARITIME", "ALPHATECH"
  ];

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container pt-16 grid-lines"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f0f4ff]/50 via-white to-white px-4 border-b border-blue-50">
        <ParticleBackground />

        {/* Dynamic geometric layout background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-cyan-100/30 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 py-16 md:py-24 px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-6"
              >
                <Cpu className="w-3.5 h-3.5 text-secondary animate-pulse" />
                <span>Smart Logistics Platform</span>
              </motion.div>

              {/* Staggered Heading */}
              <motion.h1
                variants={wordRevealContainer}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-dark font-display max-w-5xl mx-auto lg:mx-0 leading-tight"
              >
                {heroWords.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordRevealItem}
                    className="inline-block mr-3 md:mr-4"
                  >
                    {word.includes("Tomorrow,") || word.includes("Reliable") ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 text-base md:text-xl text-slate-600 max-w-3xl mx-auto lg:mx-0 font-sans leading-relaxed"
              >
                Experience smart scheduling, optimized route planning, and complete supply-chain transparency. A modern logistics network designed for global speed.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/calculator"
                    className="w-full sm:w-auto text-center justify-center inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold uppercase font-display tracking-wider rounded-xl shadow-[0_8px_25px_rgba(0,71,204,0.3)] hover:shadow-[0_0_20px_rgba(0,180,216,0.6)] border border-blue-400/20 transition-all duration-300"
                  >
                    Get a Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/tracker"
                    className="w-full sm:w-auto text-center justify-center inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-800 font-bold uppercase font-display tracking-wider rounded-xl border border-blue-100/80 shadow-[0_8px_32px_rgba(0,71,204,0.05)] hover:bg-slate-50 transition-all duration-300"
                  >
                    Track Shipment
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Interactive 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-5 flex justify-center items-center w-full relative"
            >
              <InteractiveGlobe />
            </motion.div>

          </div>
        </div>

        {/* Animated route dots in blue visual block */}
        <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden pointer-events-none opacity-60">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent absolute bottom-6"></div>
          {/* Animated Route Node Dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-[21px] w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#00b4d8]"
              initial={{ left: "-10%" }}
              animate={{ left: "110%" }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.5
              }}
            />
          ))}
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f0f4ff]/40 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 glass-card rounded-2xl">
              <p className="text-4xl md:text-5xl font-black text-primary font-display mb-2">
                <StatsCounter targetValue={4800} suffix="+" />
              </p>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500 font-display">
                Active Fleets
              </p>
            </div>
            
            <div className="text-center p-6 glass-card rounded-2xl">
              <p className="text-4xl md:text-5xl font-black text-primary font-display mb-2">
                <StatsCounter targetValue={99} suffix=".9%" />
              </p>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500 font-display">
                Precision In Transit
              </p>
            </div>

            <div className="text-center p-6 glass-card rounded-2xl">
              <p className="text-4xl md:text-5xl font-black text-primary font-display mb-2">
                <StatsCounter targetValue={142} suffix="" />
              </p>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500 font-display">
                Countries Synced
              </p>
            </div>

            <div className="text-center p-6 glass-card rounded-2xl">
              <p className="text-4xl md:text-5xl font-black text-primary font-display mb-2">
                <StatsCounter targetValue={2} prefix="" suffix=".4B+" />
              </p>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500 font-display">
                Tons Securely Hauled
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight Section */}
      <section className="py-24 bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
              OUR LOGISTICS SERVICES
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-500">
              Integrating advanced vehicle routing, real-time tracking, and automated cargo handling to deliver reliable logistics.
            </p>
          </div>

          {/* Cards Stagger Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="glass-card p-8 rounded-2xl flex flex-col justify-between group cursor-pointer border border-blue-100 hover:border-secondary/40 shadow-[0_8px_32px_rgba(0,71,204,0.06)] hover:shadow-[0_12px_40px_rgba(0,71,204,0.12)] bg-white/70"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(service.icon, {
                      className: "w-7 h-7 text-primary group-hover:text-white transition-colors duration-300"
                    })}
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-primary font-display uppercase tracking-wider group-hover:text-secondary transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-base font-bold uppercase tracking-wider text-primary hover:text-secondary font-display transition-colors"
            >
              View All 6 Core Operations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Schematic Route Map (Dotted line vector visual) */}
      <section className="py-20 bg-gradient-to-b from-white to-[#f0f4ff]/30 overflow-hidden relative border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/50 text-[10px] font-black uppercase tracking-widest text-primary mb-4 font-display">
                <span>Real-time Operations</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tight leading-tight">
                SMART ROUTE PLANNING
              </h2>
              <p className="mt-6 text-slate-600 leading-relaxed text-base">
                Our route planning systems monitor weather patterns, port traffic, and customs queues in real-time. Optimized route planning ensures your shipments avoid delays.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark font-display text-sm uppercase">Dynamic Route Planning</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Alternative routes are automatically calculated to keep your cargo moving.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark font-display text-sm uppercase">Traffic and Congestion Alerts</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Our systems forecast port and highway traffic to avoid congested areas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Vector Route Map */}
            <div className="relative glass-card p-6 rounded-3xl border border-blue-100 flex items-center justify-center bg-white/60 aspect-video">
              <svg className="w-full h-full opacity-80" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Connection lines */}
                <path d="M100 80 Q250 50 400 120 T500 280" stroke="rgba(0, 71, 204, 0.2)" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M100 80 Q180 180 300 200 T500 280" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M150 280 Q300 250 400 120" stroke="rgba(0, 71, 204, 0.15)" strokeWidth="2" strokeDasharray="8 6" />
                <path d="M300 200 Q420 220 500 100" stroke="rgba(0, 212, 255, 0.25)" strokeWidth="1.5" strokeDasharray="5 3" />

                {/* Nodes */}
                <circle cx="100" cy="80" r="6" fill="#0047cc" />
                <circle cx="100" cy="80" r="14" stroke="#0047cc" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" style={{ transformOrigin: "100px 80px" }} />
                
                <circle cx="400" cy="120" r="5" fill="#00b4d8" />
                <circle cx="300" cy="200" r="7" fill="#0047cc" />
                
                <circle cx="150" cy="280" r="5" fill="#00b4d8" />
                <circle cx="500" cy="280" r="8" fill="#0047cc" />
                <circle cx="500" cy="280" r="16" stroke="#0047cc" strokeWidth="1" strokeOpacity="0.3" className="animate-ping" style={{ transformOrigin: "500px 280px" }} />
                
                <circle cx="500" cy="100" r="4" fill="#00b4d8" />

                {/* Moving Route Dots */}
                <circle r="4" fill="#00d4ff" className="shadow-[0_0_8px_#00d4ff]">
                  <animateMotion 
                    dur="7s" 
                    repeatCount="indefinite" 
                    path="M100 80 Q250 50 400 120 T500 280" 
                  />
                </circle>

                <circle r="3.5" fill="#0047cc">
                  <animateMotion 
                    dur="10s" 
                    repeatCount="indefinite" 
                    path="M150 280 Q300 250 400 120" 
                  />
                </circle>

                <circle r="3" fill="#00b4d8">
                  <animateMotion 
                    dur="5s" 
                    repeatCount="indefinite" 
                    path="M300 200 Q420 220 500 100" 
                  />
                </circle>

                {/* Text Labels */}
                <text x="75" y="60" fill="#0a1628" fontSize="10" fontWeight="bold" fontFamily="Space Grotesk">BENGALURU HQ</text>
                <text x="445" y="305" fill="#0a1628" fontSize="10" fontWeight="bold" fontFamily="Space Grotesk">CHENNAI PORT</text>
                <text x="240" y="222" fill="#334155" fontSize="9" fontFamily="Plus Jakarta Sans" fontWeight="bold">MUMBAI PORT</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tight">
              CLIENT TESTIMONIALS
            </h2>
            <p className="mt-4 text-slate-500 text-base md:text-lg">
              What corporate partners, distributors, and operations managers say about working with NexaFreight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border border-blue-100 flex flex-col justify-between bg-white relative">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100/50 flex flex-col">
                  <span className="font-bold text-dark font-display text-base uppercase">{t.author}</span>
                  <span className="text-slate-400 text-xs font-semibold font-display tracking-widest mt-0.5 uppercase">{t.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logo Ticker Bar */}
      <section className="py-12 bg-slate-50/50 border-b border-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-display mb-6">
            Trusted by Leading Enterprises
          </p>
          
          <div className="relative w-full flex items-center">
            {/* Infinite Horizontal Logo Scroll */}
            <div className="flex space-x-12 whitespace-nowrap min-w-full justify-between items-center opacity-40" style={{ animation: 'marquee 20s linear infinite' }}>
              {logos.map((logo, index) => (
                <span key={index} className="text-sm font-black font-display tracking-widest text-[#0a1628]">
                  {logo}
                </span>
              ))}
              {logos.map((logo, index) => (
                <span key={`dup-${index}`} className="text-sm font-black font-display tracking-widest text-[#0a1628]">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
