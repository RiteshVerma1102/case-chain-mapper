import { useState } from "react";
import { Stack, validateParentheses, evaluatePostfix } from "@/dsa/stack/Stack";
import { Layers } from "lucide-react";

export default function StackModule() {
  const [stack] = useState(() => new Stack<string>());
  const [itemInput, setItemInput] = useState("CASE-001 Investigation");
  const [parenthesesInput, setParenthesesInput] = useState("{[()]}");
  const [postfixInput, setPostfixInput] = useState("3 4 + 2 *");
  const [activeTab, setActiveTab] = useState<"stack" | "parentheses" | "postfix">("stack");
  const [stackArray, setStackArray] = useState<string[]>([]);

  const handlePush = () => {
    if (!itemInput) return;
    stack.push(itemInput);
    setStackArray(stack.toArray());
  };

  const handlePop = () => {
    stack.pop();
    setStackArray(stack.toArray());
  };

  const handleClear = () => {
    stack.clear();
    setStackArray(stack.toArray());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Stack Data Structure</h3>
        <p className="text-xs text-muted-foreground">LIFO (Last In First Out) • Push / Pop / Peek • Parentheses Validation • Postfix Evaluation</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("stack")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === "stack" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Interactive Stack
        </button>
        <button
          onClick={() => setActiveTab("parentheses")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === "parentheses" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Parentheses Validator
        </button>
        <button
          onClick={() => setActiveTab("postfix")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === "postfix" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Postfix Expression Evaluation
        </button>
      </div>

      {activeTab === "stack" && (
        <div className="space-y-4">
          <div className="glass-card p-4 flex gap-3">
            <input type="text" value={itemInput} onChange={(e) => setItemInput(e.target.value)} className="intel-input flex-1" />
            <button onClick={handlePush} className="intel-btn-primary text-xs">Push (LIFO)</button>
            <button onClick={handlePop} className="intel-btn text-xs text-destructive">Pop</button>
            <button onClick={handleClear} className="intel-btn text-xs">Clear</button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">TOP OF STACK</p>
            <div className="w-full max-w-md space-y-2 flex flex-col-reverse">
              {stackArray.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary border border-primary/40 font-mono text-xs text-foreground text-center font-bold">
                  {item} {idx === stackArray.length - 1 && <span className="text-primary font-bold ml-2">← TOP</span>}
                </div>
              ))}
              {stackArray.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-6">Stack is empty</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "parentheses" && (
        <div className="glass-card p-4 space-y-3">
          <label className="text-xs text-muted-foreground block">Expression String</label>
          <input type="text" value={parenthesesInput} onChange={(e) => setParenthesesInput(e.target.value)} className="intel-input" />
          <div className="p-4 bg-secondary rounded border border-border space-y-2 font-mono text-xs">
            {validateParentheses(parenthesesInput).steps.map((st, i) => (
              <div key={i} className="text-foreground">{st}</div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "postfix" && (
        <div className="glass-card p-4 space-y-3">
          <label className="text-xs text-muted-foreground block">Postfix Expression (space separated)</label>
          <input type="text" value={postfixInput} onChange={(e) => setPostfixInput(e.target.value)} className="intel-input" />
          <div className="p-4 bg-secondary rounded border border-border space-y-2 font-mono text-xs">
            {evaluatePostfix(postfixInput).steps.map((st, i) => (
              <div key={i} className="text-foreground">{st}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
