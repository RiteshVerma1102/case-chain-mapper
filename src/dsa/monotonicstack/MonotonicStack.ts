/**
 * ============================================================
 * MONOTONIC STACK MODULE
 * ============================================================
 * Real Monotonic Stack implementation for:
 * 1. Next Greater Element
 * 2. Next Smaller Element
 * 3. Daily Temperatures
 */

export interface MonotonicStep {
  index: number;
  value: number;
  stackContents: number[];
  description: string;
  resultState: number[];
}

// ─── NEXT GREATER ELEMENT ───────────────────────────────────
export function nextGreaterElement(arr: number[]): { result: number[]; steps: MonotonicStep[] } {
  const n = arr.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = []; // stores indices
  const steps: MonotonicStep[] = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] <= arr[i]) {
      stack.pop();
    }

    if (stack.length > 0) {
      result[i] = arr[stack[stack.length - 1]];
    }

    stack.push(i);

    steps.push({
      index: i,
      value: arr[i],
      stackContents: stack.map(idx => arr[idx]),
      description: `arr[${i}]=${arr[i]}: Popped smaller/equal elements. Next Greater = ${result[i]}`,
      resultState: [...result]
    });
  }

  return { result, steps };
}

// ─── NEXT SMALLER ELEMENT ───────────────────────────────────
export function nextSmallerElement(arr: number[]): { result: number[]; steps: MonotonicStep[] } {
  const n = arr.length;
  const result: number[] = new Array(n).fill(-1);
  const stack: number[] = [];
  const steps: MonotonicStep[] = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
      stack.pop();
    }

    if (stack.length > 0) {
      result[i] = arr[stack[stack.length - 1]];
    }

    stack.push(i);

    steps.push({
      index: i,
      value: arr[i],
      stackContents: stack.map(idx => arr[idx]),
      description: `arr[${i}]=${arr[i]}: Next Smaller = ${result[i]}`,
      resultState: [...result]
    });
  }

  return { result, steps };
}

// ─── DAILY TEMPERATURES ────────────────────────────────────
export function dailyTemperatures(temperatures: number[]): { result: number[]; steps: MonotonicStep[] } {
  const n = temperatures.length;
  const result: number[] = new Array(n).fill(0);
  const stack: number[] = [];
  const steps: MonotonicStep[] = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      result[prevIdx] = i - prevIdx;
      steps.push({
        index: i,
        value: temperatures[i],
        stackContents: stack.map(idx => temperatures[idx]),
        description: `Temp ${temperatures[i]} at day ${i} warmer than day ${prevIdx} (${temperatures[prevIdx]}). Wait: ${result[prevIdx]} day(s)`,
        resultState: [...result]
      });
    }
    stack.push(i);
  }

  return { result, steps };
}
