import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Shield } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Tracker", path: "/tracker" },
    { name: "Calculator", path: "/calculator" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-blue-100/50 shadow-[0_4px_20px_rgba(0,71,204,0.03)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative w-9 h-9 flex items-center justify-center bg-primary rounded-lg shadow-[0_4px_12px_rgba(0,71,204,0.2)] overflow-hidden">
                {/* Glowing inner network nodes */}
                <span className="text-white font-display font-black text-lg">N</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-display font-black text-lg">N</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-dark font-display">
                NEXA<span className="text-primary">FREIGHT</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-bold font-display uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-slate-600 hover:text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/tracker"
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-primary rounded-lg overflow-hidden group shadow-[0_4px_15px_rgba(0,71,204,0.2)] hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:opacity-0"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary to-highlight opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                <span className="relative z-10 flex items-center gap-1.5">
                  Track Shipment <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-700 hover:text-primary focus:outline-none p-1.5 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/20 backdrop-blur-md z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            {/* Drawer Menu */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className="bg-white/95 border-b border-blue-100 shadow-2xl pt-24 pb-8 px-4 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-bold font-display text-lg uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-blue-50 text-primary border-l-4 border-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 px-4">
                  <Link
                    to="/tracker"
                    className="w-full flex items-center justify-center py-3 text-sm font-bold uppercase tracking-wider text-white bg-primary rounded-lg shadow-md"
                  >
                    Track Shipment
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
