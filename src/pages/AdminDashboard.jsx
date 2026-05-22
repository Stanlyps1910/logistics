import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import ChatBox from "../components/ChatBox";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  BarChart3, Package, Users, IndianRupee, TrendingUp, TrendingDown,
  MapPin, ChevronDown, Shield, UserCheck, UserX,
  RefreshCw, Plus, X, MessageSquare, Mail, Building2, User,
  UserPlus, Lock, LayoutDashboard, ArrowRight, Phone
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

const STATUS_COLORS_HEX = {
  "Picked Up": "#f59e0b",
  "In Transit": "#3b82f6",
  "Customs Clearance": "#a855f7",
  "Out for Delivery": "#06b6d4",
  "Delivered": "#10b981",
  "Pending": "#64748b"
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "shipments", label: "Shipments", icon: Package },
  { id: "clients", label: "Clients", icon: Users },
  { id: "quotes", label: "Quotes / Inquiries", icon: Mail },
  { id: "chat", label: "Support Chat", icon: MessageSquare },
];

const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [shipments, setShipments] = useState([]);
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  // Forms state
  const [shipmentForm, setShipmentForm] = useState({
    clientEmail: "", origin: "", destination: "", weight: "", freightType: "road", specialInstructions: "", cost: ""
  });
  const [clientForm, setClientForm] = useState({
    name: "", email: "", password: "", company: "", whatsapp: ""
  });

  // Conversion reference
  const [convertingQuote, setConvertingQuote] = useState(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) {
        Promise.resolve().then(() => setIsLoading(true));
      }
      const [shipmentsRes, clientsRes, quotesRes] = await Promise.all([
        fetch("/api/shipments").then(res => res.json()),
        fetch("/api/clients").then(res => res.json()),
        fetch("/api/quotes").then(res => res.json())
      ]);
      setShipments(Array.isArray(shipmentsRes) ? shipmentsRes : []);
      setClients(Array.isArray(clientsRes) ? clientsRes : []);
      setQuotes(Array.isArray(quotesRes) ? quotesRes : []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      if (!silent) {
        Promise.resolve().then(() => setIsLoading(false));
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const totalShipments = shipments.length;
  const totalRevenue = shipments.reduce((sum, s) => sum + (s.cost || 0), 0);
  const activeRoutes = shipments.filter((s) => s.status !== "Delivered").length;
  const registeredClients = clients.length;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  // Status handlers
  const handleStatusChange = async (shipmentId, newStatus) => {
    const originalShipments = shipments;
    setShipments(prev => prev.map(s => s._id === shipmentId ? { ...s, status: newStatus } : s));

    try {
      const res = await fetch(`/api/shipments/${shipmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to update shipment status");
        setShipments(originalShipments);
      }
    } catch (error) {
      console.error("Error updating shipment status:", error);
      alert("Failed to connect to the server to update status.");
      setShipments(originalShipments);
    }
  };

  const handleClientToggle = async (clientId) => {
    const targetClient = clients.find(c => c._id === clientId);
    if (!targetClient) return;

    const originalClients = clients;
    const nextStatus = targetClient.status === "Active" ? "Suspended" : "Active";
    setClients(prev => prev.map(c => c._id === clientId ? { ...c, status: nextStatus } : c));

    try {
      const res = await fetch(`/api/clients/${clientId}/toggle`, {
        method: "PUT"
      });
      const data = await res.json();
      if (data.success) {
        setClients(prev => prev.map(c => c._id === clientId ? { ...c, status: data.client.status } : c));
      } else {
        alert(data.message || "Failed to toggle client status");
        setClients(originalClients);
      }
    } catch (error) {
      console.error("Error toggling client status:", error);
      alert("Failed to connect to the server to toggle status.");
      setClients(originalClients);
    }
  };

  // Recharts Monthly Revenue Trend (Dynamic last 6 months)
  const chartData = (() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const monthlyRevenue = shipments
        .filter(s => {
          const sd = new Date(s.date || s.createdAt);
          return sd.getMonth() === m && sd.getFullYear() === y;
        })
        .reduce((sum, s) => sum + (s.cost || 0), 0);
        
      data.push({
        name: monthNames[m],
        revenue: monthlyRevenue
      });
    }
    return data;
  })();

  // Recharts Pie Chart Shipment Status
  const statusChartData = (() => {
    const counts = {};
    shipments.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  })();

  const handleShipmentFormChange = (e) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddShipmentSubmit = async (e) => {
    e.preventDefault();
    if (!shipmentForm.clientEmail || !shipmentForm.origin || !shipmentForm.destination || !shipmentForm.weight) return;

    try {
      let res;
      if (convertingQuote) {
        res = await fetch(`/api/quotes/${convertingQuote._id}/convert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: shipmentForm.origin,
            destination: shipmentForm.destination,
            weight: shipmentForm.weight,
            freightType: shipmentForm.freightType,
            specialInstructions: shipmentForm.specialInstructions,
            cost: shipmentForm.cost || undefined
          })
        });
      } else {
        res = await fetch("/api/shipments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail: shipmentForm.clientEmail,
            origin: shipmentForm.origin,
            destination: shipmentForm.destination,
            weight: shipmentForm.weight,
            freightType: shipmentForm.freightType,
            specialInstructions: shipmentForm.specialInstructions,
            cost: shipmentForm.cost || undefined
          })
        });
      }

      const data = await res.json();
      if (data.success) {
        setShipmentForm({ clientEmail: "", origin: "", destination: "", weight: "", freightType: "road", specialInstructions: "", cost: "" });
        setConvertingQuote(null);
        setShowAddShipment(false);
        fetchData(true);
      } else {
        alert(data.message || "Failed to create shipment");
      }
    } catch (err) {
      console.error("Add/Convert shipment error:", err);
    }
  };

  const handleClientFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClientSubmit = async (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.password || !clientForm.whatsapp) return;

    // Validate WhatsApp Country Code format starts with +
    if (!clientForm.whatsapp.startsWith("+")) {
      alert("WhatsApp number must start with a country code (e.g., +919876543210)");
      return;
    }

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm)
      });
      const data = await res.json();
      if (data.success) {
        setClientForm({ name: "", email: "", password: "", company: "", whatsapp: "" });
        setShowAddClient(false);
        fetchData(true);
      } else {
        alert(data.message || "Failed to register client");
      }
    } catch (err) {
      console.error("Add client error:", err);
    }
  };

  // Convert Quote Initiator
  const startQuoteConversion = (quote) => {
    setConvertingQuote(quote);
    setShipmentForm({
      clientEmail: quote.email,
      origin: "",
      destination: "",
      weight: "",
      freightType: "road",
      specialInstructions: `Quote inquiry conversion: "${quote.subject}"`,
      cost: ""
    });
    setShowAddShipment(true);
  };

  const kpiCards = [
    {
      icon: Package, value: totalShipments, label: "Total Shipments",
      trend: shipments.filter(s => s.createdAt && new Date(s.createdAt) >= weekAgo).length + " this week",
      trendUp: true, color: "text-primary", bg: "bg-emerald-50",
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
      trend: clients.filter(c => c.createdAt && new Date(c.createdAt) >= monthAgo).length + " this month",
      trendUp: true, color: "text-violet-600", bg: "bg-violet-50",
    },
  ];

  const renderDashboard = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-xs font-bold uppercase tracking-widest text-primary mb-2 font-display">
          <Shield className="w-3.5 h-3.5" /> Admin Overview
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-dark tracking-tight font-display uppercase">Operations Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1 font-sans">Welcome back, <span className="font-semibold text-primary">{user?.name || "Admin"}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card rounded-xl p-4 sm:p-5 border border-emerald-100 bg-white/70"
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

      {/* Visual Recharts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-display uppercase tracking-wide text-dark">Revenue Trend (Last 6 Months)</h2>
              </div>
            </div>
            {totalRevenue > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-600 font-display">
                <IndianRupee className="w-3 h-3" /> {formatCurrency(totalRevenue)}
              </span>
            )}
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004c29" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), "Revenue"]} 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontFamily: "sans-serif" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#004c29" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shipment Status Pie Chart */}
        <div className="lg:col-span-1 glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-display uppercase tracking-wide text-dark">Shipment Status</h2>
              </div>
            </div>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS_HEX[entry.name] || "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", fontFamily: "sans-serif" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs font-medium">No shipments logged yet</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 px-2">
            {statusChartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS_HEX[entry.name] || "#64748b" }} />
                <span className="truncate">{entry.name}: <strong>{entry.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
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
        <button onClick={() => { setConvertingQuote(null); setShowAddShipment(true); }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/90 transition-all cursor-pointer shadow-sm w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5" /> Book Shipment
        </button>
      </div>

      <div className="glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden">
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
              {shipments.map((s) => (
                <tr key={s._id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-bold font-display text-primary text-xs">{s.trackingId}</span></td>
                  <td className="px-5 py-3.5 text-dark font-medium">{s.clientName}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{s.origin}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{s.destination}</td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <select value={s.status} onChange={e => handleStatusChange(s._id, e.target.value)}
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
                <tr><td colSpan={6} className="px-5 py-16 text-center"><Package className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No shipments yet</p><p className="text-slate-400 text-xs mt-1">Click "Book Shipment" to create one.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {shipments.map((s) => (
            <div key={s._id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-display text-primary text-xs">{s.trackingId}</span>
                <div className="relative">
                  <select value={s.status} onChange={e => handleStatusChange(s._id, e.target.value)}
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
            <div className="px-5 py-16 text-center"><Package className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No shipments yet</p><p className="text-slate-400 text-xs mt-1">Click "Book Shipment" to create one.</p></div>
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
          <UserPlus className="w-3.5 h-3.5" /> Register Client
        </button>
      </div>

      <div className="glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">WhatsApp</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Shipments</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.email} className={`transition-colors ${c.status === "Suspended" ? "bg-red-50/40" : "hover:bg-emerald-50/30"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center font-display font-bold text-primary text-[10px]">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <span className="font-semibold text-dark text-sm block">{c.name}</span>
                        {c.company && <span className="text-[10px] text-slate-400 block">{c.company}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{c.email}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{c.whatsapp}</td>
                  <td className="px-5 py-3.5 text-center font-bold font-display text-dark">{c.shipments || 0}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {c.status === "Active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => handleClientToggle(c._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display uppercase tracking-wide transition-all cursor-pointer ${c.status === "Active" ? "bg-red-50 border border-red-200/60 text-red-600 hover:bg-red-100" : "bg-emerald-50 border border-emerald-200/60 text-emerald-600 hover:bg-emerald-100"}`}>
                      {c.status === "Active" ? <><UserX className="w-3 h-3" /> Suspend</> : <><UserCheck className="w-3 h-3" /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center"><Users className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No clients registered</p><p className="text-slate-400 text-xs mt-1">Click "Register Client" to register one.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {clients.map((c) => (
            <div key={c.email} className={`px-4 py-3 ${c.status === "Suspended" ? "bg-red-50/40" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center font-display font-bold text-primary text-xs">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.email} · {c.whatsapp}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {c.status === "Active" ? <UserCheck className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
                  {c.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{c.company} · {c.shipments || 0} shipments</span>
                <button onClick={() => handleClientToggle(c._id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-display uppercase tracking-wide transition-all cursor-pointer ${c.status === "Active" ? "bg-red-50 border border-red-200/60 text-red-600" : "bg-emerald-50 border border-emerald-200/60 text-emerald-600"}`}>
                  {c.status === "Active" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          ))}
          {clients.length === 0 && (
            <div className="px-5 py-16 text-center"><Users className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No clients registered</p><p className="text-slate-400 text-xs mt-1">Click "Register Client" to register one.</p></div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderQuotes = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-dark tracking-tight font-display uppercase">Customer Inquiries & Quotes</h1>
        <p className="text-slate-500 text-sm font-sans">{quotes.length} total form queries received</p>
      </div>

      <div className="glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Sender</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Message</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-center px-5 py-3 text-xs font-bold font-display uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q) => (
                <tr key={q._id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-dark text-sm block">{q.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <span className="text-slate-600 block">{q.email}</span>
                    <span className="text-slate-400 block">{q.whatsapp}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-xs text-dark">{q.subject}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate" title={q.message}>{q.message}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${q.status === "Converted" ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-amber-100 text-amber-700 border border-amber-300"}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {q.status === "Pending" ? (
                      <button onClick={() => startQuoteConversion(q)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display uppercase tracking-wide bg-primary text-white hover:bg-primary/95 transition-all cursor-pointer shadow-sm">
                        Convert to Shipment <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 font-display uppercase">Converted</span>
                    )}
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center"><Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No inquiries received yet</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {quotes.map((q) => (
            <div key={q._id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-dark text-xs">{q.name}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${q.status === "Converted" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {q.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-1"><strong>Contact:</strong> {q.email} · {q.whatsapp}</p>
              <p className="text-[11px] text-slate-700 mb-1"><strong>Subj:</strong> {q.subject}</p>
              <p className="text-[11px] text-slate-500 mb-3 italic">"{q.message}"</p>
              <div className="flex justify-end">
                {q.status === "Pending" ? (
                  <button onClick={() => startQuoteConversion(q)}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-wide bg-primary text-white hover:bg-primary/95 transition-all shadow-sm">
                    Convert to Shipment <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 font-display uppercase">Converted</span>
                )}
              </div>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="px-5 py-16 text-center"><Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" /><p className="text-slate-400 text-sm font-medium">No inquiries received yet</p></div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="text-xl sm:text-2xl font-black text-dark tracking-tight font-display uppercase mb-1">Client Support Chat</h1>
      <p className="text-slate-500 text-sm font-sans mb-4 sm:mb-6">Real-time messaging with registered clients</p>
      <div className="glass-card rounded-xl border border-emerald-100 bg-white/70 overflow-hidden">
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
      subtitle="SRI RANGA LOGISTICS"
      user={user}
      onLogout={logout}
      variant="light"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500 font-sans">Loading data from SRI RANGA LOGISTICS API...</p>
        </div>
      ) : (
        <>
          {activeNav === "dashboard" && renderDashboard()}
          {activeNav === "shipments" && renderShipments()}
          {activeNav === "clients" && renderClients()}
          {activeNav === "quotes" && renderQuotes()}
          {activeNav === "chat" && renderChat()}
        </>
      )}

      {/* Shipment Modal (Manual booking OR conversion) */}
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
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-lg font-bold font-display text-dark">
                    {convertingQuote ? "Convert Quote to Shipment" : "Book New Shipment"}
                  </h3>
                </div>
                <button onClick={() => setShowAddShipment(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddShipmentSubmit} className="p-5 space-y-4">
                {convertingQuote && (
                  <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3.5 text-xs text-amber-800">
                    <p className="font-bold mb-1">Converting Quote from {convertingQuote.name}</p>
                    <p className="font-mono">Email: {convertingQuote.email} | WhatsApp: {convertingQuote.whatsapp}</p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Client Email <span className="text-red-400">*</span></label>
                  {convertingQuote ? (
                    <input type="email" name="clientEmail" value={shipmentForm.clientEmail} readOnly
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm focus:outline-none cursor-not-allowed" />
                  ) : (
                    <select name="clientEmail" value={shipmentForm.clientEmail} onChange={handleShipmentFormChange} required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">Select a client</option>
                      {clients.map(c => <option key={c.email} value={c.email}>{c.name} ({c.email})</option>)}
                    </select>
                  )}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Custom Cost (INR) <span className="text-[10px] text-slate-400 font-normal">(Leave blank to auto-calculate)</span></label>
                    <input type="number" name="cost" value={shipmentForm.cost} onChange={handleShipmentFormChange} placeholder="Auto-calculated if blank"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">Special Instructions</label>
                  <textarea name="specialInstructions" value={shipmentForm.specialInstructions} onChange={handleShipmentFormChange} placeholder="Any special handling..." rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none font-sans" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold font-display uppercase tracking-wide hover:bg-primary/90 transition-all shadow-sm cursor-pointer">
                    {convertingQuote ? "Convert & Book" : "Create Shipment"}
                  </button>
                  <button type="button" onClick={() => setShowAddShipment(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Modal */}
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
              <form onSubmit={handleAddClientSubmit} className="p-5 space-y-4">
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
                  <label className="text-xs font-bold font-display uppercase tracking-wider text-slate-500">WhatsApp Number <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="whatsapp" value={clientForm.whatsapp} onChange={handleClientFormChange} required placeholder="e.g. +919876543210 (with country code)"
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
