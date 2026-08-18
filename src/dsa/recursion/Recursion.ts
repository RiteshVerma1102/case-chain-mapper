/**
 * ============================================================
 * RECURSION MODULE
 * ============================================================
 * Implementations of recursion with call stack / execution trace:
 * - Factorial
 * - Fibonacci
 * - Recursive Binary Search
 * - Merge Sort recursion depth
 */

export interface CallFrame {
  functionName: string;
  args: Record<string, unknown>;
  depth: number;
  returnVal?: unknown;
  description: string;
}

// ─── FACTORIAL RECURSIVE ────────────────────────────────────
export function recursiveFactorial(n: number): { result: number; callStack: CallFrame[] } {
  const callStack: CallFrame[] = [];

  function fact(num: number, depth: number): number {
    callStack.push({
      functionName: "factorial",
      args: { n: num },
      depth,
      description: `fact(${num}) called at depth ${depth}`
    });

    if (num <= 1) {
      callStack.push({
        functionName: "factorial",
        args: { n: num },
        depth,
        returnVal: 1,
        description: `Base case reached: fact(${num}) returns 1`
      });
      return 1;
    }

    const res = num * fact(num - 1, depth + 1);
    callStack.push({
      functionName: "factorial",
      args: { n: num },
      depth,
      returnVal: res,
      description: `fact(${num}) returns ${num} * fact(${num - 1}) = ${res}`
    });
    return res;
  }

  const result = fact(n, 1);
  return { result, callStack };
}

// ─── FIBONACCI RECURSIVE ────────────────────────────────────
export function recursiveFibonacci(n: number): { result: number; callStack: CallFrame[] } {
  const callStack: CallFrame[] = [];

  function fib(num: number, depth: number): number {
    callStack.push({
      functionName: "fibonacci",
      args: { n: num },
      depth,
      description: `fib(${num}) called at depth ${depth}`
    });

    if (num <= 0) return 0;
    if (num === 1) return 1;

    const res = fib(num - 1, depth + 1) + fib(num - 2, depth + 1);
    callStack.push({
      functionName: "fibonacci",
      args: { n: num },
      depth,
      returnVal: res,
      description: `fib(${num}) returns ${res}`
    });
    return res;
  }

  const result = fib(n, 1);
  return { result, callStack };
}

// ─── BINARY SEARCH RECURSIVE ────────────────────────────────
export function recursiveBinarySearch(
  arr: number[],
  target: number
): { resultIndex: number; callStack: CallFrame[] } {
  const callStack: CallFrame[] = [];

  function search(low: number, high: number, depth: number): number {
    callStack.push({
      functionName: "binarySearch",
      args: { low, high, target },
      depth,
      description: `search(low=${low}, high=${high}) at depth ${depth}`
    });

    if (low > high) return -1;

    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      callStack.push({
        functionName: "binarySearch",
        args: { mid, value: arr[mid] },
        depth,
        returnVal: mid,
        description: `Target ${target} found at mid=${mid}`
      });
      return mid;
    }

    if (arr[mid] > target) {
      return search(low, mid - 1, depth + 1);
    } else {
      return search(mid + 1, high, depth + 1);
    }
  }

  const resultIndex = search(0, arr.length - 1, 1);
  return { resultIndex, callStack };
}
