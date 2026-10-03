import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Filter,
  User,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Car,
  Phone,
  Mail,
  Shield,
  Trash2,
  ExternalLink,
  X,
  Network,
} from "lucide-react";
import { useCases, EntityItem } from "@/context/CaseContext";
import { toast } from "sonner";

export default function Entities() {
  const navigate = useNavigate();
  const { entities, addEntity, deleteEntity, relationships, cases } = useCases();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Person");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [relatedCaseInput, setRelatedCaseInput] = useState("CASE-001");

  // Selected Entity Modal (Detail inspector)
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(null);

  const filtered = useMemo(() => {
    return entities.filter((e) => {
      if (typeFilter !== "All" && e.type !== typeFilter) return false;
      if (riskFilter !== "All" && e.riskLevel !== riskFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${e.entityId} ${e.name} ${e.description} ${e.type}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [entities, searchQuery, typeFilter, riskFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Entity name is required");
      return;
    }

    await addEntity({
      name: name.trim(),
      type,
      description: description.trim(),
      riskLevel,
      relatedCases: relatedCaseInput.trim() ? [relatedCaseInput.trim()] : [],
    });

    setModalOpen(false);
    setName("");
    setDescription("");
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case "Person":
        return <User size={15} className="text-violet-400" />;
      case "Organization":
        return <Building2 size={15} className="text-blue-400" />;
      case "Location":
        return <MapPin size={15} className="text-emerald-400" />;
      case "Document":
      case "Evidence":
        return <FileText size={15} className="text-amber-400" />;
      case "Transaction":
        return <CreditCard size={15} className="text-cyan-400" />;
      case "Vehicle":
        return <Car size={15} className="text-rose-400" />;
      case "Phone":
        return <Phone size={15} className="text-purple-400" />;
      case "Email":
        return <Mail size={15} className="text-pink-400" />;
      default:
        return <Shield size={15} className="text-slate-400" />;
    }
  };

  const getRiskBadge = (r?: string) => {
    switch (r) {
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase tracking-wider font-mono">
              Entity Intelligence Directory
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {filtered.length} of {entities.length} items
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Entities Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Catalogue persons, corporations, vehicles, phone terminals, and assets across cases
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
        >
          <Plus size={15} />
          <span>Add Entity</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.03] to-transparent space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by entity name, ID, or description..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-muted-foreground text-xs outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Entity Types</option>
            <option value="Person">Person</option>
            <option value="Organization">Organization</option>
            <option value="Location">Location</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="Transaction">Transaction</option>
            <option value="Document">Document</option>
            <option value="Evidence">Evidence</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <div
            key={e.entityId}
            onClick={() => setSelectedEntity(e)}
            className="p-4.5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-violet-500/40 hover:bg-white/[0.06] transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  {getTypeIcon(e.type)}
                </div>
                <span className="font-mono text-xs font-bold text-violet-400">{e.entityId}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(e.riskLevel)}`}>
                {e.riskLevel || "Medium"}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                {e.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {e.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[10px]">
                {e.type}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-300">
                  {e.relatedCases?.length || 1} Case Link{e.relatedCases && e.relatedCases.length > 1 ? "s" : ""}
                </span>
                <button
                  onClick={(evt) => {
                    evt.stopPropagation();
                    if (window.confirm(`Delete entity "${e.name}"?`)) {
                      deleteEntity(e.entityId);
                    }
                  }}
                  className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Delete Entity"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ENTITY MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 18, 42, 0.98), rgba(12, 10, 28, 0.98))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <h3 className="text-base font-bold text-white">Add Entity Record</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entity Name / Handle *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Holdings Ltd or Marcus Webb"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entity Classification</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="Person">Person</option>
                    <option value="Organization">Organization</option>
                    <option value="Location">Location</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Transaction">Transaction</option>
                    <option value="Document">Document</option>
                    <option value="Evidence">Evidence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Risk Assessment</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Intel</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Background notes, known aliases, physical traits..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Linked Case ID</label>
                <input
                  type="text"
                  value={relatedCaseInput}
                  onChange={(e) => setRelatedCaseInput(e.target.value)}
                  placeholder="e.g. CASE-001"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedEntity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelectedEntity(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 18, 42, 0.98), rgba(12, 10, 28, 0.98))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-violet-400">{selectedEntity.entityId}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(selectedEntity.riskLevel)}`}>
                  {selectedEntity.riskLevel}
                </span>
              </div>
              <button onClick={() => setSelectedEntity(null)} className="text-muted-foreground hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{selectedEntity.name}</h3>
              <span className="text-xs text-violet-400 font-mono">{selectedEntity.type}</span>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedEntity.description}</p>
            </div>

            {selectedEntity.metadata && Object.keys(selectedEntity.metadata).length > 0 && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/6 space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Metadata Attributes</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedEntity.metadata).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-muted-foreground capitalize text-[11px]">{k}:</span>{" "}
                      <span className="text-white font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/8 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedEntity(null);
                  navigate(`/network`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white text-xs font-semibold transition-all"
              >
                <Network size={14} />
                <span>View in Case Network</span>
              </button>
              <button
                onClick={() => setSelectedEntity(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
