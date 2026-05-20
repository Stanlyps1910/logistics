import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import ChatBox from '../components/ChatBox';
import {
  Package, Truck, CheckCircle2, Clock, Plus, ChevronUp,
  MapPin, Calendar, ArrowRight, TrendingUp, IndianRupee, Eye, X,
  RefreshCw, MessageSquare, LayoutDashboard,
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
};

const STATUS_COLORS = {
  Delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  'In Transit': 'bg-blue-100 text-blue-700 border border-blue-300',
  'Picked Up': 'bg-amber-100 text-amber-700 border border-amber-300',
  'Customs Clearance': 'bg-purple-100 text-purple-700 border border-purple-300',
  'Out for Delivery': 'bg-cyan-100 text-cyan-700 border border-cyan-300',
};

const ACTIVITY_DOT_COLORS = {
  delivery: 'bg-emerald-500',
  booking: 'bg-blue-500',
  update: 'bg-orange-500',
  client: 'bg-purple-500',
};

const FREIGHT_MULTIPLIER = { road: 12, air: 38, ocean: 8 };

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'shipments', label: 'My Shipments', icon: Package },
  { id: 'book', label: 'Book Shipment', icon: Plus },
  { id: 'chat', label: 'Support Chat', icon: MessageSquare },
  { id: 'activity', label: 'Activity', icon: TrendingUp },
];

