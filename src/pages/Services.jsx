import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Truck, 
  Plane, 
  Ship, 
  Database, 
  Navigation, 
  ThermometerSnowflake, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2
} from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Services() {
  const servicesList = [
    {
      id: "road",
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Road Transport",
      subtitle: "Reliable Road Fleets",
      description: "Modern cargo trucks and professional drivers utilizing optimized routes to deliver your goods safely and on time across major national highways.",
      stats: { metric: "24/7", label: "Continuous Support" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,71,204,0.14)]"
    },
    {
      id: "air",
      icon: <Plane className="w-8 h-8 text-primary" />,
      title: "Fast Air Shipping",
      subtitle: "Domestic & International Air Cargo",
      description: "Priority air freight utilizing direct routes and quick airport processing to deliver urgent shipments across major business hubs rapidly.",
      stats: { metric: "< 24 Hrs", label: "Express Delivery" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,180,216,0.14)]"
    },
    {
      id: "ocean",
      icon: <Ship className="w-8 h-8 text-primary" />,
      title: "Sea Cargo",
      subtitle: "Container Shipping & Cargo Ports",
      description: "Reliable ocean transport with real-time GPS tracking and cargo monitoring to handle large-volume commercial shipments safely.",
      stats: { metric: "100%", label: "Cargo Tracking" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,71,204,0.14)]"
    },
    {
      id: "warehouse",
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "Automated Storage & Packing",
      subtitle: "Smart Warehouse Management",
      description: "Modern distribution centers utilizing digital inventory tracking and automated sorting systems to store and package products with high speed and accuracy.",
      stats: { metric: "99.98%", label: "Sorting Accuracy" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,180,216,0.14)]"
    },
    {
      id: "lastmile",
      icon: <Navigation className="w-8 h-8 text-primary" />,
      title: "Local Courier & Delivery",
      subtitle: "Last-Mile Distribution",
      description: "Dedicated local courier network using bikes and delivery vehicles to navigate city traffic and bring packages straight to your doorstep.",
      stats: { metric: "Same Day", label: "Local Delivery" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,71,204,0.14)]"
    },
    {
      id: "coldchain",
      icon: <ThermometerSnowflake className="w-8 h-8 text-primary" />,
      title: "Temperature-Controlled Shipping",
      subtitle: "Refrigerated Logistics",
      description: "Specialized cold chain transport for perishable goods, food items, and medical supplies requiring precise temperature-controlled environments.",
      stats: { metric: "2°C to 8°C", label: "Temperature Control" },
      glow: "hover:shadow-[0_15px_40px_rgba(0,180,216,0.14)]"
    }
  ];

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container pt-32 pb-24 grid-lines"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Our Logistics Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            OUR SERVICES
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Deploying modern vehicle fleets, advanced tracking, and robotic sorting systems to guarantee fast global shipping and storage.
          </p>
        </div>

        {/* 6 Services Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesList.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                borderColor: "rgba(0, 180, 216, 0.4)",
              }}
              className={`glass-card p-8 rounded-2xl border border-blue-100 flex flex-col justify-between bg-white/70 transition-all duration-300 relative group cursor-pointer ${service.glow}`}
            >
              {/* Shimmer element on card hover */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-150%] w-[50%] h-full bg-gradient-to-r from-transparent via-cyan-100/10 to-transparent skew-x-[-25deg] transition-all duration-1000 group-hover:left-[150%]" />
              </div>

              <div>
                {/* Header Icon */}
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  {React.cloneElement(service.icon, {
                    className: "w-7 h-7 text-primary group-hover:text-white transition-colors duration-300"
                  })}
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
                    {service.subtitle}
                  </span>
                  <h3 className="text-xl font-bold font-display uppercase tracking-wide text-dark mt-1 mb-3">
                    {service.title}
                  </h3>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {service.description}
                </p>
              </div>

              {/* Stats Bar & Action */}
              <div className="pt-6 border-t border-slate-100/50 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-primary font-display leading-none">
                    {service.stats.metric}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display mt-1">
                    {service.stats.label}
                  </div>
                </div>

                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Security / Tracking Guarantee Bar */}
        <div className="mt-16 glass-card p-6 rounded-2xl border border-blue-100/50 bg-gradient-to-r from-[#f0f4ff]/50 to-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50/50 flex items-center justify-center text-primary border border-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-dark font-display text-base uppercase">Secure Cargo Guarantee</h4>
              <p className="text-slate-500 text-xs mt-0.5">Every shipment is fully insured, monitored in real-time, and verified at every checkpoint for complete safety.</p>
            </div>
          </div>
          <Link
            to="/tracker"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider font-display rounded-lg shadow-md hover:bg-secondary transition-all"
          >
            Track Your Shipment <Zap className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
