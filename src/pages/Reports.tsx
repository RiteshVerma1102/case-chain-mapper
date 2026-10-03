import { useState, useMemo } from "react";
import {
  Download,
  FileSpreadsheet,
  FolderArchive,
  FileText,
  CalendarClock,
  Users,
  Shield,
  CheckCircle2,
  Printer,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useCases } from "@/context/CaseContext";
import { generateCaseReportPDF } from "@/lib/pdfReportGenerator";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Reports() {
  const { cases, entities, relationships, timeline, evidence, exportJSON, exportCSV, buildEntityGraph } = useCases();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.caseId || "CASE-2024-001");
  const [includeEntities, setIncludeEntities] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeGraph, setIncludeGraph] = useState(true);

  const selectedCase = useMemo(() => {
    return cases.find((c) => c.caseId === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  const caseEntities = useMemo(() => {
    if (!selectedCase) return [];
    return entities.filter(
      (e) =>
        e.relatedCases?.includes(selectedCase.caseId) ||
        selectedCase.suspects?.includes(e.name) ||
        selectedCase.entitiesInvolved?.includes(e.entityId)
    );
  }, [entities, selectedCase]);

  const caseTimeline = useMemo(() => {
    if (!selectedCase) return [];
    return timeline.filter((t) => t.caseId === selectedCase.caseId);
  }, [timeline, selectedCase]);

  const caseEvidence = useMemo(() => {
    if (!selectedCase) return [];
    return evidence.filter((ev) => ev.caseId === selectedCase.caseId);
  }, [evidence, selectedCase]);

  const relatedCases = useMemo(() => {
    if (!selectedCase) return [];
    return cases.filter((c) => c.caseId !== selectedCase.caseId && selectedCase.relatedCases?.includes(c.caseId));
  }, [cases, selectedCase]);

  const handleDownloadPDF = () => {
    if (!selectedCase) {
      toast.error("Please select a case to generate report");
      return;
    }

    try {
      const g = buildEntityGraph();
      const bfs = g.bfs(selectedCase.entitiesInvolved?.[0] || selectedCase.suspects?.[0] || "");
      const dfs = g.dfs(selectedCase.entitiesInvolved?.[0] || selectedCase.suspects?.[0] || "");

      generateCaseReportPDF({
        caseData: selectedCase,
        relatedCases,
        entities: includeEntities ? caseEntities : [],
        relationships: includeGraph ? relationships : [],
        timeline: includeTimeline ? caseTimeline : [],
        evidence: includeEvidence ? caseEvidence : [],
        bfsTraversal: includeGraph ? bfs.order : [],
        dfsTraversal: includeGraph ? dfs.order : [],
      });

      toast.success(`Dossier PDF downloaded for ${selectedCase.caseId}`);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF dossier");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Dossier & Intelligence Briefings"
        subtitle="Generate courtroom-admissible PDF investigation dossiers, executive briefings, and chain of custody reports"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all cursor-pointer"
            >
              <Download size={16} />
              <span>Generate Dossier PDF</span>
            </button>
          </div>
        }
      />

      {/* Configuration & Filter Panel */}
      <div className="p-5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Select Investigation File for Dossier
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full md:max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              {cases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} — {c.caseName} ({c.priority} Priority)
                </option>
              ))}
            </select>
          </div>

          {/* Section Toggles */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Dossier Sections Included
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEntities}
                  onChange={(e) => setIncludeEntities(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span>Target Entities ({caseEntities.length})</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeline}
                  onChange={(e) => setIncludeTimeline(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span>Timeline Records ({caseTimeline.length})</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEvidence}
                  onChange={(e) => setIncludeEvidence(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span>Evidence Locker ({caseEvidence.length})</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGraph}
                  onChange={(e) => setIncludeGraph(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span>Graph Traversal & Links</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dossier Document Preview */}
      {selectedCase ? (
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute right-6 top-6 opacity-5 pointer-events-none select-none">
            <Shield size={260} />
          </div>

          {/* Header of Dossier */}
          <div className="border-b border-white/10 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold tracking-widest uppercase">
                    CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    REF: {selectedCase.caseId}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedCase.caseName}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Official Investigation File & Comprehensive Case Dossier • Generated {format(new Date(), "MMMM d, yyyy")}
                </p>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Printer size={14} />
                <span>Export Official PDF</span>
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/5 mb-6 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Status</span>
              <span className="font-bold text-emerald-400 text-sm">{selectedCase.status}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Priority</span>
              <span className="font-bold text-amber-400 text-sm">{selectedCase.priority}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Investigator</span>
              <span className="font-bold text-white text-sm">{selectedCase.investigator || "Senior Det."}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Date Opened</span>
              <span className="font-bold text-white text-sm">{selectedCase.date}</span>
            </div>
          </div>

          {/* Case Narrative */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
              1. Executive Case Summary & Objectives
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {selectedCase.description || "Active high-priority criminal investigation file."}
            </p>
          </div>

          {/* Suspects & Persons of Interest */}
          {includeEntities && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
                2. Target Entities & Persons of Interest ({caseEntities.length})
              </h4>
              {caseEntities.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No entities directly linked to this case file.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseEntities.map((ent) => (
                    <div
                      key={ent.entityId}
                      className="p-3.5 rounded-xl border border-white/5 bg-white/5 flex items-start justify-between"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{ent.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{ent.description}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-1">
                          ID: {ent.entityId} • {ent.type}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                        {ent.riskLevel || "Moderate"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline Records */}
          {includeTimeline && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
                3. Chronological Forensic Events ({caseTimeline.length})
              </h4>
              {caseTimeline.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No chronological events registered for this file.</p>
              ) : (
                <div className="space-y-2">
                  {caseTimeline.map((ev, idx) => (
                    <div
                      key={ev.eventId || idx}
                      className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{ev.title}</div>
                        <div className="text-slate-300 mt-0.5">{ev.description}</div>
                        {ev.location && (
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Location: {ev.location}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-violet-300 font-semibold">{ev.date}</span>
                        {ev.category && (
                          <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                            {ev.category}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Evidence Catalog */}
          {includeEvidence && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
                4. Evidence Locker & Chain of Custody ({caseEvidence.length})
              </h4>
              {caseEvidence.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No physical or digital evidence logged.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseEvidence.map((ev) => (
                    <div
                      key={ev.evidenceId}
                      className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-violet-400 font-bold">{ev.evidenceId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {ev.status}
                        </span>
                      </div>
                      <div className="font-bold text-white">{ev.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{ev.description}</div>
                      <div className="text-[10px] text-muted-foreground mt-2 pt-1 border-t border-white/5 flex items-center justify-between">
                        <span>Type: {ev.type}</span>
                        <span>Logged by: {ev.uploadedBy || "Forensics"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attestation Block */}
          <div className="pt-6 border-t border-white/10 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              <div className="font-bold text-slate-300">Certified by Investigating Unit</div>
              <div>CaseChain Intelligence Platform • Automated Cryptographic Audit Trail</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-slate-300">Classification: Level-3 CONFIDENTIAL</div>
              <div>Page 1 of 1 • System Document</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