function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'NX-' +
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '-' +
    Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClientDashboard() {
  const { user, logout } = useAuth();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [shipments, setShipments] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem('nexafreight_shipments') || '[]');
      return all.filter(s => s.clientEmail === user?.email);
    } catch { return []; }
  });
  const [activities, setActivities] = useState(() => {
    try {
      const a = JSON.parse(localStorage.getItem('nexafreight_activity') || '[]');
      return a.slice(0, 5);
    } catch { return []; }
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    origin: '', destination: '', weight: '', freightType: 'road', specialInstructions: '',
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const loadData = useCallback(() => {
    try {
      const all = JSON.parse(localStorage.getItem('nexafreight_shipments') || '[]');
      setShipments(all.filter(s => s.clientEmail === user?.email));
    } catch { setShipments([]); }
    try {
      const a = JSON.parse(localStorage.getItem('nexafreight_activity') || '[]');
      setActivities(a.slice(0, 5));
    } catch { setActivities([]); }
  }, [user?.email]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 800);
  };

  const statsCards = [
    { label: 'Active Shipments', value: shipments.filter(s => s.status !== 'Delivered').length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Pickup', value: shipments.filter(s => s.status === 'Picked Up').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Spent', value: formatCurrency(shipments.reduce((sum, s) => sum + (Number(s.cost) || 0), 0)), icon: IndianRupee, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.origin || !bookingForm.destination || !bookingForm.weight) {
      showToast('Please fill all required fields.'); return;
    }
    const weight = parseFloat(bookingForm.weight);
    if (isNaN(weight) || weight <= 0) { showToast('Please enter a valid weight.'); return; }

    const baseCost = weight * (FREIGHT_MULTIPLIER[bookingForm.freightType] || 12);
    const cost = Math.round(baseCost * 100 + Math.random() * 2000 + 500);
    const trackingId = generateTrackingId();
    const etaDays = bookingForm.freightType === 'air' ? 2 : bookingForm.freightType === 'ocean' ? 14 : 5;
    const eta = new Date();
    eta.setDate(eta.getDate() + etaDays);

    const newShipment = {
      id: trackingId, trackingId, clientEmail: user?.email, clientName: user?.name || 'Client',
      origin: bookingForm.origin, destination: bookingForm.destination, weight, freightType: bookingForm.freightType,
      specialInstructions: bookingForm.specialInstructions || 'None', status: 'Picked Up', cost,
      eta: eta.toISOString(), createdAt: new Date().toISOString(),
    };

    const allShipments = JSON.parse(localStorage.getItem('nexafreight_shipments') || '[]');
    allShipments.unshift(newShipment);
    localStorage.setItem('nexafreight_shipments', JSON.stringify(allShipments));

    const newActivity = {
      id: Date.now().toString(), type: 'booking',
      message: `New shipment ${trackingId} booked: ${bookingForm.origin} → ${bookingForm.destination}`,
      timestamp: new Date().toISOString(), user: user?.name || 'Client',
    };
    const allActivity = JSON.parse(localStorage.getItem('nexafreight_activity') || '[]');
    allActivity.unshift(newActivity);
    localStorage.setItem('nexafreight_activity', JSON.stringify(allActivity));

    setBookingForm({ origin: '', destination: '', weight: '', freightType: 'road', specialInstructions: '' });
    setActiveNav('shipments');
    loadData();
    showToast(`Shipment ${trackingId} booked successfully!`);
  };

  const renderDashboard = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-dark tracking-tight">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user?.name || 'Client'}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="font-sans text-sm text-slate-500">{today}</p>
          </div>
        </div>
        <button onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-dark hover:border-primary/40 transition-all text-sm font-sans bg-white cursor-pointer w-full sm:w-auto">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl p-4 sm:p-5 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${stat.bg} -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`} />
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display text-xl sm:text-2xl font-bold text-dark">{stat.value}</p>
              <p className="font-sans text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-sm sm:text-base font-semibold text-dark">My Shipments</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-sans text-primary">{shipments.length}</span>
          </div>
          <button onClick={() => setActiveNav('book')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-primary text-white text-[10px] sm:text-xs font-bold font-display uppercase tracking-wide hover:bg-primary/90 transition-all cursor-pointer shadow-sm flex-shrink-0">
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Book</span>
          </button>
        </div>
        {shipments.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-sans text-slate-400 text-sm">No shipments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {shipments.slice(0, 4).map(shipment => (
              <div key={shipment.id || shipment.trackingId} className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-sans text-xs sm:text-sm font-medium text-primary truncate">{shipment.trackingId}</span>
                  <span className="font-sans text-[10px] sm:text-xs text-slate-500 hidden sm:inline truncate">{shipment.origin} → {shipment.destination}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium font-sans ${STATUS_COLORS[shipment.status] || 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                    {shipment.status}
                  </span>
                  <span className="font-sans text-xs text-slate-600 hidden sm:inline">{formatCurrency(shipment.cost || 0)}</span>
                </div>
              </div>
            ))}
            {shipments.length > 4 && (
              <button onClick={() => setActiveNav('shipments')}
                className="w-full px-5 py-3 text-xs font-sans text-primary hover:text-primary/80 hover:bg-blue-50/30 transition-colors text-center cursor-pointer">
                View all {shipments.length} shipments →
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderShipments = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-dark">My Shipments</h1>
          <p className="font-sans text-sm text-slate-500">{shipments.length} total shipments</p>
        </div>
        <button onClick={handleRefresh}
          className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-dark hover:border-primary/40 transition-all cursor-pointer bg-white">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-sans text-slate-400 text-sm">No shipments yet. Book your first shipment!</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1.2fr_1.2fr_1.2fr_1fr_1fr_0.8fr_0.5fr] gap-4 px-5 py-3 border-b border-slate-100 text-[10px] font-sans text-slate-400 uppercase tracking-wider">
              <span>Tracking ID</span><span>Origin</span><span>Destination</span><span>Status</span><span>ETA</span><span>Cost</span><span className="text-right">View</span>
            </div>
            <div className="divide-y divide-slate-100">
              {shipments.map((shipment) => (
                <div key={shipment.id || shipment.trackingId}>
                  <div className="hidden md:grid grid-cols-[1.2fr_1.2fr_1.2fr_1fr_1fr_0.8fr_0.5fr] gap-4 px-5 py-3.5 items-center hover:bg-blue-50/30 transition-colors">
                    <span className="font-sans text-sm font-medium text-primary">{shipment.trackingId}</span>
                    <span className="font-sans text-sm text-slate-600 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-300" />{shipment.origin}</span>
                    <span className="font-sans text-sm text-slate-600 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-300" />{shipment.destination}</span>
                    <span><span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium font-sans ${STATUS_COLORS[shipment.status] || 'bg-gray-100 text-gray-600 border border-gray-300'}`}>{shipment.status}</span></span>
                    <span className="font-sans text-sm text-slate-500">{formatDate(shipment.eta)}</span>
                    <span className="font-sans text-sm font-medium text-dark">{formatCurrency(shipment.cost || 0)}</span>
                    <div className="text-right">
                      <button onClick={() => setExpandedRow(prev => prev === (shipment.id || shipment.trackingId) ? null : shipment.id || shipment.trackingId)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-primary transition-all cursor-pointer">
                        {expandedRow === (shipment.id || shipment.trackingId) ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="md:hidden px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm font-semibold text-primary">{shipment.trackingId}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium font-sans ${STATUS_COLORS[shipment.status] || 'bg-gray-100 text-gray-600 border border-gray-300'}`}>{shipment.status}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-300" />{shipment.origin} <ArrowRight className="w-2.5 h-2.5 text-slate-300" /> {shipment.destination}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-400">ETA: {formatDate(shipment.eta)}</span>
                      <span className="font-sans text-sm font-medium text-dark">{formatCurrency(shipment.cost || 0)}</span>
                    </div>
                    <button onClick={() => setExpandedRow(prev => prev === (shipment.id || shipment.trackingId) ? null : shipment.id || shipment.trackingId)}
                      className="w-full py-2 rounded-lg bg-slate-50 text-slate-500 hover:text-primary text-xs font-sans transition-colors cursor-pointer">
                      {expandedRow === (shipment.id || shipment.trackingId) ? <><ChevronUp className="w-3 h-3 inline" /> Hide Details</> : <><Eye className="w-3.5 h-3.5 inline" /> View Details</>}
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedRow === (shipment.id || shipment.trackingId) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="px-4 sm:px-5 py-4 bg-slate-50/50 border-t border-slate-100">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div><p className="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Weight</p><p className="text-sm font-sans text-slate-700">{shipment.weight} kg</p></div>
                            <div><p className="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Type</p><p className="text-sm font-sans text-slate-700 capitalize">{shipment.freightType || '—'}</p></div>
                            <div><p className="text-[10px] font-sans text-slate-400 uppercase tracking-wider">Instructions</p><p className="text-sm font-sans text-slate-700">{shipment.specialInstructions || 'None'}</p></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  const renderBook = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-dark mb-1">Book New Shipment</h1>
      <p className="font-sans text-sm text-slate-500 mb-4 sm:mb-6">Fill in the details below to create a shipment</p>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-sans text-slate-500 uppercase tracking-wider">Origin <span className="text-red-400">*</span></label>
              <input type="text" name="origin" value={bookingForm.origin} onChange={handleBookingChange} placeholder="e.g. Mumbai"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-sans text-slate-500 uppercase tracking-wider">Destination <span className="text-red-400">*</span></label>
              <input type="text" name="destination" value={bookingForm.destination} onChange={handleBookingChange} placeholder="e.g. Delhi"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-sans text-slate-500 uppercase tracking-wider">Weight (kg) <span className="text-red-400">*</span></label>
              <input type="number" name="weight" value={bookingForm.weight} onChange={handleBookingChange} placeholder="e.g. 250" min="0.1" step="0.1"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-sans text-slate-500 uppercase tracking-wider">Freight Type</label>
              <select name="freightType" value={bookingForm.freightType} onChange={handleBookingChange}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none cursor-pointer">
                <option value="road">Road</option>
                <option value="air">Air</option>
                <option value="ocean">Ocean</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-sans text-slate-500 uppercase tracking-wider">Special Instructions</label>
            <textarea name="specialInstructions" value={bookingForm.specialInstructions} onChange={handleBookingChange}
              placeholder="Any special handling requirements..." rows={3}
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-primary text-white font-sans text-sm font-semibold shadow-sm hover:bg-primary/90 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Package className="w-4 h-4" /> Book Shipment
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-dark mb-1">Admin Support</h1>
      <p className="font-sans text-sm text-slate-500 mb-4 sm:mb-6">Send a message to the admin team</p>
      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 overflow-hidden">
        <ChatBox variant="light" />
      </div>
    </motion.div>
  );

  const renderActivity = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-dark mb-1">Recent Activity</h1>
      <p className="font-sans text-sm text-slate-500 mb-4 sm:mb-6">Latest actions and updates</p>

      <div className="glass-card rounded-xl border border-blue-100 bg-white/70 p-4 sm:p-6">
        {activities.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-sans text-sm text-slate-400">No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" />
            <div className="space-y-5">
              {activities.map((activity, idx) => {
                const dotColor = ACTIVITY_DOT_COLORS[activity.type] || ACTIVITY_DOT_COLORS.update;
                return (
                  <motion.div key={activity.id || idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex items-start gap-4">
                    <div className="relative flex-shrink-0 mt-1.5">
                      <div className={`w-[14px] h-[14px] rounded-full ${dotColor} shadow-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-slate-700 leading-relaxed">{activity.action || activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="font-sans text-xs text-slate-400">{activity.time ? formatDate(activity.time) : activity.timestamp ? formatDate(activity.timestamp) : ''}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      title="Client Portal"
      subtitle="NexaFreight Logistics"
      user={user}
      onLogout={logout}
      variant="light"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -30, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl glass-card border border-emerald-300 shadow-lg shadow-emerald-500/10 flex items-center gap-3 bg-white max-w-[90vw]"
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-sans text-xs sm:text-sm text-slate-700">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === 'dashboard' && renderDashboard()}
      {activeNav === 'shipments' && renderShipments()}
      {activeNav === 'book' && renderBook()}
      {activeNav === 'chat' && renderChat()}
      {activeNav === 'activity' && renderActivity()}
    </SidebarLayout>
  );
}
