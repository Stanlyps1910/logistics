import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRight, ShieldCheck, Scale, Ruler, Plane, Ship, Truck, Navigation, Receipt } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function QuoteCalculator() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    freightType: "road",
    insurance: false,
  });

  const [quoteResult, setQuoteResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateQuote = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setQuoteResult(null);

    // Simulate network telemetry computation delay
    setTimeout(() => {
      if (!mountedRef.current) return;
      const weightVal = parseFloat(formData.weight) || 1;
      const l = parseFloat(formData.length) || 10;
      const w = parseFloat(formData.width) || 10;
      const h = parseFloat(formData.height) || 10;
      
      // Dimensional weight calculation formula: (L * W * H) / 5000
      const dimensionalWeight = (l * w * h) / 5000;
      const billableWeight = Math.max(weightVal, dimensionalWeight);

      const rates = {
        road: { rate: 1.25, time: "2 - 3 Operations Days" },
        air: { rate: 4.80, time: "6 - 12 Hours (Sub-orbital)" },
        ocean: { rate: 0.75, time: "10 - 14 Operations Days" },
        drone: { rate: 8.50, time: "1 - 2 Hours (Local VTOL Drone)" },
      };
      const { rate: ratePerKg, time: deliveryTime } = rates[formData.freightType] || rates.road;

      const basePrice = billableWeight * ratePerKg;
      const fuelSurcharge = basePrice * 0.08; // 8%
      const regulatoryFee = 15.00;
      const insuranceCost = formData.insurance ? Math.max(basePrice * 0.02, 25.00) : 0; // 2% of cost or min $25
      
      const totalPrice = basePrice + fuelSurcharge + regulatoryFee + insuranceCost;

      setQuoteResult({
        baseRate: basePrice.toFixed(2),
        fuel: fuelSurcharge.toFixed(2),
        fees: regulatoryFee.toFixed(2),
        insurance: insuranceCost.toFixed(2),
        total: totalPrice.toFixed(2),
        time: deliveryTime,
        billableWeight: billableWeight.toFixed(1)
      });
      setIsCalculating(false);
    }, 1200);
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-black uppercase tracking-widest text-primary mb-4 font-display">
            <Calculator className="w-3.5 h-3.5" />
            <span>Delivery Rate Calculator</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tight leading-none mb-6">
            RATE CALCULATOR
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Estimate shipping costs, transit times, and dimensional weight parameters instantly.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Form Panel */}
          <div className="glass-card p-8 rounded-3xl border border-blue-100 bg-white/70">
            <h2 className="text-xl font-bold font-display uppercase tracking-wide text-dark mb-6 border-b border-slate-100 pb-2">
              Route Details
            </h2>

            <form onSubmit={calculateQuote} className="space-y-6">
              
              {/* Origin and Destination inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                    Origin City
                  </label>
                  <input
                    type="text"
                    name="origin"
                    placeholder="e.g. Bengaluru (BLR)"
                    value={formData.origin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                    Destination City
                  </label>
                  <input
                    type="text"
                    name="destination"
                    placeholder="e.g. Mumbai (BOM)"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Mode Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-3">
                  Shipping Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "road", label: "Road convoy", icon: <Truck className="w-4 h-4" /> },
                    { id: "air", label: "Sub-orbital", icon: <Plane className="w-4 h-4" /> },
                    { id: "ocean", label: "Sea fleet", icon: <Ship className="w-4 h-4" /> },
                    { id: "drone", label: "VTOL drone", icon: <Navigation className="w-4 h-4" /> }
                  ].map((mode) => (
                    <label
                      key={mode.id}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        formData.freightType === mode.id
                          ? "border-primary bg-blue-50/50 text-primary font-bold shadow-[0_0_10px_rgba(0,71,204,0.1)]"
                          : "border-slate-100 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="freightType"
                        value={mode.id}
                        checked={formData.freightType === mode.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {mode.icon}
                      <span className="text-[10px] uppercase font-display tracking-wider mt-2">{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cargo specs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                    <Scale className="w-3.5 h-3.5 text-slate-400" /> Mass (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="25"
                    min="1"
                    step="any"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                    required
                  />
                </div>

                <div className="sm:col-span-3 grid grid-cols-3 gap-2">
                  <div className="col-span-3">
                    <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-2">
                      <Ruler className="w-3.5 h-3.5 text-slate-400" /> Dimensions (L x W x H in cm)
                    </label>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="length"
                      placeholder="L"
                      min="1"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="width"
                      placeholder="W"
                      min="1"
                      value={formData.width}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="height"
                      placeholder="H"
                      min="1"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary text-sm font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Extra configurations */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="insurance"
                  name="insurance"
                  checked={formData.insurance}
                  onChange={handleChange}
                  className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="insurance" className="ml-2.5 text-sm font-semibold text-slate-600 select-none cursor-pointer">
                  Add cargo insurance coverage (up to $10,000) (+2% or min $25)
                </label>
              </div>

              {/* Action button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold uppercase tracking-wider font-display rounded-xl shadow-[0_4px_15px_rgba(0,71,204,0.2)] disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Calculating Rates...</span>
                  </>
                ) : (
                  <>
                    <span>Calculate Rate</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Pricing Result Card */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {quoteResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-8 rounded-3xl border border-secondary/30 bg-white shadow-[0_12px_40px_rgba(0,71,204,0.15)] flex flex-col justify-between h-full relative overflow-hidden"
                >
                  {/* Subtle Top highlight bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-xl font-bold font-display uppercase tracking-wide text-dark flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary" /> Pricing Breakdown
                      </h3>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[10px] font-black font-display text-primary uppercase tracking-widest">
                        ESTIMATE
                      </span>
                    </div>

                    <div className="space-y-4 mb-8 text-sm">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Origin</span>
                        <span className="font-bold text-dark uppercase">{formData.origin}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Destination</span>
                        <span className="font-bold text-dark uppercase">{formData.destination}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Billable Weight</span>
                        <span className="font-display font-bold text-dark">{quoteResult.billableWeight} kg</span>
                      </div>
                      
                      <div className="border-t border-slate-100 my-4"></div>

                      <div className="flex justify-between items-center text-slate-500">
                        <span>Base Shipping Rate</span>
                        <span className="font-display font-medium text-dark">${quoteResult.baseRate}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Fuel Surcharge (8%)</span>
                        <span className="font-display font-medium text-dark">${quoteResult.fuel}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Customs & Handling Fee</span>
                        <span className="font-display font-medium text-dark">${quoteResult.fees}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Insurance Premium</span>
                        <span className="font-display font-medium text-dark">${quoteResult.insurance}</span>
                      </div>

                      <div className="border-t border-slate-100 my-4"></div>

                      <div className="flex justify-between items-center text-slate-500">
                        <span>Estimated Delivery Time</span>
                        <span className="font-display font-bold text-primary uppercase text-xs">{quoteResult.time}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Glowing price display */}
                    <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between mb-6">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-display">Estimated Total</span>
                      <span className="text-3xl font-black text-primary font-display">${quoteResult.total}</span>
                    </div>

                    <button
                      onClick={() => alert("Mock Booking: Shipment request logged successfully.")}
                      className="w-full py-3.5 bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider font-display rounded-xl shadow-md transition-colors cursor-pointer text-center"
                    >
                      Book Shipment
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 min-h-[300px]">
                  <Calculator className="w-12 h-12 text-slate-300 mb-4" />
                  <h4 className="font-bold text-dark font-display text-base uppercase mb-2">Enter Shipment Details</h4>
                  <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                    Enter origin, destination, weight, and dimensions, then click 'Calculate Rate' to view the breakdown.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Shipping Guideline notes */}
        <div className="glass-card p-6 rounded-2xl border border-blue-100/50 bg-white/50 flex items-center gap-4">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
          <p className="text-slate-500 text-xs leading-relaxed">
            All generated rates represent estimates. Final booking costs may vary based on route, current fuel prices, and customs duties.
          </p>
        </div>

      </div>
    </motion.main>
  );
}
