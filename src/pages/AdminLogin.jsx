import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, ArrowRight, AlertCircle, User } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!mountedRef.current) return;
      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch {
      if (mountedRef.current) {
        setError("An unexpected error occurred.");
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container pt-16 grid-lines"
    >
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#f0f4ff]/50 via-white to-white">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-cyan-100/30 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo / Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dark to-primary rounded-2xl shadow-[0_8px_25px_rgba(0,71,204,0.4)] mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold font-display text-dark tracking-tight">Admin Panel</h1>
            <p className="text-slate-500 mt-2 font-sans">Authorized personnel only</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card rounded-2xl p-8 border-t-4 border-t-primary"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-display">Admin Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nexafreight.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-100 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-sans text-dark transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-display">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-blue-100 bg-white/80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-sans text-dark transition-all"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-dark to-primary text-white font-bold uppercase font-display tracking-wider rounded-xl shadow-[0_8px_25px_rgba(10,22,40,0.4)] hover:shadow-[0_0_20px_rgba(0,180,216,0.5)] border border-blue-400/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Access Admin Panel <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-blue-100"></div>
              <span className="text-xs text-slate-400 font-display uppercase tracking-wider">Demo Credentials</span>
              <div className="flex-1 h-px bg-blue-100"></div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-display uppercase tracking-wider">Admin Test Account</span>
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Email: <span className="text-primary font-semibold">admin@nexafreight.com</span><br />
                Password: <span className="text-primary font-semibold">admin123</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 space-y-2"
          >
            <p className="text-xs text-slate-400 font-sans">
              <Link to="/" className="text-slate-500 hover:text-primary transition-colors">← Back to Home</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
