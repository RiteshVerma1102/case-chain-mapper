import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  FolderArchive,
  Users,
  AlertTriangle,
  ArrowUpDown,
  Trash2,
  Calendar,
  X,
  ShieldAlert,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useCases, TimelineEventItem } from "@/context/CaseContext";
import { toast } from "sonner";

export default function Timeline() {
  const { timeline, cases, entities, addTimelineEvent, deleteTimelineEvent } = useCases();

  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [modalOpen, setModalOpen] = useState(false);

  // New Event Form State
  const [formCaseId, setFormCaseId] = useState(cases[0]?.caseId || "CASE-2024-001");
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState("12:00");
  const [formCategory, setFormCategory] = useState("Incident");
  const [formSignificance, setFormSignificance] = useState("High");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formEntities, setFormEntities] = useState<string[]>([]);

  // Filter & Sort
  const filteredEvents = useMemo(() => {
    let result = Array.isArray(timeline) ? [...timeline] : [];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          ((e.title || "")).toLowerCase().includes(q) ||
          ((e.description || "")).toLowerCase().includes(q) ||
          ((e.location || "")).toLowerCase().includes(q) ||
          ((e.caseId || "")).toLowerCase().includes(q)
      );
    }

    if (selectedCase !== "all") {
      result = result.filter((e) => e.caseId === selectedCase);
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (e) => (((e as any).eventType || e.category || "General")).toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [timeline, search, selectedCase, selectedCategory, sortOrder]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(timeline)) {
      timeline.forEach((e: any) => {
        const cat = e.category || e.eventType;
        if (cat) set.add(cat);
      });
    }
    return Array.from(set);
  }, [timeline]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    const newEv: Partial<TimelineEventItem> = {
      eventId: `EV-${Date.now().toString().slice(-5)}`,
      caseId: formCaseId,
      title: formTitle,
      date: formDate,
      time: formTime,
      category: formCategory,
      significance: formSignificance,
      location: formLocation,
      description: formDescription,
      entitiesInvolved: formEntities,
    };

    const res = await addTimelineEvent(newEv);
    if (res) {
      toast.success("Timeline event added to case dossier");
      setModalOpen(false);
      setFormTitle("");
      setFormLocation("");
      setFormDescription("");
      setFormEntities([]);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Remove event "${title}" from timeline?`)) {
      await deleteTimelineEvent(id);
    }
  };

  const getCategoryColor = (cat?: string) => {
    switch ((cat || "").toLowerCase()) {
      case "incident":
      case "arrest":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "transaction":
      case "financial":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "communication":
      case "surveillance":
        return "bg-sky-500/15 text-sky-400 border-sky-500/30";
      case "meeting":
      case "sighting":
        return "bg-violet-500/15 text-violet-400 border-violet-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    }
  };

  const getSignificanceBadge = (sig?: string) => {
    switch ((sig || "").toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chronological Investigation Timeline"
        subtitle="Forensic sequence of events, verified sightings, communications, and incidents across all active cases"
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/20 border border-violet-400/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Record Timeline Event</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Total Events</span>
            <CalendarClock size={16} className="text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{timeline.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Chronologically indexed</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Critical / High</span>
            <ShieldAlert size={16} className="text-red-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {timeline.filter((e) => ["critical", "high"].includes((e.significance || "").toLowerCase())).length}
          </div>
          <div className="text-[11px] text-red-400/80 mt-0.5">Key evidentiary milestones</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Cases Linked</span>
            <FolderArchive size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">
            {new Set(timeline.map((e) => e.caseId)).size}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Active files tracking events</div>
        </div>

        <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))" }}>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>Filter Matches</span>
            <Filter size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1.5">{filteredEvents.length}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Currently displayed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events, locations, descriptions, or case references..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Case Dropdown */}
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

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900">
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
            title="Toggle sort order"
          >
            <ArrowUpDown size={14} className="text-violet-400" />
            <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {/* Chronological Timeline Track */}
      {filteredEvents.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/10 bg-white/5">
          <CalendarClock size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-bold text-white">No timeline events found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query or case filter, or record a new chronological milestone above.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-violet-500/30 space-y-6 my-6 ml-3 sm:ml-4">
          {filteredEvents.map((event, idx) => {
            const relatedCase = cases.find((c) => c.caseId === event.caseId);
            return (
              <div key={event.eventId || idx} className="relative group animate-fade-in">
                {/* Glowing Node on Timeline Axis */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-violet-400 bg-slate-950 group-hover:scale-125 group-hover:bg-violet-500 transition-all duration-300 shadow-md shadow-violet-500/50"
                />

                {/* Event Card */}
                <div className="p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-violet-500/40 backdrop-blur-md transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Date & Time */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono text-xs font-semibold">
                          <Calendar size={13} className="text-violet-400" />
                          <span>{event.date}</span>
                          {event.time && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <Clock size={12} className="text-indigo-400" />
                              <span>{event.time}</span>
                            </>
                          )}
                        </div>

                        {/* Category */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${getCategoryColor(
                            event.category || (event as any).eventType
                          )}`}
                        >
                          {event.category || (event as any).eventType || "Milestone"}
                        </span>

                        {/* Significance */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSignificanceBadge(
                            event.significance || "High"
                          )}`}
                        >
                          {event.significance || "High"} Priority
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                        {event.title || event.description || "Forensic Milestone"}
                      </h3>
                    </div>

                    {/* Actions & Case Link */}
                    <div className="flex items-center gap-2 self-start">
                      <Link
                        to={`/cases/${event.caseId}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-mono font-medium transition-colors"
                        title={relatedCase?.caseName}
                      >
                        <FolderArchive size={13} />
                        <span>{event.caseId}</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(event.eventId, event.title || "Event")}
                        className="p-1.5 rounded-lg border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Footer details: Location & Involved Entities */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs text-muted-foreground">
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <MapPin size={13} className="text-rose-400" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {((event.entitiesInvolved && event.entitiesInvolved.length > 0) || (event as any).relatedEntity) && (
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-sky-400" />
                        <span className="font-semibold text-slate-400">Entities:</span>
                        <div className="flex flex-wrap gap-1">
                          {(event.entitiesInvolved || [(event as any).relatedEntity]).map((entId: string, i: number) => {
                            const ent = entities.find((x) => x.entityId === entId || x.name === entId);
                            return (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-sky-300 text-[11px]"
                              >
                                {ent?.name || entId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Timeline Event */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950 p-6 shadow-2xl shadow-violet-900/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CalendarClock size={20} className="text-violet-400" />
                <h3 className="text-lg font-bold text-white">Record Chronological Event</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
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
                  Event Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wire transfer executed through offshore account"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Incident" className="bg-slate-900">Incident</option>
                    <option value="Sighting" className="bg-slate-900">Sighting</option>
                    <option value="Communication" className="bg-slate-900">Communication</option>
                    <option value="Transaction" className="bg-slate-900">Financial / Transaction</option>
                    <option value="Meeting" className="bg-slate-900">Meeting</option>
                    <option value="Surveillance" className="bg-slate-900">Surveillance</option>
                    <option value="Arrest" className="bg-slate-900">Arrest / Apprehension</option>
                    <option value="Forensic" className="bg-slate-900">Forensic Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Significance Level
                  </label>
                  <select
                    value={formSignificance}
                    onChange={(e) => setFormSignificance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Critical" className="bg-slate-900">Critical Priority</option>
                    <option value="High" className="bg-slate-900">High Priority</option>
                    <option value="Medium" className="bg-slate-900">Medium Priority</option>
                    <option value="Low" className="bg-slate-900">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Location / Coordinates
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zurich Airport, Terminal 2 / Safehouse 4B"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Detailed Reconstruction Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the sequence of actions, verified evidence corroborating this event..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Involved Entities
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
