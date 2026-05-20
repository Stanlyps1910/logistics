import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Global Components
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Page Components
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Tracker from "./pages/Tracker";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";

// Component to scroll page to top on route transitions
function ScrollToTopOnRoute() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <ScrollToTopOnRoute />
      
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          
          {/* Main content wrapper */}
          <div className="flex-grow">
            <AnimatedRoutes />
          </div>
          
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </Router>
  );
}
