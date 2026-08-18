import { useMemo } from "react";
import { useCases } from "@/context/CaseContext";
import { ShieldCheck, ChevronRight, Bell } from "lucide-react";

export default function AlertsPanel() {
  const { generateAlerts, cases } = useCases();
  const alerts = useMemo(() => generateAlerts(), [generateAlerts, cases]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8 font-sans pb-16">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-4xl font-bold tracking-tight text-[#1D1D1F]">Alert Center</h2>
          {alerts.length > 0 && (
            <span className="text-xs font-semibold bg-[#E53935]/10 text-[#E53935] px-3 py-1 rounded-full">
              {alerts.length} Patterns Flagged
            </span>
          )}
        </div>
        <p className="text-lg text-[#6E6E73] mt-1">Important patterns that need attention.</p>
      </div>

      {alerts.length === 0 && (
        <div className="rounded-3xl bg-white border border-black/5 p-12 text-center space-y-2 shadow-sm">
          <ShieldCheck size={32} className="mx-auto text-[#2E7D32]" />
          <p className="text-lg font-bold text-[#1D1D1F]">All Clear</p>
          <p className="text-sm text-[#6E6E73]">No suspicious case relationship patterns detected across active nodes.</p>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert, i) => {
          const dotColor = alert.type === "critical" ? "bg-[#E53935]" : alert.type === "warning" ? "bg-[#D97706]" : "bg-[#0071E3]";

          return (
            <div key={i} className="rounded-3xl bg-white border border-black/5 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className={`h-3 w-3 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider">{alert.type}</span>
                  <h3 className="text-lg font-bold text-[#1D1D1F]">{alert.title}</h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed">{alert.message}</p>

                  {alert.relatedCases.length > 0 && (
                    <div className="pt-3 space-y-2">
                      <p className="text-xs font-semibold text-[#1D1D1F]">Affected Cases ({alert.relatedCases.length}):</p>
                      <div className="space-y-1.5">
                        {alert.relatedCases.map((c) => (
                          <div key={c.caseId} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] text-xs">
                            <span className="font-mono font-bold text-[#0071E3]">{c.caseId}</span>
                            <span className="font-semibold text-[#1D1D1F] flex-1 truncate">{c.title}</span>
                            <span className="text-[#6E6E73]">{c.suspectName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
