import { useState } from "react";
import {
  Shield, Search, Plus, BarChart3, UserSearch, Network, FileText, X, Menu, Calendar, Bell, Cpu, CheckSquare, ShieldCheck, FileSpreadsheet,
} from "lucide-react";

export type View =
  | "dashboard"
  | "addCase"
  | "search"
  | "investigate"
  | "analytics"
  | "network"
  | "timeline"
  | "alerts"
  | "report"
  | "dsaLab"
  | "dsaChecklist"
  | "testCenter";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const caseNavItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "dashboard", label: "Dashboard", icon: FileText },
  { view: "addCase", label: "New Case", icon: Plus },
  { view: "search", label: "Cases", icon: Search },
  { view: "investigate", label: "Investigate", icon: UserSearch },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "network", label: "Network", icon: Network },
  { view: "timeline", label: "Timeline", icon: Calendar },
  { view: "report", label: "Case Report", icon: FileSpreadsheet },
  { view: "alerts", label: "Alerts", icon: Bell },
];

const dsaNavItems: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "dsaLab", label: "DSA Lab", icon: Cpu },
  { view: "dsaChecklist", label: "PEP Syllabus (30)", icon: CheckSquare },
  { view: "testCenter", label: "Test Center", icon: ShieldCheck },
];

export default function InvestigationSidebar({ activeView, onViewChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-full bg-white border border-black/10 p-2.5 text-[#1D1D1F] shadow-lg"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed md:static z-40 h-screen w-[220px] flex-shrink-0 flex flex-col bg-white border-r border-black/5 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0071E3]/10 border border-[#0071E3]/20">
              <Shield className="h-5 w-5 text-[#0071E3]" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold tracking-tight text-[#1D1D1F]">D.C.I.S.</h1>
              <p className="text-[11px] text-[#6E6E73] font-medium">Digital Intelligence</p>
            </div>
          </div>
        </div>

        <div className="h-px mx-6 bg-black/5" />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 py-1 text-[10px] font-semibold tracking-widest text-[#6E6E73]/70 uppercase">Case System</p>
            <div className="space-y-1 pt-1">
              {caseNavItems.map((item) => {
                const active = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => { onViewChange(item.view); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 group relative ${
                      active
                        ? "bg-[#0071E3]/10 text-[#0071E3] font-semibold"
                        : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                    }`}
                  >
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#0071E3]" />}
                    <item.icon size={16} className={active ? "text-[#0071E3]" : "text-[#6E6E73] group-hover:text-[#1D1D1F]"} />
                    <span>{item.label}</span>
                    {item.view === "alerts" && (
                      <span className="ml-auto text-[9px] font-bold bg-[#E53935]/10 text-[#E53935] px-1.5 py-0.5 rounded-full">!</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-3 py-1 text-[10px] font-semibold tracking-widest text-[#6E6E73]/70 uppercase">DSA Intelligence Lab</p>
            <div className="space-y-1 pt-1">
              {dsaNavItems.map((item) => {
                const active = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => { onViewChange(item.view); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 group relative ${
                      active
                        ? "bg-[#0071E3]/10 text-[#0071E3] font-semibold"
                        : "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                    }`}
                  >
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#0071E3]" />}
                    <item.icon size={16} className={active ? "text-[#0071E3]" : "text-[#6E6E73] group-hover:text-[#1D1D1F]"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="h-px mx-6 bg-black/5" />

        {/* Footer */}
        <div className="px-5 py-4">
          <div className="rounded-2xl bg-[#F5F5F7] border border-black/5 p-3.5 text-center">
            <p className="text-[12px] font-semibold text-[#1D1D1F]">PEP DSA Intelligence</p>
            <p className="text-[11px] text-[#6E6E73] mt-0.5 font-mono">30/30 Topics Verified</p>
          </div>
        </div>
      </aside>
    </>
  );
}
