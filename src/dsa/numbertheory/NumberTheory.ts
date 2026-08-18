/**
 * ============================================================
 * NUMBER THEORY MODULE
 * ============================================================
 * Real Number Theory algorithms:
 * 1. GCD (Euclidean Algorithm)
 * 2. LCM
 * 3. Prime Checking
 * 4. Modular Exponentiation (Fast Exponentiation)
 */

export function gcdEuclidean(a: number, b: number): { gcd: number; steps: string[] } {
  const steps: string[] = [];
  let tempA = Math.abs(a);
  let tempB = Math.abs(b);

  while (tempB !== 0) {
    const rem = tempA % tempB;
    steps.push(`gcd(${tempA}, ${tempB}): ${tempA} = ${tempB} × ${Math.floor(tempA / tempB)} + ${rem}`);
    tempA = tempB;
    tempB = rem;
  }

  return { gcd: tempA, steps };
}

export function lcm(a: number, b: number): { lcm: number; gcd: number } {
  const g = gcdEuclidean(a, b).gcd;
  const l = Math.abs(a * b) / g;
  return { lcm: l, gcd: g };
}

export function isPrimeNumber(n: number): { isPrime: boolean; explanation: string } {
  if (n <= 1) return { isPrime: false, explanation: `${n} <= 1 → Not prime` };
  if (n <= 3) return { isPrime: true, explanation: `${n} is prime` };
  if (n % 2 === 0 || n % 3 === 0) return { isPrime: false, explanation: `${n} divisible by 2 or 3 → Not prime` };

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return { isPrime: false, explanation: `${n} divisible by ${i} or ${i + 2} → Not prime` };
    }
  }

  return { isPrime: true, explanation: `No divisors found up to √${n} → Prime!` };
}

export function powerMod(base: number, exp: number, mod: number): { result: number; steps: string[] } {
  const steps: string[] = [];
  let res = 1;
  let b = base % mod;
  let e = exp;

  while (e > 0) {
    if (e % 2 === 1) {
      res = (res * b) % mod;
      steps.push(`exp=${e} is odd: res = (res * ${b}) % ${mod} = ${res}`);
    }
    b = (b * b) % mod;
    e = Math.floor(e / 2);
    if (e > 0) steps.push(`Square base: b = ${b}, exp = ${e}`);
  }

  return { result: res, steps };
}
