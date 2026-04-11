import { useMemo } from "react";
import { useCases } from "@/context/CaseContext";
import {
  TrendingUp, AlertTriangle, Eye, Target, Lightbulb, BarChart3,
  PieChart as PieIcon, Activity,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, CartesianGrid, Legend,
} from "recharts";

const COLORS = {
  high: "hsl(0 72% 56%)",
  medium: "hsl(38 92% 60%)",
  low: "hsl(152 60% 48%)",
  open: "hsl(220 60% 60%)",
  closed: "hsl(220 8% 52%)",
  gold: "hsl(38 92% 60%)",
  violet: "hsl(260 55% 60%)",
};

export default function AnalyticsPanel() {
  const { analyzePatterns, cases } = useCases();
  const analysis = useMemo(() => analyzePatterns(), [analyzePatterns, cases]);

  const priorityData = [
    { name: "Critical", value: analysis.priorityCounts.High, fill: COLORS.high },
    { name: "Moderate", value: analysis.priorityCounts.Medium, fill: COLORS.medium },
    { name: "Low Risk", value: analysis.priorityCounts.Low, fill: COLORS.low },
  ];

  const statusData = [
    { name: "Open", value: analysis.statusCounts.Open, fill: COLORS.open },
    { name: "Closed", value: analysis.statusCounts.Closed, fill: COLORS.closed },
  ];

  const timelineData = useMemo(() => {
    const map = new Map<string, { open: number; closed: number }>();
    for (const c of cases) {
      const month = new Date(c.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!map.has(month)) map.set(month, { open: 0, closed: 0 });
      const entry = map.get(month)!;
      if (c.status === "Open") entry.open++; else entry.closed++;
    }
    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, data]) => ({ month, ...data, total: data.open + data.closed }));
  }, [cases]);

  const suspectEntries = Object.entries(analysis.suspectFrequency).sort((a, b) => b[1] - a[1]);
  const suspectBarData = suspectEntries.map(([name, count]) => ({
    name: name.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
    cases: count,
    isTop: count === Math.max(...suspectEntries.map(e => e[1])) && count > 1,
  }));

  const statCards = [
    { label: "Total Cases", value: analysis.totalCases, icon: Target, color: "text-primary", accent: "border-primary/20" },
    { label: "Active", value: analysis.statusCounts.Open, icon: Eye, color: "text-accent", accent: "border-accent/20" },
    { label: "Critical", value: analysis.priorityCounts.High, icon: AlertTriangle, color: "text-destructive", accent: "border-destructive/20" },
    { label: "Resolved", value: analysis.statusCounts.Closed, icon: TrendingUp, color: "text-emerald", accent: "border-intel-emerald/20" },
  ];

  const tooltipStyle = {
    backgroundColor: "hsl(220 16% 12%)",
    border: "1px solid hsl(220 12% 22%)",
    borderRadius: "10px",
    color: "#e0e0e0",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Pattern Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">Intelligence engine • Real-time analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className={`metric-card ${s.accent} animate-fade-in`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard icon={BarChart3} title="Cases by Priority" iconColor="text-primary">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(220 60% 60% / 0.05)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard icon={PieIcon} title="Open vs Closed" iconColor="text-accent">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.85} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8}
                formatter={(value: string) => <span style={{ fontSize: '11px', color: '#9ca3af' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard icon={Activity} title="Case Timeline" iconColor="text-violet">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.open} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.open} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.closed} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.closed} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="open" stroke={COLORS.open} fill="url(#colorOpen)" strokeWidth={2} />
              <Area type="monotone" dataKey="closed" stroke={COLORS.closed} fill="url(#colorClosed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Insights + Suspect frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analysis.insights.length > 0 && (
          <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
            <div className="bg-primary/5 px-5 py-3 border-b border-primary/15 flex items-center gap-2">
              <Lightbulb size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Intelligence Insights</span>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {analysis.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}>
                    <div className="mt-0.5 h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <ChartCard icon={BarChart3} title="Suspect Frequency" iconColor="text-violet" height="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suspectBarData} layout="vertical" barSize={18}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cases" radius={[0, 6, 6, 0]}>
                {suspectBarData.map((entry, i) => <Cell key={i} fill={entry.isTop ? COLORS.high : COLORS.open} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priority Matrix */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-secondary/50 px-5 py-3 border-b border-border flex items-center gap-2">
            <AlertTriangle size={13} className="text-destructive" />
            <span className="text-sm font-medium text-foreground">Priority Matrix</span>
          </div>
          <div className="p-5 space-y-4">
            {(["High", "Medium", "Low"] as const).map((p) => {
              const count = analysis.priorityCounts[p];
              const pct = analysis.totalCases > 0 ? (count / analysis.totalCases) * 100 : 0;
              const colors = { High: { bar: "bg-destructive", text: "text-destructive", label: "Critical" }, Medium: { bar: "bg-primary", text: "text-primary", label: "Moderate" }, Low: { bar: "bg-intel-emerald", text: "text-emerald", label: "Low Risk" } };
              return (
                <div key={p}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className={`font-medium ${colors[p].text}`}>{colors[p].label}</span>
                    <span className="text-muted-foreground">{count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${colors[p].bar} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        {analysis.topKeywords.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-secondary/50 px-5 py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">Keyword Patterns</span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {analysis.topKeywords.map(([word, count]) => (
                  <span key={word} className="rounded-lg px-3 py-1.5 text-xs text-primary bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors">
                    {word} <span className="text-muted-foreground ml-1">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Suspect */}
        {analysis.mostFrequentSuspect && analysis.mostFrequentSuspect.count > 1 && (
          <div className="rounded-xl border border-destructive/20 bg-card overflow-hidden">
            <div className="bg-destructive/5 px-5 py-3 border-b border-destructive/15 flex items-center gap-2">
              <AlertTriangle size={13} className="text-destructive" />
              <span className="text-sm font-semibold text-foreground">Primary Suspect</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-destructive uppercase">
                      {analysis.mostFrequentSuspect.name[0]}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive flex items-center justify-center border-2 border-card">
                    <span className="text-[9px] font-bold text-destructive-foreground">{analysis.mostFrequentSuspect.count}</span>
                  </div>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground capitalize">{analysis.mostFrequentSuspect.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Linked to {analysis.mostFrequentSuspect.count} cases</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ icon: Icon, title, iconColor, children, height = "h-[220px]" }: { icon: React.ElementType; title: string; iconColor: string; children: React.ReactNode; height?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-secondary/50 px-5 py-3 border-b border-border flex items-center gap-2">
        <Icon size={13} className={iconColor} />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <div className={`p-4 ${height}`}>{children}</div>
    </div>
  );
}
