import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Logo from "./Logo";

export default function SidebarLayout({
  navItems,
  activeNav,
  onNavChange,
  title,
  subtitle,
  user,
  onLogout,
  children,
  variant = "light",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = variant === "dark";

  const sidebarBg = isDark ? "bg-dark border-r border-white/10" : "bg-white border-r border-slate-200";
  const textColor = isDark ? "text-white" : "text-dark";
  const mutedText = isDark ? "text-white/40" : "text-slate-400";
  const activeBg = isDark ? "bg-emerald-500/15 text-emerald-400 border-l-2 border-emerald-400" : "bg-emerald-50 text-primary border-l-2 border-primary";
  const inactiveBg = isDark ? "text-white/50 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-dark";
  const topBarBg = isDark ? "bg-dark/90 border-b border-white/5" : "bg-white/90 border-b border-slate-200";

  return (
    <div className={`min-h-screen ${isDark ? "bg-dark" : "bg-light-bg"}`}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 z-50 lg:z-30 h-full w-64 flex flex-col transition-transform duration-300 lg:top-[72px] lg:h-[calc(100vh-72px)] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${sidebarBg}`}>
        <div className={`flex items-center gap-3 px-5 py-4 border-b lg:px-6 lg:py-5 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <Logo iconOnly={true} className="w-12 h-12 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className={`font-display font-bold text-sm uppercase tracking-wide truncate ${textColor}`}>
              {title || "SRI RANGA LOGISTICS"}
            </h1>
            {subtitle && (
              <p className={`text-[10px] font-medium truncate ${mutedText}`}>{subtitle}</p>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavChange(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium font-sans transition-all cursor-pointer ${
                  isActive ? activeBg : inactiveBg
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={`px-4 py-3 border-t lg:px-4 lg:py-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs flex-shrink-0 ${
              isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-primary"
            }`}>
              {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${textColor}`}>{user?.name || "User"}</p>
              <p className={`text-[10px] truncate ${mutedText}`}>{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64 pt-[72px]">
        <header className={`sticky top-[72px] z-30 flex items-center justify-between px-4 py-2.5 ${topBarBg} backdrop-blur-md lg:hidden`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-white/5 text-white" : "hover:bg-slate-100 text-slate-700"}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className={`font-display font-bold text-sm ${textColor}`}>{title}</span>
          <div className="w-9" />
        </header>

        <div className="p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
