/**
 * ============================================================
 * BIT MANIPULATION MODULE
 * ============================================================
 * Real Bitwise operations:
 * 1. Check Odd/Even
 * 2. Get Bit / Set Bit / Clear Bit / Toggle Bit
 * 3. Count Set Bits (Kernighan's Algorithm)
 * 4. Find Single Unique Element using XOR
 * 5. Check Power of Two
 */

export function isEvenBit(n: number): { isEven: boolean; binary: string; explanation: string } {
  const binary = n.toString(2);
  const isEven = (n & 1) === 0;
  return {
    isEven,
    binary,
    explanation: `${n} & 1 = ${n & 1} → ${isEven ? "EVEN (LSB is 0)" : "ODD (LSB is 1)"}`
  };
}

export function bitOperations(n: number, k: number) {
  const binary = n.toString(2).padStart(8, '0');
  const getBit = (n >> k) & 1;
  const setBit = n | (1 << k);
  const clearBit = n & ~(1 << k);
  const toggleBit = n ^ (1 << k);

  return {
    n,
    k,
    binary,
    getBit: { val: getBit, explanation: `(n >> ${k}) & 1 = ${getBit}` },
    setBit: { val: setBit, binary: setBit.toString(2).padStart(8, '0'), explanation: `n | (1 << ${k}) = ${setBit}` },
    clearBit: { val: clearBit, binary: clearBit.toString(2).padStart(8, '0'), explanation: `n & ~(1 << ${k}) = ${clearBit}` },
    toggleBit: { val: toggleBit, binary: toggleBit.toString(2).padStart(8, '0'), explanation: `n ^ (1 << ${k}) = ${toggleBit}` }
  };
}

export function countSetBits(n: number): { count: number; binary: string; steps: string[] } {
  const steps: string[] = [];
  let temp = n;
  let count = 0;

  while (temp > 0) {
    steps.push(`n = ${temp} (${temp.toString(2)}): n & (n - 1) = ${temp & (temp - 1)} (${(temp & (temp - 1)).toString(2)})`);
    temp = temp & (temp - 1);
    count++;
  }

  return { count, binary: n.toString(2), steps };
}

export function findSingleUniqueXOR(arr: number[]): { unique: number; steps: string[] } {
  const steps: string[] = [];
  let xorSum = 0;

  for (const num of arr) {
    const prev = xorSum;
    xorSum ^= num;
    steps.push(`${prev} ^ ${num} = ${xorSum}`);
  }

  return { unique: xorSum, steps };
}

export function isPowerOfTwoBit(n: number): { isPower: boolean; explanation: string } {
  if (n <= 0) return { isPower: false, explanation: `${n} <= 0 → Not power of two` };
  const isPower = (n & (n - 1)) === 0;
  return {
    isPower,
    explanation: `${n} & (${n - 1}) = ${n & (n - 1)} → ${isPower ? "Power of Two ✓" : "Not Power of Two"}`
  };
}
