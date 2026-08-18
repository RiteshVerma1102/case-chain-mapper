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
  high: "#E53935",
  medium: "#D97706",
  low: "#2E7D32",
  open: "#0071E3",
  closed: "#6E6E73",
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
  }));

  const tooltipStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    color: "#1D1D1F",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 font-sans pb-16">
      {/* Editorial Header */}
      <div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#1D1D1F]">Analytics</h2>
        <p className="text-lg text-[#6E6E73] mt-1">Patterns become clearer when you see the data.</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Cases by Priority">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#F5F5F7' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(val) => <span className="text-xs text-[#6E6E73]">{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Timeline Activity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="open" stroke="#0071E3" fill="#0071E3" fillOpacity={0.15} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Suspect Frequency & Pattern Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.insights.length > 0 && (
          <div className="rounded-3xl bg-white border border-black/5 p-8 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-[#1D1D1F]">Intelligence Insights</h3>
            <ul className="space-y-3 font-sans text-sm text-[#1D1D1F]">
              {analysis.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">{i + 1}</span>
                  <span className="text-[#1D1D1F] leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ChartCard title="Suspect Frequency">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={suspectBarData} layout="vertical" barSize={18}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6E6E73' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#1D1D1F' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cases" fill="#0071E3" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white border border-black/5 p-6 shadow-sm space-y-4">
      <h3 className="font-display text-base font-bold text-[#1D1D1F]">{title}</h3>
      <div className="h-[220px]">{children}</div>
    </div>
  );
}
