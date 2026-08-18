import { useState } from "react";
import { gcdEuclidean, lcm, isPrimeNumber, powerMod } from "@/dsa/numbertheory/NumberTheory";

export default function NumberTheoryModule() {
  const [aInput, setAInput] = useState("48");
  const [bInput, setBInput] = useState("18");
  const [baseInput, setBaseInput] = useState("2");
  const [expInput, setExpInput] = useState("10");
  const [modInput, setModInput] = useState("1000");

  const a = parseInt(aInput) || 1;
  const b = parseInt(bInput) || 1;
  const gcdRes = gcdEuclidean(a, b);
  const lcmRes = lcm(a, b);
  const primeA = isPrimeNumber(a);
  const modExpRes = powerMod(parseInt(baseInput) || 2, parseInt(expInput) || 1, parseInt(modInput) || 1000);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Number Theory Module</h3>
        <p className="text-xs text-muted-foreground">Euclidean GCD • LCM • Primality Test • Modular Fast Exponentiation</p>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Number A</label>
          <input type="number" value={aInput} onChange={(e) => setAInput(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Number B</label>
          <input type="number" value={bInput} onChange={(e) => setBInput(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Base ^ Exp</label>
          <div className="flex gap-1">
            <input type="number" value={baseInput} onChange={(e) => setBaseInput(e.target.value)} className="intel-input" />
            <input type="number" value={expInput} onChange={(e) => setExpInput(e.target.value)} className="intel-input" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Modulo (M)</label>
          <input type="number" value={modInput} onChange={(e) => setModInput(e.target.value)} className="intel-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="font-bold text-primary text-sm font-display">GCD & LCM Results</p>
          <div className="space-y-1">
            <p>GCD({a}, {b}) = <span className="font-bold text-emerald">{gcdRes.gcd}</span></p>
            <p>LCM({a}, {b}) = <span className="font-bold text-accent">{lcmRes.lcm}</span></p>
            <p>Primality check for {a}: <span className="font-bold text-primary">{primeA.explanation}</span></p>
          </div>
          <div className="border-t border-border pt-2 space-y-1 max-h-36 overflow-y-auto text-muted-foreground">
            <p className="text-foreground font-semibold">Euclidean Steps:</p>
            {gcdRes.steps.map((st, i) => (
              <div key={i}>[{i + 1}] {st}</div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="font-bold text-emerald text-sm font-display">Modular Exponentiation: ({baseInput}^{expInput}) % {modInput} = {modExpRes.result}</p>
          <div className="space-y-1 max-h-48 overflow-y-auto border-t border-border pt-2 text-foreground">
            {modExpRes.steps.map((st, i) => (
              <div key={i}>[{i + 1}] {st}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
