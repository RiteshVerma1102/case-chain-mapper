import { useState } from "react";
import { useCases } from "@/context/CaseContext";
import { CaseData, Priority, Status } from "@/lib/LinkedList";
import { Plus, CheckCircle } from "lucide-react";

export default function AddCaseForm() {
  const { addCase, listSize } = useCases();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium" as Priority,
    status: "Open" as Status,
    suspectName: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: CaseData = {
      caseId: `CASE-${String(listSize + 1).padStart(3, "0")}`,
      ...form,
    };
    addCase(newCase);
    setForm({ title: "", description: "", priority: "Medium", status: "Open", suspectName: "", date: new Date().toISOString().split("T")[0] });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">New Case</h2>
        <p className="text-sm text-muted-foreground mt-1">Insert at head of Linked List • O(1) time complexity</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 bg-secondary/50 px-5 py-3 border-b border-border">
          <Plus size={14} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Case Entry Form</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Case Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter case title..." className="intel-input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Suspect Name</label>
              <input required value={form.suspectName} onChange={(e) => setForm({ ...form, suspectName: e.target.value })} placeholder="Enter suspect name..." className="intel-input" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Case details..." className="intel-input resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Priority Level</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="intel-input">
                <option value="High">Critical</option>
                <option value="Medium">Moderate</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="intel-input">
                <option value="Open">Active</option>
                <option value="Closed">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Date Filed</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="intel-input" />
            </div>
          </div>

          <button
            type="submit"
            className={`intel-btn-primary text-sm font-medium ${success ? "!text-emerald !border-intel-emerald/30 !bg-intel-emerald/10" : ""}`}
          >
            {success ? <><CheckCircle size={14} /> Case Inserted Successfully</> : <><Plus size={14} /> Insert Case</>}
          </button>
        </form>
      </div>
    </div>
  );
}
