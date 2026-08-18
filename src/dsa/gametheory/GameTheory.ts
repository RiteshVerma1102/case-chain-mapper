/**
 * ============================================================
 * GAME THEORY MODULE
 * ============================================================
 * Real Game Theory implementations:
 * 1. Nim Game (Bouton's Theorem using XOR Nim-Sum)
 * 2. Winning / Losing Position Evaluator
 */

export interface NimGameResult {
  piles: number[];
  nimSum: number;
  binaryNimSum: string;
  isWinningPosition: boolean;
  explanation: string;
  suggestedMoves: { pileIndex: number; removeAmount: number; newPileSize: number }[];
}

export function evaluateNimGame(piles: number[]): NimGameResult {
  let nimSum = 0;
  for (const p of piles) {
    nimSum ^= p;
  }

  const isWinningPosition = nimSum !== 0;
  const suggestedMoves: { pileIndex: number; removeAmount: number; newPileSize: number }[] = [];

  if (isWinningPosition) {
    // Find valid move to make Nim-Sum = 0
    piles.forEach((p, idx) => {
      const targetSize = p ^ nimSum;
      if (targetSize < p) {
        suggestedMoves.push({
          pileIndex: idx,
          removeAmount: p - targetSize,
          newPileSize: targetSize
        });
      }
    });
  }

  return {
    piles,
    nimSum,
    binaryNimSum: nimSum.toString(2),
    isWinningPosition,
    explanation: isWinningPosition
      ? `Nim-Sum = ${nimSum} (≠ 0). Player 1 has a WINNING strategy by making Nim-Sum = 0!`
      : `Nim-Sum = 0. Player 1 is in a LOSING position (assuming opponent plays optimally).`,
    suggestedMoves
  };
}
