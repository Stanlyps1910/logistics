import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import ChatBox from "../components/ChatBox";
import {
  BarChart3, Package, Users, IndianRupee, TrendingUp, TrendingDown,
  MapPin, ChevronDown, Shield, UserCheck, UserX,
  RefreshCw, Plus, X, MessageSquare, Mail, Building2, User,
  UserPlus, Lock, LayoutDashboard, ArrowRight,
} from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
};

const STATUS_OPTIONS = ["Picked Up", "In Transit", "Customs Clearance", "Out for Delivery", "Delivered"];

const statusColors = {
  "Picked Up": "bg-amber-100 text-amber-700 border border-amber-300",
  "In Transit": "bg-blue-100 text-blue-700 border border-blue-300",
  "Customs Clearance": "bg-purple-100 text-purple-700 border border-purple-300",
  "Out for Delivery": "bg-cyan-100 text-cyan-700 border border-cyan-300",
  Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-300",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "shipments", label: "Shipments", icon: Package },
  { id: "clients", label: "Clients", icon: Users },
  { id: "chat", label: "Support Chat", icon: MessageSquare },
];

const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [shipments, setShipments] = useState(() => {
    try {
      const s = localStorage.getItem("nexafreight_shipments");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const [clients, setClients] = useState(() => {
    try {
      const c = localStorage.getItem("nexafreight_clients");
      return c ? JSON.parse(c) : [];
    } catch { return []; }
  });
  const canvasRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    clientEmail: "", origin: "", destination: "", weight: "", freightType: "road", specialInstructions: ""
  });
  const [clientForm, setClientForm] = useState({
    name: "", email: "", password: "", company: ""
  });

  const loadData = () => {
    try {
      const s = localStorage.getItem("nexafreight_shipments");
      setShipments(s ? JSON.parse(s) : []);
    } catch { setShipments([]); }
    try {
      const c = localStorage.getItem("nexafreight_clients");
      setClients(c ? JSON.parse(c) : []);
    } catch { setClients([]); }
  };

  const totalShipments = shipments.length;
  const totalRevenue = shipments.reduce((sum, s) => sum + (s.cost || 0), 0);
  const activeRoutes = shipments.filter((s) => s.status !== "Delivered").length;
  const registeredClients = clients.length;
  const [dateRefs] = useState(() => {
    const now = Date.now();
    return {
      weekAgo: new Date(now - 7 * 86400000),
      monthAgo: new Date(now - 30 * 86400000),
    };
  });
  const { weekAgo, monthAgo } = dateRefs;

  const handleStatusChange = (index, newStatus) => {
    const updated = shipments.map((s, i) => i === index ? { ...s, status: newStatus } : s);
    setShipments(updated);
    localStorage.setItem("nexafreight_shipments", JSON.stringify(updated));
  };

  const handleClientToggle = (index) => {
    const updated = clients.map((c, i) =>
      i === index ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" } : c
    );
    setClients(updated);
    localStorage.setItem("nexafreight_clients", JSON.stringify(updated));
  };

  const revenueByMonth = (() => {
    const monthMap = {};
    shipments.forEach(s => {
      const d = new Date(s.date || s.createdAt);
      if (isNaN(d.getTime())) return;
      const key = d.getMonth();
      monthMap[key] = (monthMap[key] || 0) + (s.cost || 0);
    });
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return { data: months.map((_, i) => monthMap[i] || 0), labels: months };
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = chartContainerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = 280;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const padding = { top: 30, right: 20, bottom: 40, left: width < 400 ? 35 : 50 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const maxVal = Math.max(...revenueByMonth.data, 1) * 1.15;
      const barCount = revenueByMonth.data.length;
      const barGap = chartW * 0.12 / barCount;
      const barWidth = (chartW - barGap * (barCount + 1)) / barCount;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      ctx.font = width < 400 ? "8px 'Plus Jakarta Sans', sans-serif" : "10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "right";

      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        const val = Math.round(maxVal - (maxVal / 4) * i);
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText("₹" + (val / 1000).toFixed(0) + "k", padding.left - 4, y + 3);
      }

      const hasData = revenueByMonth.data.some(v => v > 0);

      revenueByMonth.data.forEach((val, i) => {
        const x = padding.left + barGap + i * (barWidth + barGap);
        const barH = (val / maxVal) * chartH;
        const y = padding.top + chartH - barH;
        const radius = 4;
        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        gradient.addColorStop(0, "#0047cc");
        gradient.addColorStop(1, "#00b4d8");

        ctx.beginPath();
        ctx.moveTo(x, y + barH);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.fillStyle = "#0a1628";
        ctx.font = "bold 9px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(val > 0 ? "₹" + (val / 1000).toFixed(0) + "k" : "", x + barWidth / 2, y - 6);

        ctx.fillStyle = "#64748b";
        ctx.font = width < 400 ? "9px 'Plus Jakarta Sans', sans-serif" : "11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(revenueByMonth.labels[i], x + barWidth / 2, padding.top + chartH + 20);
      });

      if (!hasData) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Add shipments to see revenue chart", width / 2, height / 2);
      }

      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + chartH);
      ctx.lineTo(width - padding.right, padding.top + chartH);
      ctx.stroke();
    };

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipments]);

  const handleShipmentFormChange = (e) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddShipment = (e) => {
    e.preventDefault();
    if (!shipmentForm.clientEmail || !shipmentForm.origin || !shipmentForm.destination || !shipmentForm.weight) return;
    const weight = parseFloat(shipmentForm.weight);
    if (isNaN(weight) || weight <= 0) return;

    const clientData = clients.find(c => c.email === shipmentForm.clientEmail);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const trackingId = "NX-" +
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + "-" +
      Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const baseCost = weight * ({ road: 12, air: 38, ocean: 8 }[shipmentForm.freightType] || 12);
    const cost = Math.round(baseCost * 100 + Math.random() * 2000 + 500);

    const newShipment = {
      id: trackingId, trackingId,
      clientEmail: shipmentForm.clientEmail,
      clientName: clientData?.name || "Unknown",
      origin: shipmentForm.origin, destination: shipmentForm.destination,
      weight: weight + " kg", freightType: shipmentForm.freightType,
      specialInstructions: shipmentForm.specialInstructions || "None",
      status: "Picked Up", cost,
      date: new Date().toISOString().split("T")[0],
      eta: new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      createdAt: new Date().toISOString(),
    };

    try {
      const allShipments = JSON.parse(localStorage.getItem("nexafreight_shipments") || "[]");
      allShipments.unshift(newShipment);
      localStorage.setItem("nexafreight_shipments", JSON.stringify(allShipments));
    } catch (e) {
      console.error("Failed to save shipment:", e);
      return;
    }

    try {
      if (clientData) {
        const allClients = JSON.parse(localStorage.getItem("nexafreight_clients") || "[]");
        localStorage.setItem("nexafreight_clients", JSON.stringify(
          allClients.map(c => c.email === shipmentForm.clientEmail ? { ...c, shipments: (c.shipments || 0) + 1 } : c)
        ));
      }
    } catch (e) {
      console.error("Failed to update client:", e);
    }

    try {
      const allActivity = JSON.parse(localStorage.getItem("nexafreight_activity") || "[]");
      allActivity.unshift({
        action: `Shipment ${trackingId} created for ${clientData?.name || "Unknown"}`, time: new Date().toISOString(), type: "booking"
      });
      localStorage.setItem("nexafreight_activity", JSON.stringify(allActivity));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    setShipmentForm({ clientEmail: "", origin: "", destination: "", weight: "", freightType: "road", specialInstructions: "" });
    setShowAddShipment(false);
    loadData();
  };

  const handleClientFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.password) return;

    try {
      const allClients = JSON.parse(localStorage.getItem("nexafreight_clients") || "[]");
      allClients.unshift({
        name: clientForm.name, email: clientForm.email, company: clientForm.company || "N/A",
        shipments: 0, status: "Active", joined: new Date().toISOString().split("T")[0],
      });
      localStorage.setItem("nexafreight_clients", JSON.stringify(allClients));
    } catch (e) {
      console.error("Failed to save client:", e);
      return;
    }

    try {
      const accounts = JSON.parse(localStorage.getItem("nexafreight_accounts") || "[]");
      accounts.push({ name: clientForm.name, email: clientForm.email, password: clientForm.password, company: clientForm.company || "N/A", role: "client" });
      localStorage.setItem("nexafreight_accounts", JSON.stringify(accounts));
    } catch (e) {
      console.error("Failed to save account:", e);
    }

    try {
      const allActivity = JSON.parse(localStorage.getItem("nexafreight_activity") || "[]");
      allActivity.unshift({ action: `New client ${clientForm.name} registered`, time: new Date().toISOString(), type: "client" });
      localStorage.setItem("nexafreight_activity", JSON.stringify(allActivity));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    setClientForm({ name: "", email: "", password: "", company: "" });
    setShowAddClient(false);
    loadData();
  };

  const kpiCards = [
    {
      icon: Package, value: totalShipments, label: "Total Shipments",
      trend: shipments.filter(s => s.date && new Date(s.date) >= weekAgo).length + " this week",
      trendUp: true, color: "text-primary", bg: "bg-blue-50",
    },
    {
      icon: IndianRupee, value: formatCurrency(totalRevenue), label: "Revenue",
      trend: totalRevenue > 0 ? "From " + totalShipments + " shipments" : "No data yet",
      trendUp: totalRevenue > 0 ? true : null, color: "text-emerald-600", bg: "bg-emerald-50",
    },
    {
      icon: MapPin, value: activeRoutes, label: "Active Routes",
      trend: activeRoutes + " in transit", trendUp: null, color: "text-secondary", bg: "bg-cyan-50",
    },
    {
      icon: Users, value: registeredClients, label: "Registered Clients",
      trend: clients.filter(c => new Date(c.joined) >= monthAgo).length + " this month",
      trendUp: true, color: "text-violet-600", bg: "bg-violet-50",
    },
  ];

  const renderDashboard = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/50 text-xs font-bold uppercase tracking-widest text-primary mb-2 font-display">
          <Shield className="w-3.5 h-3.5" /> Admin Overview
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-dark tracking-tight font-display uppercase">Operations Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1 font-sans">Welcome back, <span className="font-semibold text-primary">{user?.name || "Admin"}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card rounded-xl p-4 sm:p-5 border border-blue-100 bg-white/70"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.trendUp !== null ? (
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${card.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {card.trendUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  <span className="hidden sm:inline">{card.trend}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-600">
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">{card.trend}</span>
                </div>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-black text-dark font-display tracking-tight">{card.value}</p>
            <p className="text-[11px] text-slate-500 font-medium font-sans uppercase tracking-wide mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><BarChart3 className="w-5 h-5 text-emerald-600" /></div>
            <div><h2 className="text-sm font-bold font-display uppercase tracking-wide text-dark">Revenue Overview</h2></div>
          </div>
          {totalRevenue > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-600 font-display">
              <IndianRupee className="w-3 h-3" /> {formatCurrency(totalRevenue)}
            </span>
          )}
        </div>
        <div ref={chartContainerRef} className="px-3 sm:px-4 py-4"><canvas ref={canvasRef} className="w-full" /></div>
      </div>
    </motion.div>
  );

  const renderShipments = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-dark tracking-tight font-display uppercase">Shipment Management</h1>
          <p className="text-slate-500 text-sm font-sans">{totalShipments} total shipments</p>
        </div>
        <button onClick={() => setShowAddShipment(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/90 transition-all cursor-pointer shadow-sm w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5" /> Add Shipment
        </button>
      </div>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">ID</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Client</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Origin</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Destination</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((s, i) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-bold font-display text-primary text-xs">{s.id}</span></td>
                  <td className="px-5 py-3.5 text-dark font-medium">{s.clientName}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{s.origin}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{s.destination}</td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <select value={s.status} onChange={e => handleStatusChange(i, e.target.value)}
                        className={`appearance-none cursor-pointer text-xs font-bold px-2.5 py-1 pr-6 rounded-lg border ${statusColors[s.status] || "bg-slate-100 text-slate-600 border-slate-300"} focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}>
                        {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold font-display text-dark">{formatCurrency(s.cost || 0)}</td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center"><Package className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No shipments yet</p><p className="text-slate-400 text-xs mt-1">Click "Add Shipment" to create one.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {shipments.map((s, i) => (
            <div key={s.id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-display text-primary text-xs">{s.id}</span>
                <div className="relative">
                  <select value={s.status} onChange={e => handleStatusChange(i, e.target.value)}
                    className={`appearance-none cursor-pointer text-[10px] font-bold px-2 py-1 pr-6 rounded-lg border ${statusColors[s.status] || "bg-slate-100 text-slate-600 border-slate-300"} focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all`}>
                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none opacity-50" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 font-medium">{s.clientName}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{s.origin} <ArrowRight className="w-2.5 h-2.5" /> {s.destination}</p>
                </div>
                <span className="font-bold font-display text-dark text-sm">{formatCurrency(s.cost || 0)}</span>
              </div>
            </div>
          ))}
          {shipments.length === 0 && (
            <div className="px-5 py-16 text-center"><Package className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No shipments yet</p><p className="text-slate-400 text-xs mt-1">Click "Add Shipment" to create one.</p></div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderClients = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-dark tracking-tight font-display uppercase">Client Management</h1>
          <p className="text-slate-500 text-sm font-sans">{registeredClients} registered clients</p>
        </div>
        <button onClick={() => setShowAddClient(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold font-display uppercase tracking-wide hover:bg-violet-700 transition-all cursor-pointer shadow-sm w-full sm:w-auto">
          <UserPlus className="w-3.5 h-3.5" /> Add Client
        </button>
      </div>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Email</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Shipments</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c, i) => (
                <tr key={c.email} className={`transition-colors ${c.status === "Suspended" ? "bg-red-50/40" : "hover:bg-blue-50/30"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center font-display font-bold text-primary text-[10px]">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-semibold text-dark text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{c.email}</td>
                  <td className="px-5 py-3.5 text-center font-bold font-display text-dark">{c.shipments || 0}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {c.status === "Active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => handleClientToggle(i)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display uppercase tracking-wide transition-all cursor-pointer ${c.status === "Active" ? "bg-red-50 border border-red-200/60 text-red-600 hover:bg-red-100" : "bg-emerald-50 border border-emerald-200/60 text-emerald-600 hover:bg-emerald-100"}`}>
                      {c.status === "Active" ? <><UserX className="w-3 h-3" /> Suspend</> : <><UserCheck className="w-3 h-3" /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-16 text-center"><Users className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No clients registered</p><p className="text-slate-400 text-xs mt-1">Click "Add Client" to register one.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {clients.map((c, i) => (
            <div key={c.email} className={`px-4 py-3 ${c.status === "Suspended" ? "bg-red-50/40" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-display font-bold text-primary text-xs">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {c.status === "Active" ? <UserCheck className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
                  {c.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{c.company} · {c.shipments || 0} shipments</span>
                <button onClick={() => handleClientToggle(i)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-display uppercase tracking-wide transition-all cursor-pointer ${c.status === "Active" ? "bg-red-50 border border-red-200/60 text-red-600" : "bg-emerald-50 border border-emerald-200/60 text-emerald-600"}`}>
                  {c.status === "Active" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="px-5 py-16 text-center"><Users className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No clients registered</p><p className="text-slate-400 text-xs mt-1">Click "Add Client" to register one.</p></div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-xl sm:text-2xl font-black text-dark tracking-tight font-display uppercase mb-1">Client Support Chat</h1>
      <p className="text-slate-500 text-sm font-sans mb-4 sm:mb-6">Real-time messaging with registered clients</p>
      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <ChatBox variant="light" />
      </div>
    </motion.div>
  );

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      title="Admin Panel"
      subtitle="NexaFreight Logistics"
      user={user}
      onLogout={logout}
      variant="light"
    >
      {activeNav === "dashboard" && renderDashboard()}
      {activeNav === "shipments" && renderShipments()}
      {activeNav === "clients" && renderClients()}
      {activeNav === "chat" && renderChat()}

      <AnimatePresence>
        {showAddShipment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/40 backdrop-blur-sm"
            onClick={() => setShowAddShipment(false)}
          >
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-lg font-bold font-display text-dark">Add New Shipment</h3>
                </div>
                <button onClick={() => setShowAddShipment(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddShipment} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Client <span className="text-red-400">*</span></label>
                  <select name="clientEmail" value={shipmentForm.clientEmail} onChange={handleShipmentFormChange} required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select a client</option>
                    {clients.map(c => <option key={c.email} value={c.email}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Origin <span className="text-red-400">*</span></label>
                    <input type="text" name="origin" value={shipmentForm.origin} onChange={handleShipmentFormChange} required placeholder="e.g. Mumbai"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Destination <span className="text-red-400">*</span></label>
                    <input type="text" name="destination" value={shipmentForm.destination} onChange={handleShipmentFormChange} required placeholder="e.g. Delhi"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Weight (kg) <span className="text-red-400">*</span></label>
                    <input type="number" name="weight" value={shipmentForm.weight} onChange={handleShipmentFormChange} required min="0.1" step="0.1" placeholder="e.g. 250"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Freight Type</label>
                    <select name="freightType" value={shipmentForm.freightType} onChange={handleShipmentFormChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="road">Road</option><option value="air">Air</option><option value="ocean">Ocean</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Special Instructions</label>
                  <textarea name="specialInstructions" value={shipmentForm.specialInstructions} onChange={handleShipmentFormChange} placeholder="Any special handling..." rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none" />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold font-display uppercase tracking-wide hover:bg-primary/90 transition-all shadow-sm cursor-pointer">
                    <Plus className="w-4 h-4 inline mr-1.5" /> Create Shipment
                  </button>
                  <button type="button" onClick={() => setShowAddShipment(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddClient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-dark/40 backdrop-blur-sm"
            onClick={() => setShowAddClient(false)}
          >
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center"><UserPlus className="w-5 h-5 text-violet-600" /></div>
                  <h3 className="text-lg font-bold font-display text-dark">Register New Client</h3>
                </div>
                <button onClick={() => setShowAddClient(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddClient} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="name" value={clientForm.name} onChange={handleClientFormChange} required placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" name="email" value={clientForm.email} onChange={handleClientFormChange} required placeholder="e.g. rahul@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="password" value={clientForm.password} onChange={handleClientFormChange} required placeholder="Set a login password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="company" value={clientForm.company} onChange={handleClientFormChange} placeholder="e.g. Acme Corp"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold font-display uppercase tracking-wide hover:bg-violet-700 transition-all shadow-sm cursor-pointer">
                    <UserPlus className="w-4 h-4 inline mr-1.5" /> Register Client
                  </button>
                  <button type="button" onClick={() => setShowAddClient(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}
