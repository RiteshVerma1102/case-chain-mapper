/**
 * ============================================================
 * SLIDING WINDOW MODULE
 * ============================================================
 * Real Sliding Window implementations:
 * 1. Maximum Sum Subarray of Size K
 * 2. Longest Substring Without Repeating Characters
 * 3. Minimum Window Substring
 */

export interface WindowStep {
  left: number;
  right: number;
  currentSum?: number;
  maxSum?: number;
  currentWindow: unknown;
  description: string;
}

// ─── MAX SUM SUBARRAY OF SIZE K ─────────────────────────────
export function maxSumSubarrayK(arr: number[], k: number): { maxSum: number; bestWindow: number[]; steps: WindowStep[] } {
  const steps: WindowStep[] = [];
  if (arr.length < k) return { maxSum: 0, bestWindow: [], steps };

  let currentSum = 0;
  for (let i = 0; i < k; i++) currentSum += arr[i];

  let maxSum = currentSum;
  let bestStart = 0;

  steps.push({
    left: 0, right: k - 1,
    currentSum, maxSum,
    currentWindow: arr.slice(0, k),
    description: `Initial window [0..${k - 1}] sum = ${currentSum}`
  });

  for (let right = k; right < arr.length; right++) {
    const left = right - k + 1;
    currentSum = currentSum - arr[left - 1] + arr[right];

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = left;
    }

    steps.push({
      left, right,
      currentSum, maxSum,
      currentWindow: arr.slice(left, right + 1),
      description: `Slide window to [${left}..${right}]: subtracted ${arr[left - 1]}, added ${arr[right]}. Sum = ${currentSum}`
    });
  }

  return {
    maxSum,
    bestWindow: arr.slice(bestStart, bestStart + k),
    steps
  };
}

// ─── MINIMUM WINDOW SUBSTRING ────────────────────────────────
export function minWindowSubstring(s: string, t: string): { window: string; steps: WindowStep[] } {
  const steps: WindowStep[] = [];
  const map = new Map<string, number>();
  for (const ch of t) map.set(ch, (map.get(ch) || 0) + 1);

  let required = map.size;
  let left = 0, right = 0;
  let formed = 0;
  const windowCounts = new Map<string, number>();

  let minLen = Infinity;
  let minLeft = 0;

  while (right < s.length) {
    const ch = s[right];
    windowCounts.set(ch, (windowCounts.get(ch) || 0) + 1);

    if (map.has(ch) && windowCounts.get(ch) === map.get(ch)) {
      formed++;
    }

    while (left <= right && formed === required) {
      const currentSub = s.slice(left, right + 1);
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minLeft = left;
      }

      steps.push({
        left, right,
        currentWindow: currentSub,
        description: `Valid window "${currentSub}" (len ${right - left + 1}). Trying to shrink from left=${left}`
      });

      const leftChar = s[left];
      windowCounts.set(leftChar, windowCounts.get(leftChar)! - 1);
      if (map.has(leftChar) && windowCounts.get(leftChar)! < map.get(leftChar)!) {
        formed--;
      }
      left++;
    }

    right++;
  }

  return {
    window: minLen === Infinity ? "" : s.slice(minLeft, minLeft + minLen),
    steps
  };
}
