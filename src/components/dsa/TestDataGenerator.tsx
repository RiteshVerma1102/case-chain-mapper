import { useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

export default function TestDataGenerator() {
  const [size, setSize] = useState("10");
  const [minVal, setMinVal] = useState("1");
  const [maxVal, setMaxVal] = useState("100");
  const [order, setOrder] = useState<"random" | "sorted" | "reverse" | "duplicates">("random");
  const [copied, setCopied] = useState(false);

  const generateData = (): number[] => {
    const n = Math.min(100, Math.max(1, parseInt(size) || 10));
    const min = parseInt(minVal) || 1;
    const max = parseInt(maxVal) || 100;

    let res: number[] = [];
    if (order === "duplicates") {
      const choices = [min, Math.floor((min + max) / 2), max];
      for (let i = 0; i < n; i++) {
        res.push(choices[Math.floor(Math.random() * choices.length)]);
      }
    } else {
      for (let i = 0; i < n; i++) {
        res.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      if (order === "sorted") res.sort((a, b) => a - b);
      if (order === "reverse") res.sort((a, b) => b - a);
    }
    return res;
  };

  const data = generateData();
  const dataString = data.join(", ");

  const handleCopy = () => {
    navigator.clipboard.writeText(dataString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Random Test Data Generator</h3>
        <p className="text-xs text-muted-foreground">Generate Custom Array, Tree & Graph Test Inputs for Algorithm Testing</p>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Array Size (1-100)</label>
          <input type="number" value={size} onChange={(e) => setSize(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Min Value</label>
          <input type="number" value={minVal} onChange={(e) => setMinVal(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Max Value</label>
          <input type="number" value={maxVal} onChange={(e) => setMaxVal(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Ordering Mode</label>
          <select value={order} onChange={(e) => setOrder(e.target.value as any)} className="intel-input">
            <option value="random">Random</option>
            <option value="sorted">Sorted Ascending</option>
            <option value="reverse">Sorted Descending</option>
            <option value="duplicates">Heavy Duplicates</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <span className="font-bold text-primary text-sm font-display">Generated Dataset ({data.length} elements):</span>
          <button onClick={handleCopy} className="intel-btn-primary text-xs">
            {copied ? <Check size={14} className="mr-1 inline text-emerald" /> : <Copy size={14} className="mr-1 inline" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>

        <div className="p-3 bg-secondary rounded-lg border border-border text-foreground overflow-x-auto max-h-40 font-bold">
          [{dataString}]
        </div>
      </div>
    </div>
  );
}
