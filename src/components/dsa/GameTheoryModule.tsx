import { useState } from "react";
import { evaluateNimGame } from "@/dsa/gametheory/GameTheory";
import { Gamepad2 } from "lucide-react";

export default function GameTheoryModule() {
  const [pilesInput, setPilesInput] = useState("3, 4, 5");

  const piles = pilesInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const nimResult = evaluateNimGame(piles);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Game Theory Module (Nim Game)</h3>
        <p className="text-xs text-muted-foreground">Bouton's Theorem • XOR Nim-Sum Analysis • Winning vs Losing Position</p>
      </div>

      <div className="glass-card p-4">
        <label className="text-xs text-muted-foreground block mb-1">Enter Pile Sizes (comma separated)</label>
        <input type="text" value={pilesInput} onChange={(e) => setPilesInput(e.target.value)} className="intel-input" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div>
            <span className="text-muted-foreground block text-[10px]">NIM-SUM (XOR SUM)</span>
            <span className="font-bold text-xl text-primary">{nimResult.nimSum} (Binary: {nimResult.binaryNimSum})</span>
          </div>
          <span className={`px-3 py-1.5 rounded-lg font-bold text-sm ${nimResult.isWinningPosition ? "bg-emerald/20 text-emerald" : "bg-destructive/20 text-destructive"}`}>
            {nimResult.isWinningPosition ? "WINNING POSITION" : "LOSING POSITION"}
          </span>
        </div>

        <p className="text-foreground text-sm font-sans">{nimResult.explanation}</p>

        {nimResult.suggestedMoves.length > 0 && (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-semibold text-emerald font-sans uppercase">Optimal Winning Move(s):</p>
            {nimResult.suggestedMoves.map((m, i) => (
              <div key={i} className="p-2.5 rounded bg-emerald/10 border border-emerald/30 text-emerald">
                From Pile #{m.pileIndex + 1} (size {piles[m.pileIndex]}), remove <span className="font-bold">{m.removeAmount}</span> token(s) to leave pile size <span className="font-bold">{m.newPileSize}</span>.
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
