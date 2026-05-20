import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Clock, Box, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const mockDatabase = {
  "NX-4820-T1": {
    id: "NX-4820-T1",
    status: "Delivered",
    step: 5,
    origin: "Tokyo Hub (NRT-1)",
    destination: "Bengaluru Corporate Portal (BLR-4)",
    eta: "Delivered on May 19, 2026",
    carrier: "NexaAir Autonomous Flight 802",
    weight: "14.5 kg",
    dimensions: "40 x 30 x 25 cm",
    history: [
      { step: 1, label: "Picked Up", date: "May 17, 2026 - 08:30 AM", loc: "Tokyo Hub" },
      { step: 2, label: "In Transit", date: "May 17, 2026 - 11:15 PM", loc: "Indo-Pacific Air Corridor" },
      { step: 3, label: "Customs Clearance", date: "May 18, 2026 - 09:40 AM", loc: "Kempegowda Intl Airport Customs Gate C" },
      { step: 4, label: "Out for Delivery", date: "May 19, 2026 - 07:15 AM", loc: "Bengaluru Koramangala Hub Platoon #4" },
      { step: 5, label: "Delivered", date: "May 19, 2026 - 02:45 PM", loc: "Corporate Portal, Sector 9 (Koramangala)" }
    ]
  },
  "NX-1938-C5": {
    id: "NX-1938-C5",
    status: "Customs Clearance",
    step: 3,
    origin: "Mumbai Port Terminal (BOM-2)",
    destination: "Bengaluru Whitefield Hub (BLR-2)",
    eta: "Estimated: May 22, 2026",
    carrier: "NexaRoad Autonomous Platoon #40",
    weight: "240.0 kg",
    dimensions: "120 x 80 x 95 cm",
    history: [
      { step: 1, label: "Picked Up", date: "May 15, 2026 - 10:00 AM", loc: "Mumbai Factory Gate A" },
      { step: 2, label: "In Transit", date: "May 16, 2026 - 04:30 PM", loc: "Mumbai-Bengaluru Autonomous Expressway" },
      { step: 3, label: "Customs Clearance", date: "May 20, 2026 - 10:15 AM", loc: "Inland Container Depot, Bengaluru" },
      { step: 4, label: "Out for Delivery", date: "Pending", loc: "Bengaluru Hub" },
      { step: 5, label: "Delivered", date: "Pending", loc: "Destination" }
    ]
  },
  "NX-9274-P9": {
    id: "NX-9274-P9",
    status: "Picked Up",
    step: 1,
    origin: "Bengaluru Kempegowda Hub (BLR-1)",
    destination: "Chennai Cargo Gate (MAA-5)",
    eta: "Estimated: May 21, 2026",
    carrier: "Autonomous Road Platoon #18",
    weight: "3.2 kg",
    dimensions: "20 x 20 x 15 cm",
    history: [
      { step: 1, label: "Picked Up", date: "May 20, 2026 - 03:00 PM", loc: "Bengaluru Hub Dispatch" },
      { step: 2, label: "In Transit", date: "Pending", loc: "Bengaluru-Chennai Expressway Corridor" },
      { step: 3, label: "Customs Clearance", date: "Pending", loc: "Chennai Customs Node" },
      { step: 4, label: "Out for Delivery", date: "Pending", loc: "Chennai Hub Platoon" },
      { step: 5, label: "Delivered", date: "Pending", loc: "Corporate Portal" }
    ]
  }
};

