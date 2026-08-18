import { useEffect } from "react";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  const shortcuts = [
    { key: "Ctrl + K / Cmd + K", action: "Open Global Command Palette" },
    { key: "/", action: "Quick Focus Search" },
    { key: "Ctrl + Z", action: "Undo Case Operation (Stack-based)" },
    { key: "Ctrl + Y", action: "Redo Case Operation" },
    { key: "?", action: "Open Keyboard Shortcuts Help" },
    { key: "Esc", action: "Close Active Modal / Command Palette" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-primary" />
            <h3 className="font-display text-base font-bold text-foreground">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-secondary/50 border border-border flex justify-between items-center">
              <span className="font-sans text-foreground/90 text-xs">{sc.action}</span>
              <kbd className="px-2 py-1 rounded bg-card border border-primary/30 text-primary font-bold text-[11px]">{sc.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
