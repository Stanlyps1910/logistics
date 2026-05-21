import { Link } from "react-router-dom";
import { 
  Send, 
  ShieldCheck,  
  Award, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";

// Custom Social Icon Components to bypass missing Lucide-React v1 exports
const Linkedin = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Facebook = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-white pt-16 pb-8 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white font-display font-black text-base">
                N
              </div>
              <span className="text-lg font-bold tracking-tight font-display">
                NEXA<span className="text-secondary">FREIGHT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Propelling global commerce forward with reliable scheduling, optimized route mapping, and temperature-controlled logistics.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>NexaFreight Logistics HQ, 5th Block, Koramangala, Bengaluru, KA 560095, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+91 (80) 555-NEXA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>connect@nexafreight.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider font-display text-white mb-6 border-l-2 border-secondary pl-3">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home Dashboard</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">Logistics Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">Corporate Structure</Link>
              </li>
              <li>
                <Link to="/tracker" className="text-slate-400 hover:text-white transition-colors">Real-time Tracker</Link>
              </li>
              <li>
                <Link to="/calculator" className="text-slate-400 hover:text-white transition-colors">Quote Estimator</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Get In Touch</Link>
              </li>
            </ul>
          </div>

          {/* Services Portfolio */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider font-display text-white mb-6 border-l-2 border-secondary pl-3">
              Core Operations
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Road Transport</li>
              <li>Fast Air Shipping</li>
              <li>Sea Cargo</li>
              <li>Automated Storage & Packing</li>
              <li>Local Courier & Delivery</li>
              <li>Temperature-Controlled Shipping</li>
            </ul>
          </div>

          {/* Newsletter and Certifications */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider font-display text-white mb-4 border-l-2 border-secondary pl-3">
                Stay Updated
              </h3>
              <p className="text-slate-400 text-xs mb-3">
                Subscribe for network upgrades and supply chain insights.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-blue-900 rounded-l-md text-white focus:outline-none focus:border-secondary"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-secondary text-white px-3.5 rounded-r-md transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Certification Badges */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Compliance Standards
              </h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/50 border border-blue-950 text-slate-300 text-[10px] font-bold uppercase font-display tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>ISO 9001</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900/50 border border-blue-950 text-slate-300 text-[10px] font-bold uppercase font-display tracking-wider">
                  <Award className="w-3.5 h-3.5 text-secondary" />
                  <span>TAPA Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-950 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div>
            &copy; {currentYear} NexaFreight Logistics Inc. All rights reserved.
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer">Security Protocol</span>
            <span className="hover:text-white cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
