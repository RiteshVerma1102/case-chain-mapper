import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FolderArchive,
  Search,
  Plus,
  ArrowUpDown,
  Filter,
  Calendar,
  User,
  MapPin,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Grid,
  List as ListIcon,
  X,
} from "lucide-react";
import { useCases } from "@/context/CaseContext";
import { CaseData, Priority, Status } from "@/lib/LinkedList";
import { toast } from "sonner";

export default function Cases() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cases, addCase, updateCase, deleteCase, sortByPriority, sortByDate, loading } = useCases();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Create Case Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSuspect, setNewSuspect] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("High");
  const [newStatus, setNewStatus] = useState<Status>("Under Investigation");
  const [newCategory, setNewCategory] = useState("Theft");
  const [newLocation, setNewLocation] = useState("Metro District");
  const [newInvestigator, setNewInvestigator] = useState("Lead Investigator");

  // Edit Case Modal State
  const [editingCase, setEditingCase] = useState<CaseData | null>(null);

  // Check URL params for filters or actions
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new") setCreateModalOpen(true);

    const pri = searchParams.get("priority");
    if (pri) setPriorityFilter(pri);

    const stat = searchParams.get("status");
    if (stat) setStatusFilter(stat);
  }, [searchParams]);

  // Filtering
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter !== "All" && c.status !== statusFilter) return false;
      if (priorityFilter !== "All" && c.priority !== priorityFilter) return false;
      if (categoryFilter !== "All" && c.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${c.caseId} ${c.title} ${c.description} ${c.suspectName} ${c.location || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [cases, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Case title is required");
      return;
    }

    await addCase({
      title: newTitle.trim(),
      description: newDesc.trim(),
      suspectName: newSuspect.trim() || "Unknown",
      priority: newPriority,
      status: newStatus,
      category: newCategory,
      location: newLocation.trim(),
      investigator: newInvestigator.trim(),
      date: new Date().toISOString().split("T")[0],
    });

    setCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewSuspect("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;

    await updateCase(editingCase.caseId, {
      title: editingCase.title,
      description: editingCase.description,
      suspectName: editingCase.suspectName,
      priority: editingCase.priority,
      status: editingCase.status,
      category: editingCase.category,
      location: editingCase.location,
    });

    setEditingCase(null);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete case ${id}?`)) {
      await deleteCase(id);
    }
  };

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
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase tracking-wider font-mono">
              Investigation Registry
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {filteredCases.length} of {cases.length} cases
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Case Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Query, filter, and track multi-jurisdiction case intelligence dossiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Merge Sort by Priority */}
          <button
            onClick={sortByPriority}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title="Sort cases by priority using Linked List Merge Sort O(n log n)"
          >
            <ArrowUpDown size={14} className="text-violet-400" />
            <span>Sort by Priority</span>
          </button>

          {/* Merge Sort by Date */}
          <button
            onClick={sortByDate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title="Sort cases chronologically using Linked List Merge Sort"
          >
            <Calendar size={14} className="text-blue-400" />
            <span>Sort by Date</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
              }`}
              title="List View"
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
          </div>

          {/* Create Case Button */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
          >
            <Plus size={15} />
            <span>Create Case</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.03] to-transparent space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID (e.g. CASE-001), title, suspect, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-muted-foreground text-xs outline-none focus:border-violet-500/60 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 outline-none focus:border-violet-500/60"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="On Hold">On Hold</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 outline-none focus:border-violet-500/60"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 outline-none focus:border-violet-500/60"
          >
            <option value="All">All Categories</option>
            <option value="Theft">Theft</option>
            <option value="Fraud">Fraud</option>
            <option value="Cyber">Cyber</option>
            <option value="Narcotics">Narcotics</option>
            <option value="Homicide">Homicide</option>
            <option value="Financial">Financial</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Intelligence">Intelligence</option>
          </select>

          {(searchQuery || statusFilter !== "All" || priorityFilter !== "All" || categoryFilter !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setPriorityFilter("All");
                setCategoryFilter("All");
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Case Display: List or Grid */}
      {filteredCases.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/6 bg-white/[0.02] space-y-3">
          <FolderArchive size={36} className="mx-auto text-muted-foreground opacity-50" />
          <h3 className="text-base font-bold text-white">No investigation cases found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query or filters, or create a new case to start tracking.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all mt-2"
          >
            <Plus size={15} />
            <span>Create New Case</span>
          </button>
        </div>
      ) : viewMode === "list" ? (
        <div className="overflow-x-auto rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.02] to-transparent">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.03] text-muted-foreground uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Case Title & Brief</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Primary Subject</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Initialized</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 text-slate-200">
              {filteredCases.map((c) => (
                <tr
                  key={c.caseId}
                  onClick={() => navigate(`/cases/${c.caseId}`)}
                  className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-mono font-bold text-violet-400 whitespace-nowrap">
                    {c.caseId}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                      {c.description}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-300 border border-white/10 font-mono">
                      {c.category || "General"}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-violet-400" />
                      <span>{c.suspectName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                    {c.date}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCase(c);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                        title="Edit Case"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(c.caseId, e)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Case"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${c.caseId}`);
                        }}
                        className="p-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white transition-colors"
                        title="Open Details"
                      >
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <div
              key={c.caseId}
              onClick={() => navigate(`/cases/${c.caseId}`)}
              className="p-5 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-violet-500/40 hover:bg-white/[0.06] transition-all cursor-pointer group space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-violet-400">
                  {c.caseId}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(c.priority)}`}>
                  {c.priority}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {c.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-violet-400" />
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{c.suspectName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CASE MODAL */}
      {createModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 18, 42, 0.98), rgba(12, 10, 28, 0.98))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create Investigation Case</h3>
                <p className="text-xs text-muted-foreground">Log an official case record in CaseChain</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Harbor District Component Theft"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Narrative summary of incident and preliminary evidence..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Subject / Suspect</label>
                  <input
                    type="text"
                    value={newSuspect}
                    onChange={(e) => setNewSuspect(e.target.value)}
                    placeholder="e.g. Marcus Webb"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Pier 42 Terminal"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Status)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="New">New</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Classification</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Cyber">Cyber</option>
                    <option value="Narcotics">Narcotics</option>
                    <option value="Financial">Financial</option>
                    <option value="Homicide">Homicide</option>
                    <option value="Intelligence">Intelligence</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20"
                >
                  Save & Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CASE MODAL */}
      {editingCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setEditingCase(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 18, 42, 0.98), rgba(12, 10, 28, 0.98))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit Case: {editingCase.caseId}</h3>
                <p className="text-xs text-muted-foreground">Modify case intelligence parameters</p>
              </div>
              <button onClick={() => setEditingCase(null)} className="text-muted-foreground hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCase.description}
                  onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Subject</label>
                  <input
                    type="text"
                    value={editingCase.suspectName}
                    onChange={(e) => setEditingCase({ ...editingCase, suspectName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={editingCase.priority}
                    onChange={(e) => setEditingCase({ ...editingCase, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as Status })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="New">New</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingCase.location || ""}
                    onChange={(e) => setEditingCase({ ...editingCase, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
