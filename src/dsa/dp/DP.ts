/**
 * ============================================================
 * DYNAMIC PROGRAMMING MODULE
 * ============================================================
 * Real DP implementations with full DP table tracking:
 * 1. Fibonacci (Memoization & Tabulation)
 * 2. 0/1 Knapsack
 * 3. Longest Common Subsequence (LCS)
 * 4. Coin Change
 * 5. Climbing Stairs
 */

export interface DPResult {
  result: number | string;
  dpTable: unknown;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

// ─── FIBONACCI DP ───────────────────────────────────────────
export function fibonacciDP(n: number): DPResult {
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 0;
  if (n > 0) dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return {
    result: dp[n],
    dpTable: dp,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    explanation: `Tabulation: dp[i] = dp[i-1] + dp[i-2]. Calculated dp[${n}] = ${dp[n]}`
  };
}

// ─── 0/1 KNAPSACK ───────────────────────────────────────────
export function knapsack01(weights: number[], values: number[], capacity: number): DPResult {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return {
    result: dp[n][capacity],
    dpTable: dp,
    timeComplexity: "O(n × W)",
    spaceComplexity: "O(n × W)",
    explanation: `Max value achievable for capacity ${capacity} is ${dp[n][capacity]}`
  };
}

// ─── LONGEST COMMON SUBSEQUENCE ─────────────────────────────
export function lcs(s1: string, s2: string): DPResult {
  const m = s1.length, n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS string
  let lcsStr = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcsStr = s1[i - 1] + lcsStr;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return {
    result: `Length: ${dp[m][n]} ("${lcsStr}")`,
    dpTable: dp,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    explanation: `LCS of "${s1}" and "${s2}" is "${lcsStr}" with length ${dp[m][n]}`
  };
}

// ─── COIN CHANGE (Min Coins) ────────────────────────────────
export function coinChangeMin(coins: number[], amount: number): DPResult {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }

  const res = dp[amount] === Infinity ? -1 : dp[amount];

  return {
    result: res,
    dpTable: dp.map(v => (v === Infinity ? "∞" : v)),
    timeComplexity: "O(amount × coins)",
    spaceComplexity: "O(amount)",
    explanation: res === -1
      ? `Amount ${amount} cannot be formed with coins [${coins.join(", ")}]`
      : `Minimum coins needed for amount ${amount} is ${res}`
  };
}

// ─── CLIMBING STAIRS ────────────────────────────────────────
export function climbingStairs(n: number): DPResult {
  if (n <= 1) return { result: 1, dpTable: [1], timeComplexity: "O(n)", spaceComplexity: "O(n)", explanation: `1 way to climb ${n} step` };

  const dp: number[] = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return {
    result: dp[n],
    dpTable: dp,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    explanation: `Distinct ways to climb ${n} stairs: ${dp[n]}`
  };
}
