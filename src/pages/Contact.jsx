import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react";
import FAQAccordion from "../components/FAQAccordion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const offices = [
  {
    city: "Bengaluru HQ",
    address: "431, Immaculate, HMT, Nagasandra Post, Bengaluru Urban, Karnataka - 560073",
    phone: "+91 96200 12227",
    mail: "info@sriranga.in"
  },
  {
    city: "Operations Hub",
    address: "Bengaluru Rural Terminal, HMT Estate, Karnataka - 562123",
    phone: "+91 96200 12227",
    mail: "ops@sriranga.in"
  }
];

const departments = [
  { name: "Full Truckload & Upcountry", contact: "ftl@sriranga.in" },
  { name: "Intra-City & Relocations", contact: "shifting@sriranga.in" },
  { name: "Specialized & ODC Cargo", contact: "odc@sriranga.in" },
  { name: "General Inquiries", contact: "info@sriranga.in" }
];

const faqsList = [
  {
    question: "How is my shipment route planned and tracked?",
    answer: "We map your shipment using our route planning system, which monitors weather patterns, port congestion, and highway traffic to select the fastest, most reliable paths."
  },
  {
    question: "How do you guarantee cargo safety during transit?",
    answer: "Our fleets are monitored in real-time, drivers are professionally trained, and cargo is fully insured and verified at every transition checkpoint."
  },
  {
    question: "Can I modify shipping routes after my cargo has departed?",
    answer: "Yes. You can contact our operations support team or use our digital portal to request address updates, warehouse holds, or shipping redirects while in transit."
  },
  {
    question: "Do you offer eco-friendly logistics options?",
    answer: "Yes. Sri Ranga Logistics actively deploys EV and CNG vehicles in our intra-city fleet to help corporate clients achieve their sustainability goals."
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "Route Planning & Tracking",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    // E.164 Country Code validation: starts with + followed by 1-3 digits country code, then 6-12 digits
    const whatsappPattern = /^\+[1-9]\d{1,3}\d{6,14}$/;
    const cleanedWhatsapp = formData.whatsapp.replace(/[\s-()]/g, ""); // Strip spaces, hyphens, parentheses

    if (!whatsappPattern.test(cleanedWhatsapp)) {
      setErrorMsg("WhatsApp number must include country code starting with '+' (e.g. +919876543210 or +15551234567).");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsapp: cleanedWhatsapp,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Your inquiry has been received. Our team will contact you shortly.");
        setFormData({
          name: "",
          email: "",
          whatsapp: "",
          subject: "Route Planning & Tracking",
          message: ""
        });
      } else {
        setErrorMsg(data.message || "Failed to process quote query.");
      }
    } catch {
      setErrorMsg("Failed to connect to the server. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {offices.map((office, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-emerald-100 bg-white/70">
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
              <div className="glass-card p-6 rounded-2xl border border-emerald-100 bg-white/70 space-y-3">
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
          <div className="glass-card p-8 rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-500/5">
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6 border-b border-slate-100 pb-2">
              Send Us a Message
            </h2>

            {errorMsg && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-sans">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alexis Thorne"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alexis@corporation.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +91 96200 12227"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Inquiry Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                >
                  <option>Route Planning & Tracking</option>
                  <option>Eco-Friendly EV & CNG Fleet</option>
                  <option>Household & Shifting Relocation</option>
                  <option>Partnerships & Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider font-display rounded-xl shadow-[0_4px_15px_rgba(0,76,41,0.2)] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Embedded Map Placeholder and FAQ Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Map Placeholder */}
          <div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6">
              Our Logistics Network Map
            </h2>
            <div className="glass-card p-6 rounded-3xl border border-emerald-100 bg-white/70 aspect-video flex flex-col justify-center items-center relative overflow-hidden">
              
              {/* Decorative grid background for mock map */}
              <div className="absolute inset-0 grid-lines opacity-60"></div>
              
              {/* Mock map graphics */}
              <svg className="w-full h-full relative z-10 opacity-75" viewBox="0 0 500 280">
                {/* Landmass outline sketches */}
                <path d="M50 80 Q90 90 120 70 T180 110 T250 80" fill="none" stroke="rgba(0, 76, 41, 0.1)" strokeWidth="8" strokeLinecap="round" />
                <path d="M300 150 Q350 180 400 140 T480 190" fill="none" stroke="rgba(0, 76, 41, 0.1)" strokeWidth="12" strokeLinecap="round" />
                
                {/* Connecting lines */}
                <path d="M120 70 L350 180 L250 80 Z" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" strokeDasharray="5 5" />
                
                {/* Pulse circles for nodes */}
                <circle cx="120" cy="70" r="5" fill="#004c29" />
                <circle cx="120" cy="70" r="12" stroke="#004c29" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" style={{ transformOrigin: "120px 70px" }} />
                
                <circle cx="350" cy="180" r="5" fill="#10b981" />
                <circle cx="250" cy="80" r="5" fill="#004c29" />
              </svg>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-emerald-100 flex justify-between items-center z-20 shadow-md">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">Location Coordinates</span>
                  <span className="block font-bold text-dark text-xs font-display">LAT 12.9716 / LON 77.5946</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary font-display border border-primary/20 px-2 py-1 rounded bg-emerald-50">
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
