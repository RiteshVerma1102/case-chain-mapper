/**
 * ============================================================
 * STACK MODULE
 * ============================================================
 * Real Stack implementation + Applications:
 * 1. Parentheses Validation
 * 2. Expression Evaluation
 * 3. Case Investigation History / Navigation Stack
 */

export class Stack<T> {
  private items: T[] = [];

  push(element: T): void {
    this.items.push(element);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

// ─── PARENTHESES VALIDATOR ──────────────────────────────────
export function validateParentheses(expr: string): { isValid: boolean; steps: string[] } {
  const stack = new Stack<string>();
  const steps: string[] = [];
  const matching: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (['(', '{', '['].includes(ch)) {
      stack.push(ch);
      steps.push(`Index ${i}: Pushed '${ch}' onto stack. Stack: [${stack.toArray().join(", ")}]`);
    } else if ([')', '}', ']'].includes(ch)) {
      if (stack.isEmpty()) {
        steps.push(`Index ${i}: Closing '${ch}' found but stack is empty! Invalid.`);
        return { isValid: false, steps };
      }
      const top = stack.pop();
      if (top !== matching[ch]) {
        steps.push(`Index ${i}: Mismatch! Top '${top}' does not match '${ch}'. Invalid.`);
        return { isValid: false, steps };
      }
      steps.push(`Index ${i}: Matched '${top}' with '${ch}'. Stack: [${stack.toArray().join(", ")}]`);
    }
  }

  const isValid = stack.isEmpty();
  if (!isValid) steps.push(`End of string reached but stack still contains unclosed brackets: [${stack.toArray().join(", ")}]`);
  else steps.push("All parentheses matched successfully!");

  return { isValid, steps };
}

// ─── POSTFIX EXPRESSION EVALUATION ─────────────────────────
export function evaluatePostfix(expr: string): { result: number; steps: string[] } {
  const stack = new Stack<number>();
  const steps: string[] = [];
  const tokens = expr.trim().split(/\s+/);

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
      steps.push(`Operand '${token}': Pushed onto stack. Stack: [${stack.toArray().join(", ")}]`);
    } else if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error("Invalid postfix expression");
      let res = 0;
      if (token === '+') res = a + b;
      if (token === '-') res = a - b;
      if (token === '*') res = a * b;
      if (token === '/') res = a / b;
      stack.push(res);
      steps.push(`Operator '${token}': Popped ${b} and ${a}, calculated ${a} ${token} ${b} = ${res}. Stack: [${stack.toArray().join(", ")}]`);
    }
  }

  return { result: stack.peek() ?? 0, steps };
}
