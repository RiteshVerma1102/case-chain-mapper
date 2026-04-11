import { useState } from "react";
import {
  Shield, Search, Plus, BarChart3, UserSearch, Network, FileText, X, Menu, Calendar, Bell,
} from "lucide-react";

export type View = "dashboard" | "addCase" | "search" | "investigate" | "analytics" | "network" | "timeline" | "alerts";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "dashboard", label: "Dashboard", icon: FileText },
  { view: "addCase", label: "New Case", icon: Plus },
  { view: "search", label: "Search", icon: Search },
  { view: "investigate", label: "Investigate", icon: UserSearch },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "network", label: "Network", icon: Network },
  { view: "timeline", label: "Timeline", icon: Calendar },
  { view: "alerts", label: "Alerts", icon: Bell },
];

export default function InvestigationSidebar({ activeView, onViewChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-card border border-border p-2.5 text-foreground shadow-lg"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed md:static z-40 h-screen w-[220px] flex-shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-tight text-foreground">D.C.I.S</h1>
              <p className="text-[10px] text-muted-foreground">Investigation System</p>
            </div>
          </div>
        </div>

        <div className="h-px mx-4 bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">Menu</p>
          {navItems.map((item) => {
            const active = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => { onViewChange(item.view); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 group relative ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />}
                <item.icon size={16} className={active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                <span>{item.label}</span>
                {item.view === "alerts" && (
                  <span className="ml-auto text-[9px] font-semibold bg-destructive/15 text-destructive px-1.5 py-0.5 rounded-md">!</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="h-px mx-4 bg-sidebar-border" />

        {/* Footer */}
        <div className="px-5 py-4">
          <div className="rounded-lg bg-sidebar-accent/50 border border-sidebar-border p-3">
            <p className="text-[11px] font-medium text-foreground/80">Linked List Engine</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">v2.0 • DSA Powered</p>
          </div>
        </div>
      </aside>
    </>
  );
}
