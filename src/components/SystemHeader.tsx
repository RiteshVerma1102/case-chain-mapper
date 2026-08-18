import { useCases } from "@/context/CaseContext";
import { Search, Undo, Redo, Download, Upload, RotateCcw, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SystemHeaderProps {
  onOpenCommandPalette?: () => void;
  onOpenShortcutsModal?: () => void;
}

export default function SystemHeader({ onOpenCommandPalette, onOpenShortcutsModal }: SystemHeaderProps) {
  const { undo, redo, canUndo, canRedo, exportJSON, exportCSV, importJSON, resetData } = useCases();
  const [time, setTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) importJSON(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="h-16 border-b border-black/5 bg-white/80 backdrop-blur-md flex items-center px-6 gap-4 flex-shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="font-display text-base font-bold tracking-tight text-[#1D1D1F]">
          D.C.I.S.
        </span>
        <span className="text-xs text-[#6E6E73] font-medium hidden sm:inline">
          Digital Case Intelligence
        </span>
      </div>

      {/* Global Command Search Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-black/5 text-xs text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E8E8ED] transition-all"
      >
        <Search size={14} className="text-[#0071E3]" />
        <span className="hidden md:inline">Search cases or commands...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 text-[10px] font-mono text-[#6E6E73] ml-2">Ctrl+K</kbd>
      </button>

      <div className="flex-1" />

      {/* Undo / Redo Stack Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo Case Action (Ctrl+Z)"
          className={`p-1.5 rounded-lg border transition-all ${
            canUndo ? "bg-[#F5F5F7] border-black/5 text-[#1D1D1F] hover:text-[#0071E3]" : "opacity-40 border-transparent text-[#6E6E73] cursor-not-allowed"
          }`}
        >
          <Undo size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo Case Action (Ctrl+Y)"
          className={`p-1.5 rounded-lg border transition-all ${
            canRedo ? "bg-[#F5F5F7] border-black/5 text-[#1D1D1F] hover:text-[#0071E3]" : "opacity-40 border-transparent text-[#6E6E73] cursor-not-allowed"
          }`}
        >
          <Redo size={14} />
        </button>
      </div>

      <div className="h-5 w-px bg-black/10" />

      {/* Data Import/Export Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-3 py-1.5 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] border border-black/5 hover:bg-[#E8E8ED] flex items-center gap-1.5 transition-all"
        >
          <Download size={13} className="text-[#0071E3]" />
          <span className="hidden lg:inline">Data Options</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-2xl shadow-xl p-1.5 z-50 text-xs space-y-1 font-sans">
            <button
              onClick={() => { exportJSON(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center gap-2"
            >
              <Download size={13} className="text-[#0071E3]" /> Export JSON
            </button>
            <button
              onClick={() => { exportCSV(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center gap-2"
            >
              <Download size={13} className="text-[#0071E3]" /> Export CSV
            </button>
            <button
              onClick={() => { fileInputRef.current?.click(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center gap-2"
            >
              <Upload size={13} className="text-[#2E7D32]" /> Import JSON
            </button>
            <button
              onClick={() => { resetData(); setDropdownOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F5F7] text-[#E53935] flex items-center gap-2"
            >
              <RotateCcw size={13} /> Reset Demo Data
            </button>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      </div>

      {/* Keyboard Shortcuts Button */}
      <button
        onClick={onOpenShortcutsModal}
        title="Keyboard Shortcuts (?)"
        className="p-2 rounded-full bg-[#F5F5F7] border border-black/5 text-[#6E6E73] hover:text-[#1D1D1F] transition-all"
      >
        <HelpCircle size={15} />
      </button>

      <div className="h-5 w-px bg-black/10" />

      {/* Clock */}
      <span className="text-xs text-[#6E6E73] font-mono tabular-nums hidden sm:inline">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </header>
  );
}
