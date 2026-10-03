import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Search,
  Filter,
  AlertTriangle,
  ShieldAlert,
  FolderArchive,
  Users,
  Check,
  Eye,
  Flame,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useCases } from "@/context/CaseContext";
import { toast } from "sonner";

export default function Alerts() {
  const { alerts, unreadAlertCount, markAlertRead, markAllAlertsRead, cases, entities } = useCases();

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterReadStatus, setFilterReadStatus] = useState<"all" | "unread" | "read">("all");

  const filteredAlerts = useMemo(() => {
    let result = Array.isArray(alerts) ? [...alerts] : [];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          ((a.title || "")).toLowerCase().includes(q) ||
          ((a.message || "")).toLowerCase().includes(q) ||
          ((a.caseId || "")).toLowerCase().includes(q) ||
          ((a.type || "")).toLowerCase().includes(q)
      );
    }

    if (filterSeverity !== "all") {
      result = result.filter((a) => ((a.severity || a.type || "medium")).toLowerCase() === filterSeverity.toLowerCase());
    }

    if (filterReadStatus === "unread") {
      result = result.filter((a) => !(a.read ?? (a as any).isRead ?? false));
    } else if (filterReadStatus === "read") {
      result = result.filter((a) => (a.read ?? (a as any).isRead ?? false));
    }

    return result;
  }, [alerts, search, filterSeverity, filterReadStatus]);

  const handleMarkAll = async () => {
    await markAllAlertsRead();
    toast.success("All alerts marked as acknowledged");
  };

  const handleMarkSingle = async (id: string) => {
    await markAlertRead(id);
    toast.success("Alert marked as read");
  };

  const getSeverityBadge = (sev?: string) => {
    const s = (sev || "medium").toLowerCase();
    switch (s) {
      case "critical":
        return {
          bg: "bg-red-500/15 text-red-400 border-red-500/30",
          border: "border-red-500/30",
          icon: <Flame size={14} className="text-red-400" />,
        };
      case "high":
        return {
          bg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
          border: "border-orange-500/30",
          icon: <ShieldAlert size={14} className="text-orange-400" />,
        };
      case "medium":
      case "warning":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          border: "border-amber-500/30",
          icon: <AlertTriangle size={14} className="text-amber-400" />,
        };
      default:
        return {
          bg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          border: "border-sky-500/30",
          icon: <Bell size={14} className="text-sky-400" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Intelligence Alerts & Risk Flags"
        subtitle="Automated cross-case pattern detection, repeat suspect sightings, and evidentiary anomalies"
        action={
          unreadAlertCount > 0 ? (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
            >
              <CheckCheck size={14} className="text-violet-400" />
              <span>Acknowledge All ({unreadAlertCount})</span>
            </button>
          ) : undefined
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Total Alerts</span>
            <Bell size={16} className="text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{alerts.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Logged across system</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Unacknowledged</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1.5">{unreadAlertCount}</div>
          <div className="text-[11px] text-red-400/80 mt-0.5">Require immediate review</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(234,179,8,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Critical Severity</span>
            <Flame size={16} className="text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 mt-1.5">
            {alerts.filter((a) => a.severity?.toLowerCase() === "critical").length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">High threat or conflict</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Cross-Case Matches</span>
            <Layers size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {alerts.filter((a) => a.type?.toLowerCase().includes("cross") || a.title?.toLowerCase().includes("cross")).length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Shared suspects identified</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts by keywords, suspects, case IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setFilterReadStatus("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterReadStatus === "all" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterReadStatus("unread")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterReadStatus === "unread" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              Unread ({unreadAlertCount})
            </button>
            <button
              onClick={() => setFilterReadStatus("read")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterReadStatus === "read" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              Read
            </button>
          </div>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Severities</option>
            <option value="critical" className="bg-slate-900">Critical Priority</option>
            <option value="high" className="bg-slate-900">High Priority</option>
            <option value="medium" className="bg-slate-900">Medium Priority</option>
            <option value="low" className="bg-slate-900">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Alert Cards */}
      {filteredAlerts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/10 bg-white/5">
          <CheckCheck size={40} className="mx-auto text-emerald-400/60 mb-3" />
          <h3 className="text-base font-bold text-white">No active intelligence alerts</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            All intelligence flags have been reviewed, or your current filter criteria returned no matches.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert: any) => {
            const sev = alert.severity || alert.type || "medium";
            const badge = getSeverityBadge(sev);
            const isRead = alert.read ?? alert.isRead ?? false;
            const alertKey = alert.id || alert.alertId || Math.random().toString();
            const relatedCase = cases.find((c) => c.caseId === alert.caseId);

            return (
              <div
                key={alertKey}
                className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
                  !isRead
                    ? "bg-slate-950/80 border-violet-500/40 shadow-lg shadow-violet-950/30"
                    : "bg-black/30 border-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Severity Icon & Read indicator */}
                    <div className="relative mt-1">
                      <div className={`p-2 rounded-xl border ${badge.bg}`}>
                        {badge.icon}
                      </div>
                      {!isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-slate-950" />
                      )}
                    </div>

                    {/* Alert Content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                          {sev}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-muted-foreground bg-white/5 border border-white/10">
                          {alert.type || "INTELLIGENCE_FLAG"}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock size={11} />
                          <span>
                            {alert.timestamp
                              ? new Date(alert.timestamp).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently detected"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {alert.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                    {alert.caseId && (
                      <Link
                        to={`/cases/${alert.caseId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-mono font-semibold transition-colors"
                        title={relatedCase?.caseName}
                      >
                        <FolderArchive size={13} />
                        <span>{alert.caseId}</span>
                      </Link>
                    )}

                    {!isRead ? (
                      <button
                        onClick={() => handleMarkSingle(alertKey)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <Check size={13} className="text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground/60 px-2 py-1">
                        <CheckCheck size={13} />
                        <span>Acknowledged</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
