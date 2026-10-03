import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Shield,
  FolderArchive,
  HardDrive,
  Banknote,
  Camera,
  Microscope,
  Box,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Archive,
  MapPin,
  UserCheck,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useCases, EvidenceItem } from "@/context/CaseContext";
import { toast } from "sonner";

export default function Evidence() {
  const { evidence, cases, entities, addEvidence, deleteEvidence } = useCases();

  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // New Evidence Form State
  const [formCaseId, setFormCaseId] = useState(cases[0]?.caseId || "CASE-2024-001");
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Digital");
  const [formStatus, setFormStatus] = useState<"Collected" | "In Analysis" | "Verified" | "Archived">("Collected");
  const [formLocation, setFormLocation] = useState("");
  const [formUploadedBy, setFormUploadedBy] = useState("Agent J. Miller");
  const [formDescription, setFormDescription] = useState("");
  const [formEntities, setFormEntities] = useState<string[]>([]);

  const filteredEvidence = useMemo(() => {
    let result = Array.isArray(evidence) ? [...evidence] : [];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          ((e.name || "")).toLowerCase().includes(q) ||
          ((e.description || "")).toLowerCase().includes(q) ||
          ((e.evidenceId || "")).toLowerCase().includes(q) ||
          ((e.caseId || "")).toLowerCase().includes(q)
      );
    }

    if (selectedCase !== "all") {
      result = result.filter((e) => e.caseId === selectedCase);
    }

    if (selectedStatus !== "all") {
      result = result.filter((e) => ((e.status || "")).toLowerCase() === selectedStatus.toLowerCase());
    }

    if (selectedType !== "all") {
      result = result.filter((e) => ((e.type || "")).toLowerCase().includes(selectedType.toLowerCase()));
    }

    return result;
  }, [evidence, search, selectedCase, selectedStatus, selectedType]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please enter evidence item title");
      return;
    }

    const item: Partial<EvidenceItem> = {
      evidenceId: `EVD-${Date.now().toString().slice(-5)}`,
      name: formName,
      caseId: formCaseId,
      type: formType,
      status: formStatus,
      description: formDescription,
      uploadedBy: formUploadedBy,
      relatedEntities: formEntities,
      createdAt: new Date().toISOString(),
    };

    const res = await addEvidence(item);
    if (res) {
      toast.success("Evidence item logged into chain of custody");
      setModalOpen(false);
      setFormName("");
      setFormDescription("");
      setFormLocation("");
      setFormEntities([]);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from evidence locker?`)) {
      await deleteEvidence(id);
    }
  };

  const getTypeIcon = (type?: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("digital") || t.includes("record")) return <HardDrive size={16} className="text-cyan-400" />;
    if (t.includes("financial")) return <Banknote size={16} className="text-amber-400" />;
    if (t.includes("surveillance") || t.includes("video")) return <Camera size={16} className="text-purple-400" />;
    if (t.includes("forensic") || t.includes("image")) return <Microscope size={16} className="text-rose-400" />;
    if (t.includes("physical")) return <Box size={16} className="text-emerald-400" />;
    return <FileText size={16} className="text-blue-400" />;
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("verified")) {
      return {
        bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        icon: <CheckCircle2 size={12} className="text-emerald-400" />,
      };
    }
    if (s.includes("analysis")) {
      return {
        bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        icon: <Clock size={12} className="text-amber-400" />,
      };
    }
    if (s.includes("archive")) {
      return {
        bg: "bg-slate-500/15 text-slate-400 border-slate-500/30",
        icon: <Archive size={12} className="text-slate-400" />,
      };
    }
    return {
      bg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      icon: <Shield size={12} className="text-sky-400" />,
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Management Locker"
        subtitle="Forensic chain of custody, physical artifacts, digital captures, and surveillance records"
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Log Evidence Item</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Total Evidence</span>
            <FileText size={16} className="text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{evidence.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Securely cataloged</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>In Analysis</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {evidence.filter((e) => e.status === "In Analysis").length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">Under forensic review</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Verified Custody</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {evidence.filter((e) => e.status === "Verified").length}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Courtroom admissible</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Cases Supported</span>
            <FolderArchive size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {new Set(evidence.map((e) => e.caseId)).size}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Dossiers with evidence</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence by title, ID, case reference, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Case Filter */}
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Cases ({cases.length})</option>
            {cases.map((c) => (
              <option key={c.caseId} value={c.caseId} className="bg-slate-900">
                {c.caseId} — {c.caseName.slice(0, 24)}...
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Statuses</option>
            <option value="Collected" className="bg-slate-900">Collected</option>
            <option value="In Analysis" className="bg-slate-900">In Analysis</option>
            <option value="Verified" className="bg-slate-900">Verified</option>
            <option value="Archived" className="bg-slate-900">Archived</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Types</option>
            <option value="Digital" className="bg-slate-900">Digital</option>
            <option value="Physical" className="bg-slate-900">Physical</option>
            <option value="Document" className="bg-slate-900">Document</option>
            <option value="Financial" className="bg-slate-900">Financial</option>
            <option value="Surveillance" className="bg-slate-900">Surveillance</option>
            <option value="Forensic" className="bg-slate-900">Forensic</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      {filteredEvidence.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/10 bg-white/5">
          <FileText size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-bold text-white">No evidence matches criteria</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting search keywords or filters, or log a newly acquired artifact above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((item) => {
            const badge = getStatusBadge(item.status);
            const relatedCase = cases.find((c) => c.caseId === item.caseId);

            return (
              <div
                key={item.evidenceId}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-violet-500/40 backdrop-blur-md transition-all duration-200"
              >
                <div>
                  {/* Card Header: Type & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white">
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{item.status}</span>
                      </span>

                      <button
                        onClick={() => handleDelete(item.evidenceId, item.name)}
                        className="p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove evidence"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Evidence ID */}
                  <div className="text-[11px] font-mono font-bold text-violet-400 mb-1">
                    {item.evidenceId}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {item.description || "No evidentiary summary provided."}
                  </p>
                </div>

                {/* Card Footer: Chain of custody metadata */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <UserCheck size={13} className="text-indigo-400" />
                      <span>{item.uploadedBy || "Forensic Tech"}</span>
                    </div>

                    <Link
                      to={`/cases/${item.caseId}`}
                      className="flex items-center gap-1 text-violet-400 hover:text-violet-300 font-mono font-semibold"
                    >
                      <FolderArchive size={12} />
                      <span>{item.caseId}</span>
                    </Link>
                  </div>

                  {item.relatedEntities && item.relatedEntities.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-muted-foreground">Entities:</span>
                      {item.relatedEntities.slice(0, 3).map((entId, idx) => {
                        const ent = entities.find((x) => x.entityId === entId);
                        return (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-sky-300"
                          >
                            {ent?.name || entId}
                          </span>
                        );
                      })}
                      {item.relatedEntities.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{item.relatedEntities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Log Evidence */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950 p-6 shadow-2xl shadow-violet-900/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-violet-400" />
                <h3 className="text-lg font-bold text-white">Log Evidence Artifact</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Associated Case *
                </label>
                <select
                  value={formCaseId}
                  onChange={(e) => setFormCaseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                  required
                >
                  {cases.map((c) => (
                    <option key={c.caseId} value={c.caseId} className="bg-slate-900">
                      {c.caseId} — {c.caseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Item Name / Artifact Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Encrypted SanDisk SSD (1TB) recovered from vehicle"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Digital" className="bg-slate-900">Digital / Media</option>
                    <option value="Document" className="bg-slate-900">Documentary</option>
                    <option value="Physical" className="bg-slate-900">Physical Artifact</option>
                    <option value="Financial" className="bg-slate-900">Financial Records</option>
                    <option value="Surveillance" className="bg-slate-900">Surveillance Capture</option>
                    <option value="Forensic" className="bg-slate-900">Forensic Biology/Trace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Chain of Custody Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Collected" className="bg-slate-900">Collected</option>
                    <option value="In Analysis" className="bg-slate-900">In Analysis</option>
                    <option value="Verified" className="bg-slate-900">Verified</option>
                    <option value="Archived" className="bg-slate-900">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Logged By / Recovering Officer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Det. K. Vance (#8841)"
                    value={formUploadedBy}
                    onChange={(e) => setFormUploadedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Secure Vault / Storage Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vault B, Locker 14"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Analysis Details & Chain Record
                </label>
                <textarea
                  rows={3}
                  placeholder="Record serial numbers, hash fingerprints, chain of custody signatures..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Linked Entities
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-white/5 border border-white/10">
                  {entities.map((ent) => {
                    const isSelected = formEntities.includes(ent.entityId);
                    return (
                      <button
                        key={ent.entityId}
                        type="button"
                        onClick={() =>
                          setFormEntities((prev) =>
                            isSelected ? prev.filter((id) => id !== ent.entityId) : [...prev, ent.entityId]
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? "bg-violet-600 text-white border-violet-400"
                            : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {ent.name} ({ent.type})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30"
                >
                  Log Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
