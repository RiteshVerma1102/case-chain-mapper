import { useCases } from "@/context/CaseContext";
import { Activity, Lock, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

export default function SystemHeader() {
  const { listSize, analyzePatterns, cases } = useCases();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const analysis = analyzePatterns();

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center px-6 gap-5 flex-shrink-0 z-20">
      <div className="flex items-center gap-2">
        <span className="font-display text-sm font-semibold tracking-tight text-foreground hidden sm:inline">
          Digital Case Investigation System
        </span>
      </div>

      <div className="flex-1" />

      {/* Status indicators */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="status-live">
          <span className="text-xs text-emerald hidden sm:inline">Online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={12} />
          <span className="text-xs hidden md:inline">Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={12} />
          <span className="text-xs hidden md:inline">Secure</span>
        </div>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        {analysis.priorityCounts.High > 0 && (
          <div className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-medium text-destructive">{analysis.priorityCounts.High} Critical</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Activity size={13} className="text-primary" />
          <span className="text-xs text-muted-foreground font-mono">{listSize} nodes</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </header>
  );
}
