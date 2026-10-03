import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderArchive,
  Fingerprint,
  Users,
  Network,
  CalendarClock,
  FileText,
  Bell,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCases } from "@/context/CaseContext";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cases", label: "Cases", icon: FolderArchive },
  { to: "/investigations", label: "Investigations", icon: Fingerprint },
  { to: "/entities", label: "Entities", icon: Users },
  { to: "/network", label: "Case Network", icon: Network },
  { to: "/timeline", label: "Timeline", icon: CalendarClock },
  { to: "/evidence", label: "Evidence", icon: FileText },
  { to: "/alerts", label: "Alerts", icon: Bell, badge: true },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { signOut, role, user } = useAuth();
  const { unreadAlertCount } = useCases();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl text-white/90 transition-all duration-200"
        style={{
          background: "rgba(124,58,237,0.25)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(124,58,237,0.35)",
        }}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`sidebar-root fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarWidth}`}
      >
        {/* Brand / Logo */}
        <div className={`sidebar-logo ${collapsed ? "justify-center px-3" : "px-5"}`}>
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <Shield size={20} className="text-violet-400" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="sidebar-logo-text">CaseChain</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono font-medium -mt-1">
                  Investigation & Intel
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <nav className={`flex-1 py-3 space-y-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""} ${
                  collapsed ? "sidebar-link-collapsed" : ""
                }`
              }
              title={collapsed ? label : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon size={18} className="sidebar-link-icon flex-shrink-0" />
                {badge && unreadAlertCount > 0 && collapsed && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{label}</span>
                  {badge && unreadAlertCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      {unreadAlertCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-bottom">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-collapse-btn hidden lg:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>

          {!collapsed && (
            <div className="sidebar-role flex items-center justify-between">
              <span className="truncate">
                {user?.name || user?.email?.split("@")[0] || "Investigator"}
              </span>
              <span className="sidebar-role-highlight text-[11px] uppercase tracking-wider">
                {role || "Investigator"}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`sidebar-logout ${collapsed ? "sidebar-link-collapsed" : ""}`}
            title="Sign out of CaseChain"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <style>{`
        .sidebar-root {
          background: linear-gradient(180deg, rgba(10, 10, 26, 0.98), rgba(15, 12, 30, 0.98));
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          height: 64px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s;
        }
        .sidebar-logo-inner {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(37, 99, 235, 0.2));
          border: 1px solid rgba(124, 58, 237, 0.35);
          color: #a78bfa;
          flex-shrink: 0;
        }
        .sidebar-logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #c4b5fd, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.55rem 0.85rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s ease;
          position: relative;
          text-decoration: none;
        }
        .sidebar-link:hover {
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.05);
        }
        .sidebar-link-active {
          color: white !important;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(37, 99, 235, 0.15)) !important;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.12);
        }
        .sidebar-link-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          height: 50%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
        }
        .sidebar-link-active .sidebar-link-icon {
          color: #a78bfa;
        }
        .sidebar-link-collapsed {
          justify-content: center;
          padding: 0.65rem;
        }
        .sidebar-bottom {
          padding: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .sidebar-collapse-btn {
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar-collapse-btn:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.04);
        }
        .sidebar-role {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          padding: 0.3rem 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
        }
        .sidebar-role-highlight {
          color: #a78bfa;
          font-weight: 700;
        }
        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.55rem 0.85rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
        }
        .sidebar-logout:hover {
          color: #f87171;
          background: rgba(239, 68, 68, 0.08);
        }
      `}</style>
    </>
  );
}
