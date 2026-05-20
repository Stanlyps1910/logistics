import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare } from "lucide-react";
import FAQAccordion from "../components/FAQAccordion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const offices = [
  {
    city: "Bengaluru (HQ)",
    address: "Koramangala 5th Block, Bengaluru, KA 560095",
    phone: "+91 (80) 555-NEXA",
    mail: "hq@nexafreight.com"
  },
  {
    city: "Mumbai Terminal",
    address: "JNPT Cargo Center, Sector 4, Navi Mumbai, MH",
    phone: "+91 (22) 555-NEXA",
    mail: "bom@nexafreight.com"
  },
  {
    city: "New Delhi Node",
    address: "IGI Cargo Terminal, Phase 2, New Delhi, DL",
    phone: "+91 (11) 555-NEXA",
    mail: "del@nexafreight.com"
  }
];

const departments = [
  { name: "Autonomous Road Platoon", contact: "platoons@nexafreight.com" },
  { name: "Hypersonic & Sub-orbital Operations", contact: "aerospace@nexafreight.com" },
  { name: "Biotech Cryogenic Support", contact: "coldchain@nexafreight.com" },
  { name: "General Administration", contact: "connect@nexafreight.com" }
];

const faqsList = [
  {
    question: "What is the Autonomous Logistics Protocol?",
    answer: "Our autonomous system connects GPS payload coordinates directly with electric freight convoys and delivery drones. This removes traditional human dispatch lag and optimizes speed."
  },
  {
    question: "How does the Biotech Cold Chain guarantee temperature safety?",
    answer: "Every cold chain container has redundant battery backup modules, emergency nitrogen cooling valves, and real-time satellite telemetry that flags dispatch of a 0.5°C deviation."
  },
  {
    question: "Can I modify shipping routes after cargo dispatch?",
    answer: "Yes. Using our secure tracker dashboard, cargo managers can override autonomous pathing variables and request terminal redirects or warehouse holds in transit."
  },
  {
    question: "What occurs if custom clearances are delayed?",
    answer: "Our AI systems pre-verify shipping invoices and manifest documentation against customs databases 24 hours prior to arrival, decreasing delayed clearance events to under 0.005%."
  }
];

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message node received. NexaFreight response queue initialized.");
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container pt-32 pb-24 grid-lines"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            CONTACT US
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Get in touch with our operations teams, customer support, and regional coordinators.
          </p>
        </div>

        {/* Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          
          {/* Left Column: Office details & Department lists */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-black text-dark font-display uppercase tracking-tight mb-6">
                Our Offices
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {offices.map((office, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-blue-100 bg-white/70">
                    <h3 className="font-bold text-dark font-display text-sm uppercase mb-3">
                      {office.city}
                    </h3>
                    <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{office.mail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-4">
                Key Departments
              </h3>
              <div className="glass-card p-6 rounded-2xl border border-blue-100 bg-white/70 space-y-3">
                {departments.map((dept, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center text-sm py-2.5 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="font-display font-bold text-primary truncate">{dept.contact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card p-8 rounded-3xl border border-blue-100 bg-white">
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6 border-b border-slate-100 pb-2">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alexis Thorne"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. alexis@corporation.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Inquiry Subject
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer">
                  <option>Route Planning & Tracking</option>
                  <option>Cold Chain Cargo</option>
                  <option>Customs Clearance & Documentation</option>
                  <option>Partnerships & Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Message
                </label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider font-display rounded-xl shadow-[0_4px_15px_rgba(0,71,204,0.2)] transition-colors flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Embedded Map Placeholder and FAQ Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Map Placeholder */}
          <div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6">
              Our Global Coverage Map
            </h2>
            <div className="glass-card p-6 rounded-3xl border border-blue-100 bg-white/70 aspect-video flex flex-col justify-center items-center relative overflow-hidden">
              
              {/* Decorative grid background for mock map */}
              <div className="absolute inset-0 grid-lines opacity-60"></div>
              
              {/* Mock map graphics */}
              <svg className="w-full h-full relative z-10 opacity-75" viewBox="0 0 500 280">
                {/* Landmass outline sketches */}
                <path d="M50 80 Q90 90 120 70 T180 110 T250 80" fill="none" stroke="rgba(0, 71, 204, 0.1)" strokeWidth="8" strokeLinecap="round" />
                <path d="M300 150 Q350 180 400 140 T480 190" fill="none" stroke="rgba(0, 71, 204, 0.1)" strokeWidth="12" strokeLinecap="round" />
                
                {/* Connecting lines */}
                <path d="M120 70 L350 180 L250 80 Z" stroke="rgba(0, 180, 216, 0.25)" strokeWidth="1.5" strokeDasharray="5 5" />
                
                {/* Pulse circles for nodes */}
                <circle cx="120" cy="70" r="5" fill="#0047cc" />
                <circle cx="120" cy="70" r="12" stroke="#0047cc" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" style={{ transformOrigin: "120px 70px" }} />
                
                <circle cx="350" cy="180" r="5" fill="#00b4d8" />
                <circle cx="250" cy="80" r="5" fill="#0047cc" />
              </svg>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-blue-100 flex justify-between items-center z-20 shadow-md">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">Location Coordinates</span>
                  <span className="block font-bold text-dark text-xs font-display">LAT 12.9716 / LON 77.5946</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary font-display border border-primary/20 px-2 py-1 rounded bg-blue-50">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Column */}
          <div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> Operations FAQs
            </h2>
            <FAQAccordion faqs={faqsList} />
          </div>

        </div>

      </div>
    </motion.main>
  );
}
