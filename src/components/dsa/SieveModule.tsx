import { useState } from "react";
import { generateSieve } from "@/dsa/sieve/Sieve";

export default function SieveModule() {
  const [nInput, setNInput] = useState("50");

  const n = Math.min(200, Math.max(2, parseInt(nInput) || 30));
  const sieveResult = generateSieve(n);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Sieve of Eratosthenes Module</h3>
        <p className="text-xs text-muted-foreground">Prime Generation in O(n log(log n)) • Visual Number Grid • Composite Crossing</p>
      </div>

      <div className="glass-card p-4 flex items-center gap-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Generate Primes Up To N (Max 200)</label>
          <input
            type="number"
            value={nInput}
            onChange={(e) => setNInput(e.target.value)}
            className="intel-input w-36"
          />
        </div>
        <div className="text-xs text-muted-foreground pt-4">
          Found <span className="font-bold text-emerald">{sieveResult.primes.length}</span> prime numbers up to {n}
        </div>
      </div>

      {/* Grid Visualization */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Number Grid (Green = Prime, Red/Muted = Composite)</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5 font-mono text-xs">
          {Array.from({ length: n }, (_, i) => i + 1).map((num) => {
            const isPrime = sieveResult.isPrimeArray[num];
            return (
              <div
                key={num}
                className={`h-8 rounded flex items-center justify-center font-bold border transition-all ${
                  num === 1
                    ? "bg-secondary text-muted-foreground border-border opacity-40 line-through"
                    : isPrime
                    ? "bg-emerald/20 text-emerald border-emerald/40"
                    : "bg-secondary/40 text-muted-foreground border-border/40 opacity-60 line-through"
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Traces */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Sieve Execution Trace ({sieveResult.steps.length} passes)</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {sieveResult.steps.map((st, i) => (
            <div key={i} className="p-2 rounded bg-secondary/40 border border-border/50 text-xs font-mono text-foreground/90">
              <span className="text-muted-foreground mr-2">[{i + 1}]</span>
              {st.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
