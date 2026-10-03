import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FolderArchive,
  Shield,
  User,
  MapPin,
  Calendar,
  Clock,
  Activity,
  Network,
  Users,
  FileText,
  CalendarClock,
  Sparkles,
  FileSpreadsheet,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Send,
} from "lucide-react";
import { useCases } from "@/context/CaseContext";
import { generateCaseReportPDF } from "@/lib/pdfReportGenerator";
import { toast } from "sonner";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    cases,
    entities,
    relationships,
    timeline,
    evidence,
    findRelatedCases,
    buildEntityGraph,
    addTimelineEvent,
    addEvidence,
  } = useCases();

  const [activeTab, setActiveTab] = useState<
    "overview" | "investigation" | "entities" | "relationships" | "evidence" | "timeline" | "network" | "notes" | "activity" | "reports"
  >("overview");

  // Specific Case lookup
  const currentCase = useMemo(() => {
    return cases.find((c) => c.caseId === id || (c as any)._id === id) || cases[0];
  }, [cases, id]);

  const relatedCases = useMemo(() => {
    if (!currentCase) return [];
    return findRelatedCases(currentCase.caseId);
  }, [currentCase, findRelatedCases]);

  // Entities associated with this case
  const caseEntities = useMemo(() => {
    if (!currentCase) return [];
    return entities.filter(
      (e) =>
        e.relatedCases?.includes(currentCase.caseId) ||
        e.name.toLowerCase() === currentCase.suspectName.toLowerCase()
    );
  }, [entities, currentCase]);

  // Relationships associated with this case
  const caseRelationships = useMemo(() => {
    if (!currentCase) return [];
    return relationships.filter((r) => r.caseId === currentCase.caseId);
  }, [relationships, currentCase]);

  // Timeline events for this case
  const caseTimeline = useMemo(() => {
    if (!currentCase) return [];
    return timeline
      .filter((t) => t.caseId === currentCase.caseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeline, currentCase]);

  // Evidence for this case
  const caseEvidence = useMemo(() => {
    if (!currentCase) return [];
    return evidence.filter((ev) => ev.caseId === currentCase.caseId);
  }, [evidence, currentCase]);

  // Notes state
  const [caseNotes, setCaseNotes] = useState<string[]>([
    "Initial scene forensics completed. No forced exterior lock cylinder damage detected.",
    "Wiretap authorization signed by presiding magistrate.",
    "Subpoena return from Swiss banking authority received and translated.",
  ]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setCaseNotes([newNote.trim(), ...caseNotes]);
    setNewNote("");
    toast.success("Investigator note appended to case docket");
  };

  const handleDownloadPDF = () => {
    if (!currentCase) return;
    const g = buildEntityGraph();
    const bfs = g.hasVertex(currentCase.suspectName) ? g.bfs(currentCase.suspectName).order : [];
    const dfs = g.hasVertex(currentCase.suspectName) ? g.dfs(currentCase.suspectName).order : [];

    generateCaseReportPDF({
      caseData: currentCase,
      relatedCases,
      entities: caseEntities,
      relationships: caseRelationships,
      timeline: caseTimeline,
      evidence: caseEvidence,
      bfsTraversal: bfs,
      dfsTraversal: dfs,
    });
    toast.success(`Generated official report for ${currentCase.caseId}`);
  };

  if (!currentCase) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Case Not Found</h2>
        <button
          onClick={() => navigate("/cases")}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          Return to Cases
        </button>
      </div>
    );
  }

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

  const tabs = [
    { id: "overview", label: "Overview", icon: FolderArchive },
    { id: "investigation", label: "Investigation", icon: Activity },
    { id: "entities", label: `Entities (${caseEntities.length})`, icon: Users },
    { id: "relationships", label: `Vectors (${caseRelationships.length})`, icon: Network },
    { id: "evidence", label: `Evidence (${caseEvidence.length})`, icon: FileText },
    { id: "timeline", label: `Timeline (${caseTimeline.length})`, icon: CalendarClock },
    { id: "network", label: "Case Network", icon: Network },
    { id: "notes", label: `Notes (${caseNotes.length})`, icon: Lightbulb },
    { id: "activity", label: "Activity Trail", icon: Clock },
    { id: "reports", label: "Report & PDF", icon: FileSpreadsheet },
  ] as const;

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Case Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/6 pb-5">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/cases")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors mt-1"
            title="Back to Cases"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-violet-400">
                {currentCase.caseId}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(currentCase.priority)}`}>
                {currentCase.priority}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(currentCase.status)}`}>
                {currentCase.status}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {currentCase.category || "Investigation"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              {currentCase.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <User size={12} className="text-violet-400" />
                <span>Primary Subject: <strong className="text-slate-200">{currentCase.suspectName}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-blue-400" />
                <span>Lead: {currentCase.investigator || "Senior Inv."}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-muted-foreground" />
                <span>Date: {currentCase.date}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Quick Report Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
          >
            <Download size={14} />
            <span>Export Case PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/6 pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-violet-600/25 border border-violet-500/40 text-white shadow-md shadow-violet-600/10"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={14} className={active ? "text-violet-300" : "text-muted-foreground"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case Narrative Dossier */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Case Narrative & Intelligence Brief
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentCase.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/6">
                <div>
                  <span className="text-[11px] text-muted-foreground uppercase font-mono">Location</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{currentCase.location || "Metro District"}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground uppercase font-mono">Case Progress</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${currentCase.progress || 40}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-violet-400">{currentCase.progress || 40}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground uppercase font-mono">Target Deadline</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{currentCase.deadline ? new Date(currentCase.deadline).toLocaleDateString() : "Active Hold"}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground uppercase font-mono">Security Tier</span>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">LEVEL-3 RESTRICTED</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Docket Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-muted-foreground">Connected Entities</span>
                  <span className="text-sm font-mono font-bold text-white">{caseEntities.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-muted-foreground">Relationship Vectors</span>
                  <span className="text-sm font-mono font-bold text-white">{caseRelationships.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-muted-foreground">Seized Evidence Items</span>
                  <span className="text-sm font-mono font-bold text-white">{caseEvidence.length}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-muted-foreground">Timeline Milestones</span>
                  <span className="text-sm font-mono font-bold text-white">{caseTimeline.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cases (Cross-Case Pattern Nexus) */}
          <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} className="text-violet-400" />
                  <span>Cross-Case Nexus Detection</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cases sharing entity "{currentCase.suspectName}" or common classification
                </p>
              </div>
              <span className="text-xs text-violet-400 font-mono font-bold">
                {relatedCases.length} Related
              </span>
            </div>

            {relatedCases.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No cross-case linkages detected yet for this subject.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedCases.map((rc) => (
                  <div
                    key={rc.caseId}
                    onClick={() => navigate(`/cases/${rc.caseId}`)}
                    className="p-3.5 rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-violet-400">{rc.caseId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(rc.priority)}`}>
                        {rc.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {rc.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {rc.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVESTIGATION */}
      {activeTab === "investigation" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Investigation Objectives & Hypotheses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 space-y-3">
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider font-mono">Active Objectives</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Establish physical and digital entry telemetry for {currentCase.location || "crime scene"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Cross-examine cellular metadata for suspect {currentCase.suspectName}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    <span>Trace outbound transaction vectors to offshore beneficiary repositories</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 space-y-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider font-mono">Working Hypotheses</span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">Operational Command</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">VALIDATED</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Subject {currentCase.suspectName} coordinated perimeter execution.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">Offshore Laundering</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">EVALUATING</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Proceeds routed through shell holdings in Delaware / Zurich.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENTITIES */}
      {activeTab === "entities" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Connected Intelligence Entities ({caseEntities.length})
            </h3>
            <button
              onClick={() => navigate("/entities")}
              className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              <span>Manage Entities</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {caseEntities.map((ent) => (
              <div
                key={ent.entityId}
                className="p-4 rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-violet-400">{ent.entityId}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">
                    {ent.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{ent.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{ent.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATIONSHIPS */}
      {activeTab === "relationships" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Case Relationship Vectors ({caseRelationships.length})
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/6 bg-white/[0.02] text-muted-foreground uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-3 px-4">Source Subject</th>
                  <th className="py-3 px-4">Relationship Vector</th>
                  <th className="py-3 px-4">Target Node</th>
                  <th className="py-3 px-4">Strength</th>
                  <th className="py-3 px-4">Intelligence Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6 text-slate-200">
                {caseRelationships.map((r) => (
                  <tr key={r.relationshipId} className="hover:bg-white/[0.03]">
                    <td className="py-3 px-4 font-semibold text-white">{r.sourceEntity}</td>
                    <td className="py-3 px-4 text-violet-400 font-mono">{r.type}</td>
                    <td className="py-3 px-4 font-semibold text-white">{r.targetEntity}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase">
                        {r.strength}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: EVIDENCE */}
      {activeTab === "evidence" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Evidence Locker Exhibits ({caseEvidence.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {caseEvidence.map((ev) => (
              <div
                key={ev.evidenceId}
                className="p-4 rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-violet-400">{ev.evidenceId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {ev.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{ev.name}</h4>
                <p className="text-xs text-muted-foreground">{ev.description}</p>
                <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Type: {ev.type}</span>
                  <span>Secured by: {ev.uploadedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Chronological Case Event Sequence ({caseTimeline.length})
          </h3>

          <div className="relative pl-6 space-y-4 border-l border-violet-500/30 ml-4 py-2">
            {caseTimeline.map((evt) => (
              <div key={evt.eventId} className="relative pl-4">
                <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-slate-900" />
                <div className="p-3.5 rounded-xl border border-white/6 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-violet-400 font-bold">{evt.time} — {evt.date}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300 font-mono">
                      {evt.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">{evt.description}</p>
                  {evt.location && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin size={11} /> {evt.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: NETWORK */}
      {activeTab === "network" && (
        <div className="p-6 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sub-Graph Network: {currentCase.caseId}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Primary node {currentCase.suspectName} and immediate connected entities
              </p>
            </div>
            <button
              onClick={() => navigate("/network")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              <span>Open Full Network</span>
              <ExternalLink size={13} />
            </button>
          </div>

          <div className="h-80 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Network size={36} className="text-violet-400 animate-pulse" />
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-white">Interactive Graph Engine Loaded</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Visualizing {caseEntities.length} entities and {caseRelationships.length} relationship vectors in real-time.
              </p>
            </div>
            <button
              onClick={() => navigate("/network")}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
            >
              Launch Interactive Canvas
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: NOTES */}
      {activeTab === "notes" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Investigator Docket Notes ({caseNotes.length})
          </h3>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Append formal observation or directive to docket..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20"
            >
              <Send size={13} />
              <span>Add Note</span>
            </button>
          </form>

          <div className="space-y-2.5">
            {caseNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/6 bg-white/[0.02] flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-200 leading-relaxed">{note}</p>
                  <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                    Logged by {currentCase.investigator || "Senior Investigator"} • Case Docket Entry #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: ACTIVITY */}
      {activeTab === "activity" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Investigative Audit Trail
          </h3>

          <div className="p-4 rounded-2xl border border-white/6 bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-white/6">
              <span className="text-white font-medium">Case Initialized</span>
              <span className="text-muted-foreground font-mono">{currentCase.date}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-white/6">
              <span className="text-white font-medium">Biometric & Handset Records Assigned</span>
              <span className="text-muted-foreground font-mono">{currentCase.date}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-white font-medium">Formal Dossier Compiled</span>
              <span className="text-emerald-400 font-mono">Current Active State</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: REPORTS */}
      {activeTab === "reports" && (
        <div className="p-6 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4 text-center animate-fade-in">
          <FileSpreadsheet size={40} className="mx-auto text-violet-400" />
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">Formal Intelligence Briefing PDF</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-page PDF featuring executive summary, metadata, entities table, chronological timeline, evidence inventory, and investigator certification.
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/20"
          >
            <Download size={15} />
            <span>Download Official Case Report (PDF)</span>
          </button>
        </div>
      )}
    </div>
  );
}
