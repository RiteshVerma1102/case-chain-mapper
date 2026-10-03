import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderArchive,
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Network,
  Plus,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";
import { useCases } from "@/context/CaseContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { cases, entities, evidence, alerts, analyzePatterns, unreadAlertCount } = useCases();

  const analysis = useMemo(() => analyzePatterns(), [analyzePatterns]);

  // Priority counts
  const criticalCount = cases.filter(c => c.priority === "Critical").length;
  const highCount = cases.filter(c => c.priority === "High").length;
  const activeCount = cases.filter(c => c.status !== "Resolved" && c.status !== "Closed").length;
  const resolvedCount = cases.filter(c => c.status === "Resolved" || c.status === "Closed").length;

  const kpis = [
    {
      title: "Total Cases",
      value: cases.length,
      change: `${activeCount} Active`,
      icon: FolderArchive,
      color: "from-violet-500/20 to-purple-500/10",
      border: "border-violet-500/30",
      textColor: "text-violet-400",
      action: () => navigate("/cases"),
    },
    {
      title: "Active Cases",
      value: activeCount,
      change: "Current Pipeline",
      icon: Activity,
      color: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      textColor: "text-blue-400",
      action: () => navigate("/cases?status=Under%20Investigation"),
    },
    {
      title: "Critical Priority",
      value: criticalCount,
      change: "Immediate Review",
      icon: AlertTriangle,
      color: "from-red-500/20 to-rose-500/10",
      border: "border-red-500/30",
      textColor: "text-red-400",
      action: () => navigate("/cases?priority=Critical"),
    },
    {
      title: "Resolved Cases",
      value: resolvedCount,
      change: `${cases.length > 0 ? Math.round((resolvedCount / cases.length) * 100) : 0}% Solved`,
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400",
      action: () => navigate("/cases?status=Resolved"),
    },
    {
      title: "Entities Catalogued",
      value: entities.length,
      change: "Mapped Nodes",
      icon: Network,
      color: "from-indigo-500/20 to-violet-500/10",
      border: "border-indigo-500/30",
      textColor: "text-indigo-400",
      action: () => navigate("/entities"),
    },
    {
      title: "Evidence Exhibits",
      value: evidence.length,
      change: "Secured Items",
      icon: FileText,
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
      textColor: "text-amber-400",
      action: () => navigate("/evidence"),
    },
  ];

  // Chart data
  const priorityChartData = [
    { name: "Critical", count: criticalCount, color: "#ef4444" },
    { name: "High", count: highCount, color: "#f97316" },
    { name: "Medium", count: cases.filter(c => c.priority === "Medium").length, color: "#3b82f6" },
    { name: "Low", count: cases.filter(c => c.priority === "Low").length, color: "#10b981" },
  ];

  const statusChartData = [
    { name: "Under Inv.", value: cases.filter(c => c.status === "Under Investigation").length, color: "#8b5cf6" },
    { name: "New", value: cases.filter(c => c.status === "New").length, color: "#38bdf8" },
    { name: "On Hold", value: cases.filter(c => c.status === "On Hold").length, color: "#f59e0b" },
    { name: "Resolved/Closed", value: resolvedCount, color: "#10b981" },
  ];

  const recentCases = useMemo(() => cases.slice(0, 5), [cases]);
  const criticalAlerts = useMemo(() => alerts.filter(a => a.type === "critical" || a.type === "high").slice(0, 4), [alerts]);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "High":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "Medium":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Under Investigation":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      case "New":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Resolved":
      case "Closed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Platform Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase tracking-wider font-mono">
              Live Intelligence Platform
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Investigation Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cross-case entity analysis • Relationship network mapping • Real-time telemetry
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate("/cases?action=new")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
          >
            <Plus size={15} />
            <span>New Case</span>
          </button>
          <button
            onClick={() => navigate("/network")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all"
          >
            <Network size={15} className="text-violet-400" />
            <span>Case Network</span>
          </button>
          <button
            onClick={() => navigate("/investigations")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all"
          >
            <Fingerprint size={15} className="text-blue-400" />
            <span>Investigate</span>
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all"
          >
            <FileText size={15} className="text-amber-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Automated Pattern Insight Banner */}
      {analysis.insights.length > 0 && (
        <div className="p-4 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-transparent flex items-start gap-3.5 shadow-lg shadow-violet-950/30">
          <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex-shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider font-mono">
                Automated Pattern Intelligence
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                DSA Linked Traversal
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-0.5 leading-snug">
              {analysis.insights[0]}
            </p>
          </div>
          <button
            onClick={() => navigate("/investigations")}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0"
          >
            <span>Trace Chain</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              onClick={kpi.action}
              className={`stat-card p-4 rounded-2xl border ${kpi.border} bg-gradient-to-br ${kpi.color} bg-black/40 hover:bg-white/5 transition-all cursor-pointer group hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <Icon size={16} className={`${kpi.textColor} opacity-80 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
                {kpi.value}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1 font-medium flex items-center gap-1">
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution Chart */}
        <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Caseload by Priority
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Criticality spectrum</p>
            </div>
            <TrendingUp size={16} className="text-violet-400" />
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} barSize={28}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 12, 30, 0.95)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Investigation Pipeline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Workflow status ratios</p>
            </div>
            <Layers size={16} className="text-cyan-400" />
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 12, 30, 0.95)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/6">
            {statusChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-mono text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Intelligence Alerts */}
        <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Priority Alerts
              </h3>
            </div>
            {unreadAlertCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                {unreadAlertCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">Actionable items requiring investigator triage</p>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-56 pr-1">
            {criticalAlerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No active critical alerts logged.
              </div>
            ) : (
              criticalAlerts.map((alt) => (
                <div
                  key={alt.alertId}
                  onClick={() => alt.caseId ? navigate(`/cases/${alt.caseId}`) : navigate("/alerts")}
                  className="p-3 rounded-xl border border-red-500/25 bg-red-950/20 hover:bg-red-900/30 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-300 leading-tight">
                      {alt.title}
                    </span>
                    <span className="text-[10px] font-mono text-red-400 uppercase">
                      {alt.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate("/alerts")}
            className="mt-3 w-full py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Alerts</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Active Investigation Pipeline
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live case files sorted by chronological activity
            </p>
          </div>
          <button
            onClick={() => navigate("/cases")}
            className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <span>View All Cases ({cases.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto rounded-xl border border-white/6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.02] text-muted-foreground uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Title & Classification</th>
                <th className="py-3 px-4">Primary Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Investigator</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-slate-200">
              {recentCases.map((c) => (
                <tr
                  key={c.caseId}
                  onClick={() => navigate(`/cases/${c.caseId}`)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-violet-400">
                    {c.caseId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-md">
                      {c.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {c.suspectName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                    {c.investigator || "Senior Inv."}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cases/${c.caseId}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white transition-all text-[11px] font-semibold"
                    >
                      Open Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
