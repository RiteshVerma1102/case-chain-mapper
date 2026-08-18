/**
 * ============================================================
 * SIEVE OF ERATOSTHENES MODULE
 * ============================================================
 * Real Sieve algorithm to generate prime numbers up to N.
 * Tracks prime status per number visually.
 */

export interface SieveStep {
  currentPrime: number;
  markedComposites: number[];
  description: string;
}

export interface SieveResult {
  n: number;
  primes: number[];
  isPrimeArray: boolean[];
  steps: SieveStep[];
  timeComplexity: string;
  spaceComplexity: string;
}

export function generateSieve(n: number): SieveResult {
  const steps: SieveStep[] = [];
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      const marked: number[] = [];
      for (let i = p * p; i <= n; i += p) {
        if (isPrime[i]) {
          isPrime[i] = false;
          marked.push(i);
        }
      }
      steps.push({
        currentPrime: p,
        markedComposites: marked,
        description: `Prime ${p}: marking multiples [${marked.join(", ")}] as composite`
      });
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }

  return {
    n,
    primes,
    isPrimeArray: isPrime,
    steps,
    timeComplexity: "O(n log(log n))",
    spaceComplexity: "O(n)"
  };
}
