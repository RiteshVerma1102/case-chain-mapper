/**
 * ============================================================
 * GREEDY ALGORITHMS MODULE
 * ============================================================
 * Real Greedy implementations:
 * 1. Activity Selection / Interval Scheduling
 * 2. Fractional Knapsack
 * 3. Min Coin Change (Greedy)
 */

export interface GreedyStep {
  choice: string;
  reason: string;
  accumulatedResult: unknown;
}

// ─── ACTIVITY SELECTION ────────────────────────────────────
export interface Activity {
  id: string;
  start: number;
  finish: number;
}

export function activitySelection(activities: Activity[]): { selected: Activity[]; steps: GreedyStep[] } {
  const steps: GreedyStep[] = [];
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const selected: Activity[] = [];

  if (sorted.length === 0) return { selected, steps };

  selected.push(sorted[0]);
  steps.push({
    choice: `Selected Activity ${sorted[0].id}`,
    reason: `First activity to finish (finish time: ${sorted[0].finish})`,
    accumulatedResult: [...selected]
  });

  let lastFinish = sorted[0].finish;

  for (let i = 1; i < sorted.length; i++) {
    const act = sorted[i];
    if (act.start >= lastFinish) {
      selected.push(act);
      lastFinish = act.finish;
      steps.push({
        choice: `Selected Activity ${act.id}`,
        reason: `Start time (${act.start}) >= previous finish time (${lastFinish})`,
        accumulatedResult: [...selected]
      });
    } else {
      steps.push({
        choice: `Rejected Activity ${act.id}`,
        reason: `Conflict: Start time (${act.start}) < previous finish time (${lastFinish})`,
        accumulatedResult: [...selected]
      });
    }
  }

  return { selected, steps };
}

// ─── FRACTIONAL KNAPSACK ────────────────────────────────────
export interface Item {
  id: string;
  weight: number;
  value: number;
}

export function fractionalKnapsack(items: Item[], capacity: number): { totalValue: number; taken: { item: Item; fraction: number }[]; steps: GreedyStep[] } {
  const steps: GreedyStep[] = [];
  const sorted = [...items]
    .map(i => ({ ...i, ratio: i.value / i.weight }))
    .sort((a, b) => b.ratio - a.ratio);

  let currentCap = capacity;
  let totalValue = 0;
  const taken: { item: Item; fraction: number }[] = [];

  for (const item of sorted) {
    if (currentCap === 0) break;

    if (item.weight <= currentCap) {
      currentCap -= item.weight;
      totalValue += item.value;
      taken.push({ item, fraction: 1 });
      steps.push({
        choice: `Took FULL Item ${item.id}`,
        reason: `Highest value/weight ratio (${item.ratio.toFixed(2)}). Weight ${item.weight} <= Rem Cap ${currentCap + item.weight}`,
        accumulatedResult: { totalValue, remainingCapacity: currentCap }
      });
    } else {
      const fraction = currentCap / item.weight;
      totalValue += item.value * fraction;
      taken.push({ item, fraction });
      steps.push({
        choice: `Took ${(fraction * 100).toFixed(1)}% of Item ${item.id}`,
        reason: `Remaining capacity ${currentCap} < item weight ${item.weight}. Value added: ${(item.value * fraction).toFixed(2)}`,
        accumulatedResult: { totalValue, remainingCapacity: 0 }
      });
      currentCap = 0;
    }
  }

  return { totalValue, taken, steps };
}
