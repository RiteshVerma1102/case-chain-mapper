import { useState } from "react";
import { isEvenBit, bitOperations, countSetBits, findSingleUniqueXOR, isPowerOfTwoBit } from "@/dsa/bitmanipulation/BitManipulation";

export default function BitManipulationModule() {
  const [numInput, setNumInput] = useState("29");
  const [kInput, setKInput] = useState("2");
  const [arrInput, setArrayInput] = useState("4, 1, 2, 1, 2");

  const num = parseInt(numInput) || 0;
  const k = parseInt(kInput) || 0;
  const nums = arrInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const evenInfo = isEvenBit(num);
  const bitOps = bitOperations(num, k);
  const setBits = countSetBits(num);
  const xorUnique = findSingleUniqueXOR(nums);
  const pow2 = isPowerOfTwoBit(num);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Bit Manipulation Module</h3>
        <p className="text-xs text-muted-foreground">Binary Representations • Bitwise AND/OR/XOR/NOT • Kernighan's Algorithm • XOR Unique</p>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Number (N)</label>
          <input type="number" value={numInput} onChange={(e) => setNumInput(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Bit Position (K)</label>
          <input type="number" value={kInput} onChange={(e) => setKInput(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Array (for XOR Unique)</label>
          <input type="text" value={arrInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="font-bold text-primary text-sm font-display">8-Bit Binary: {bitOps.binary}</p>
          <div className="space-y-1.5 border-t border-border pt-2 text-foreground">
            <div>Check Odd/Even: <span className="font-bold text-emerald">{evenInfo.explanation}</span></div>
            <div>Get Bit at {k}: <span className="font-bold text-accent">{bitOps.getBit.explanation}</span></div>
            <div>Set Bit at {k}: <span className="font-bold text-accent">{bitOps.setBit.explanation} ({bitOps.setBit.binary})</span></div>
            <div>Clear Bit at {k}: <span className="font-bold text-accent">{bitOps.clearBit.explanation} ({bitOps.clearBit.binary})</span></div>
            <div>Toggle Bit at {k}: <span className="font-bold text-accent">{bitOps.toggleBit.explanation} ({bitOps.toggleBit.binary})</span></div>
            <div>Power of Two Check: <span className="font-bold text-primary">{pow2.explanation}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="font-bold text-emerald text-sm font-display">Kernighan's Set Bit Count: {setBits.count}</p>
          <div className="space-y-1 max-h-36 overflow-y-auto border-t border-border pt-2 text-foreground">
            {setBits.steps.map((st, i) => (
              <div key={i}>[{i + 1}] {st}</div>
            ))}
          </div>
          <div className="border-t border-border pt-2">
            <p className="font-bold text-accent">XOR Single Unique Element: {xorUnique.unique}</p>
            <p className="text-[11px] text-muted-foreground">Steps: {xorUnique.steps.join(" → ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
