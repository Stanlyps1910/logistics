import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Auth
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/ProtectedRoute";

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

// Portal Pages
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

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
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/dashboard" element={
          <ProtectedRoute requiredRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/client/dashboard" || pathname === "/admin/dashboard";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-grow">
        <AnimatedRoutes />
      </div>
      {!isDashboard && <Footer />}
      {!isDashboard && <ScrollToTop />}
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderComplete = useCallback(() => setIsLoading(false), []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTopOnRoute />
        {isLoading ? (
          <Loader onComplete={handleLoaderComplete} />
        ) : (
          <ChatProvider>
            <Layout />
          </ChatProvider>
        )}
      </Router>
    </AuthProvider>
  );
}
