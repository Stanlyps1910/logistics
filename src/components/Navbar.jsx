import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Shield, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [portalDropdown, setPortalDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setPortalDropdown(false);
  }, [location]);

  // Close portal dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setPortalDropdown(false);
    if (portalDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [portalDropdown]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            ? "bg-white/80 backdrop-blur-md border-b border-blue-100/50 shadow-[0_4px_20px_rgba(0,71,204,0.03)] py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <Logo className="h-12 md:h-16 w-auto transition-transform duration-300 group-hover:scale-[1.03]" />
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

            {/* Right side: Portal + CTA */}
            <div className="hidden md:flex items-center gap-2">
              {/* Portal Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPortalDropdown(!portalDropdown);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                    isAuthenticated
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-display">{user.name.split(" ")[0]}</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5" />
                      <span className="font-display">Portal</span>
                    </>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${portalDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {portalDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md border border-blue-100/60 rounded-xl shadow-[0_12px_40px_rgba(0,71,204,0.12)] overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isAuthenticated ? (
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-blue-50 mb-1">
                            <p className="text-xs font-bold text-dark font-display">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-sans">{user.email}</p>
                            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-display">
                              Admin
                            </span>
                          </div>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 rounded-lg transition-colors font-sans"
                          >
                            <Shield className="w-4 h-4 text-primary" />
                            My Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors font-sans"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="p-2">
                          <Link
                            to="/admin/login"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 rounded-lg transition-colors font-sans"
                          >
                            <Shield className="w-4 h-4 text-primary" />
                            Admin Login
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Track CTA */}
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

                {/* Portal Links (Mobile) */}
                <div className="pt-2 border-t border-blue-100 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 mb-2">
                        <p className="text-xs font-bold text-dark font-display">{user.name}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-display">
                          Admin
                        </span>
                      </div>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-3 rounded-lg font-bold font-display text-lg uppercase tracking-wider text-primary hover:bg-blue-50 transition-all"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-3 rounded-lg font-bold font-display text-lg uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/admin/login"
                        className="block px-4 py-3 rounded-lg font-bold font-display text-lg uppercase tracking-wider text-slate-600 hover:bg-blue-50 hover:text-primary transition-all"
                      >
                        Admin Login
                      </Link>
                    </>
                  )}
                </div>

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