export default function Tracker() {
  const [trackingId, setTrackingId] = useState("");
  const [activeTracking, setActiveTracking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const id = trackingId.trim().toUpperCase();
    if (mockDatabase[id]) {
      setActiveTracking(mockDatabase[id]);
      setErrorMsg("");
    } else {
      setErrorMsg(`Tracking ID "${id}" was not recognized in our database. Verify the coordinates.`);
      setActiveTracking(null);
    }
  };

  const loadDemo = (id) => {
    setTrackingId(id);
    setActiveTracking(mockDatabase[id]);
    setErrorMsg("");
  };

  const steps = [
    { num: 1, label: "Picked Up" },
    { num: 2, label: "In Transit" },
    { num: 3, label: "Customs" },
    { num: 4, label: "Out for Delivery" },
    { num: 5, label: "Delivered" }
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
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <Box className="w-3.5 h-3.5" />
            <span>Shipment Tracking System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            SHIPMENT TRACKER
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Track shipment locations, customs clearance progress, and delivery timelines instantly.
          </p>
        </div>

        {/* Dashboard Form & Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          
          {/* Tracking Search Input Card */}
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-blue-100 bg-white/70">
            <h3 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6">
              Track Shipment
            </h3>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. NX-4820-T1)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 text-slate-800 bg-white font-display font-medium uppercase tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:normal-case placeholder:font-sans placeholder:tracking-normal text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider font-display rounded-xl shadow-[0_4px_15px_rgba(0,71,204,0.2)] transition-colors text-base"
              >
                Track Status
              </button>
            </form>

            {errorMsg && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick Demo Selector */}
          <div className="glass-card p-8 rounded-3xl border border-blue-100 bg-white/70">
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-slate-500 mb-4">
              Sample Shipments
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select a sample shipment to see the tracking timeline in action:
            </p>
            <div className="space-y-3">
              {[
                { id: "NX-4820-T1", label: "Delivered shipment node", statusColor: "text-green-500" },
                { id: "NX-1938-C5", label: "In customs clearance queue", statusColor: "text-blue-500" },
                { id: "NX-9274-P9", label: "Newly registered package node", statusColor: "text-yellow-500" }
              ].map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => loadDemo(demo.id)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-primary/30 bg-white hover:bg-slate-50 text-left font-display font-bold uppercase tracking-wider text-sm transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-dark">{demo.id}</span>
                    <span className="text-[10px] text-slate-400 font-sans normal-case tracking-normal">{demo.label}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    Track <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Screen with Animated Tracking Timeline */}
        {activeTracking && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 rounded-3xl border border-blue-100 bg-white"
          >
            {/* Telemetry diagnostics header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-8 gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                  Shipment ID
                </span>
                <h2 className="text-2xl font-black text-dark font-display uppercase mt-1">
                  {activeTracking.id}
                </h2>
              </div>

              <div className="flex gap-4">
                <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-display">Carrier</span>
                  <span className="text-xs font-bold text-dark font-display mt-0.5">{activeTracking.carrier}</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-display">Estimated Delivery</span>
                  <span className="text-xs font-bold text-primary font-display mt-0.5">{activeTracking.eta}</span>
                </div>
              </div>
            </div>

            {/* Dimensional stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 mb-10 text-sm">
              <div>
                <span className="block text-xs font-semibold text-slate-400">Origin</span>
                <span className="font-bold text-dark mt-1 block">{activeTracking.origin}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400">Destination</span>
                <span className="font-bold text-dark mt-1 block">{activeTracking.destination}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400">Weight</span>
                <span className="font-bold text-dark mt-1 block">{activeTracking.weight}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400">Dimensions</span>
                <span className="font-bold text-dark mt-1 block">{activeTracking.dimensions}</span>
              </div>
            </div>

            {/* Timeline Graphic Steps */}
            <div className="mb-12">
              <h3 className="text-lg font-bold font-display uppercase tracking-wide text-dark mb-6">
                Shipment Progress
              </h3>
              
              <div className="relative">
                {/* Horizontal connector line for large screens */}
                <div className="hidden md:block absolute left-0 right-0 top-6 h-1 bg-slate-200 rounded-full z-0">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((activeTracking.step - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                  {steps.map((step) => {
                    const isDone = step.num <= activeTracking.step;
                    const isCurrent = step.num === activeTracking.step;
                    const details = activeTracking.history.find(h => h.step === step.num);

                    return (
                      <div key={step.num} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0">
                        {/* Circle Badge Indicator */}
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-display font-black text-sm z-10 shrink-0 ${
                            isDone 
                              ? "bg-primary border-blue-200 text-white shadow-[0_0_15px_rgba(0,71,204,0.3)]" 
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : step.num}
                        </motion.div>

                        {/* Text descriptions */}
                        <div className="md:mt-4 flex-grow">
                          <h4 className={`font-display font-bold text-sm uppercase tracking-wide ${isDone ? "text-dark" : "text-slate-400"}`}>
                            {step.label}
                          </h4>
                          {details && details.date !== "Pending" && (
                            <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                              <div className="flex items-center md:justify-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                <span>{details.date.split(" - ")[0]}</span>
                              </div>
                              <div className="flex items-center md:justify-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                <span>{details.date.split(" - ")[1] || "—"}</span>
                              </div>
                              <div className="flex items-center md:justify-center gap-1.5 font-semibold text-primary">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                                <span>{details.loc}</span>
                              </div>
                            </div>
                          )}
                          {(!details || details.date === "Pending") && (
                            <p className="text-xs text-slate-400 mt-1 italic">Awaiting Update</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
