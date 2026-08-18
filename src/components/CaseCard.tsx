import { CaseData } from "@/lib/LinkedList";
import { Trash2, AlertTriangle, CheckCircle, Clock, User, ArrowRight } from "lucide-react";

interface CaseCardProps {
  caseData: CaseData;
  onDelete?: (id: string) => void;
  onSelect?: (c: CaseData) => void;
  index?: number;
  showDelete?: boolean;
}

export default function CaseCard({ caseData, onDelete, onSelect, index = 0, showDelete = true }: CaseCardProps) {
  const { caseId, title, description, priority, status, suspectName, date } = caseData;

  const dotColor = priority === "High" ? "bg-[#E53935]" : priority === "Medium" ? "bg-[#D97706]" : "bg-[#2E7D32]";

  return (
    <div
      className="group relative rounded-3xl border border-black/5 bg-white p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#0071E3]/30 animate-fade-in flex flex-col justify-between"
      style={{ animationDelay: `${index * 40}ms`, opacity: 0 }}
      onClick={() => onSelect?.(caseData)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
            <span className="font-mono text-xs text-[#6E6E73] font-semibold">{caseId}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              status === "Open" ? "bg-[#0071E3]/10 text-[#0071E3]" : "bg-[#E8E8ED] text-[#6E6E73]"
            }`}>
              {status}
            </span>
            {showDelete && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(caseId); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-[#FEE2E2] text-[#E53935] transition-all"
                title="Delete Case"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#1D1D1F] leading-snug tracking-tight group-hover:text-[#0071E3] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#6E6E73] leading-relaxed line-clamp-2">
          {description || "No description logged for this investigation file."}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-5 mt-4 border-t border-black/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#6E6E73]">
            <User size={12} />
          </div>
          <span className="font-medium text-[#1D1D1F]">{suspectName}</span>
        </div>

        <span className="text-[#0071E3] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          View <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
