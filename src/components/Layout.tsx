import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, User, Shield, Command } from "lucide-react";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { useAuth } from "@/lib/auth";
import { useCases } from "@/context/CaseContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { unreadAlertCount, undo, redo } = useCases();
  const [cmdOpen, setCmdOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      // Ctrl+Z Undo (when not in an input)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        if (!["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
          e.preventDefault();
          undo();
        }
      }
      // Ctrl+Y or Ctrl+Shift+Z Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        if (!["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const pageTitles: Record<string, string> = {
    "/": "Investigation Dashboard",
    "/cases": "Case Management Catalog",
    "/investigations": "Investigation Workspace",
    "/entities": "Entity Intelligence Directory",
    "/network": "Interactive Case Network",
    "/timeline": "Chronological Investigation Timeline",
    "/evidence": "Evidence Management Locker",
    "/alerts": "Intelligence Alerts & Flags",
    "/analytics": "Intelligence Analytics & Patterns",
    "/reports": "Case Reports & Briefings",
    "/settings": "Platform Settings & Controls",
  };

  const getTitle = () => {
    if (location.pathname.startsWith("/cases/")) {
      return "Case Details Workspace";
    }
    return pageTitles[location.pathname] || "CaseChain Platform";
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(225 25% 7%)" }}>
      <Sidebar />

      <main className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="flex items-center gap-2">
              <span className="topbar-page-label">{getTitle()}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Quick Command Palette trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all text-xs"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search size={14} className="text-violet-400" />
              <span>Search or execute command...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-muted-foreground ml-2">
                <Command size={10} />K
              </kbd>
            </button>

            {/* Mobile search button */}
            <button
              onClick={() => setCmdOpen(true)}
              className="sm:hidden topbar-icon-btn"
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Notifications / Alerts button */}
            <button
              onClick={() => navigate("/alerts")}
              className="topbar-icon-btn topbar-notif"
              title={`Alerts (${unreadAlertCount} unread)`}
            >
              <Bell size={18} />
              {unreadAlertCount > 0 && <span className="topbar-notif-dot" />}
            </button>

            <div className="topbar-divider" />

            {/* User Profile display */}
            <div
              onClick={() => navigate("/settings")}
              className="topbar-profile"
              title="View Investigator Profile"
            >
              <div className="topbar-avatar">
                <Shield size={16} />
              </div>
              <div className="topbar-user-info">
                <div className="topbar-user-email">
                  {user?.name || user?.email?.split("@")[0] || "Investigator"}
                </div>
                <div className="topbar-user-role">{role || "Investigator"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <div key={location.pathname} className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pt-4 animate-fade-in">
          <Outlet />
        </div>

        {/* Coherent Platform Footer */}
        <footer
          className="px-6 py-3.5 text-center text-xs border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{
            color: "rgba(255,255,255,0.3)",
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(10,10,26,0.5)",
          }}
        >
          <div>
            CaseChain © {new Date().getFullYear()} — Case Investigation & Relationship Intelligence Platform
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Security Classification: Level-3</span>
            <span>•</span>
            <span className="text-violet-400 font-mono">v2.4 Production</span>
          </div>
        </footer>
      </main>

      {/* Global Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(10,10,26,0.7);
          backdrop-filter: blur(14px);
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .topbar-left { display: flex; align-items: center; gap: 1rem; }
        .topbar-page-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .topbar-right { display: flex; align-items: center; gap: 0.75rem; }
        .topbar-icon-btn {
          width: 36px; height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .topbar-icon-btn:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.06);
        }
        .topbar-notif { position: relative; }
        .topbar-notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid hsl(225 25% 7%);
        }
        .topbar-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.08);
          margin: 0 0.25rem;
        }
        .topbar-profile {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.35rem 0.65rem 0.35rem 0.35rem;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .topbar-profile:hover { background: rgba(255,255,255,0.05); }
        .topbar-avatar {
          width: 32px; height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.25));
          border: 1px solid rgba(124,58,237,0.4);
          color: #a78bfa;
        }
        .topbar-user-info { display: flex; flex-direction: column; }
        .topbar-user-email { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9); }
        .topbar-user-role { font-size: 0.68rem; color: #a78bfa; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }

        @media (max-width: 768px) {
          .topbar { padding: 0 1rem; padding-left: 3.5rem; }
          .topbar-user-info { display: none; }
        }
      `}</style>
    </div>
  );
}
