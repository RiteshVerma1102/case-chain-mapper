/**
 * ============================================================
 * GENERAL PROBLEM SOLVING / MISC ALGORITHMS
 * ============================================================
 * Implementations of:
 * 1. Boyer-Moore Majority Element Algorithm
 * 2. Trapping Rain Water
 * 3. Rotate Array by K steps
 */

export function majorityElementBoyerMoore(arr: number[]): { candidate: number; count: number; isMajority: boolean; steps: string[] } {
  const steps: string[] = [];
  let candidate = arr[0];
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (count === 0) {
      candidate = arr[i];
      steps.push(`Index ${i}: Count is 0. Reset candidate to ${candidate}`);
    }

    if (arr[i] === candidate) {
      count++;
    } else {
      count--;
    }
    steps.push(`Index ${i} (val=${arr[i]}): candidate=${candidate}, count=${count}`);
  }

  // Verification pass
  let actualCount = 0;
  for (const num of arr) {
    if (num === candidate) actualCount++;
  }

  const isMajority = actualCount > Math.floor(arr.length / 2);

  return { candidate, count: actualCount, isMajority, steps };
}

export function trapRainWater(heights: number[]): { totalWater: number; steps: string[] } {
  const steps: string[] = [];
  let left = 0, right = heights.length - 1;
  let maxLeft = 0, maxRight = 0;
  let totalWater = 0;

  while (left < right) {
    if (heights[left] < heights[right]) {
      if (heights[left] >= maxLeft) {
        maxLeft = heights[left];
      } else {
        const trapped = maxLeft - heights[left];
        totalWater += trapped;
        steps.push(`At left idx ${left} (h=${heights[left]}): maxLeft=${maxLeft} → Trapped ${trapped} unit(s)`);
      }
      left++;
    } else {
      if (heights[right] >= maxRight) {
        maxRight = heights[right];
      } else {
        const trapped = maxRight - heights[right];
        totalWater += trapped;
        steps.push(`At right idx ${right} (h=${heights[right]}): maxRight=${maxRight} → Trapped ${trapped} unit(s)`);
      }
      right--;
    }
  }

  return { totalWater, steps };
}

export function rotateArrayK(arr: number[], k: number): { rotated: number[]; steps: string[] } {
  const steps: string[] = [];
  const n = arr.length;
  const effectiveK = k % n;
  const copy = [...arr];

  function reverseRange(l: number, r: number) {
    while (l < r) {
      [copy[l], copy[r]] = [copy[r], copy[l]];
      l++; r--;
    }
  }

  // 3-step reversal technique
  reverseRange(0, n - 1);
  steps.push(`Step 1: Reverse entire array → [${copy.join(", ")}]`);

  reverseRange(0, effectiveK - 1);
  steps.push(`Step 2: Reverse first ${effectiveK} elements → [${copy.join(", ")}]`);

  reverseRange(effectiveK, n - 1);
  steps.push(`Step 3: Reverse remaining ${n - effectiveK} elements → [${copy.join(", ")}]`);

  return { rotated: copy, steps };
}
