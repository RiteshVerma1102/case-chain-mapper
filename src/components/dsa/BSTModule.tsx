import { useState } from "react";
import { BinarySearchTree } from "@/dsa/bst/BST";

export default function BSTModule() {
  const [bst] = useState(() => {
    const tree = new BinarySearchTree();
    [50, 30, 70, 20, 40, 60, 80].forEach(v => tree.insert(v));
    return tree;
  });

  const [inputVal, setInputVal] = useState("40");
  const [, setTick] = useState(0);

  const handleInsert = () => {
    const v = parseInt(inputVal);
    if (!isNaN(v)) {
      bst.insert(v);
      setTick(t => t + 1);
    }
  };

  const handleDelete = () => {
    const v = parseInt(inputVal);
    if (!isNaN(v)) {
      bst.delete(v);
      setTick(t => t + 1);
    }
  };

  const searchRes = bst.search(parseInt(inputVal) || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Binary Search Tree (BST)</h3>
        <p className="text-xs text-muted-foreground">O(log n) Search, Insert, Delete • Inorder Property (Always Sorted)</p>
      </div>

      <div className="glass-card p-4 flex gap-3">
        <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="intel-input w-36" />
        <button onClick={handleInsert} className="intel-btn-primary text-xs">Insert Node</button>
        <button onClick={handleDelete} className="intel-btn text-xs text-destructive">Delete Node</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-xs">
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-muted-foreground block text-[10px]">MIN VALUE</span>
          <span className="font-bold text-lg text-emerald">{bst.findMin()}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-muted-foreground block text-[10px]">MAX VALUE</span>
          <span className="font-bold text-lg text-accent">{bst.findMax()}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-muted-foreground block text-[10px]">SEARCH ({inputVal})</span>
          <span className={`font-bold text-lg ${searchRes.found ? "text-emerald" : "text-destructive"}`}>
            {searchRes.found ? `FOUND (Path: ${searchRes.path.join("→")})` : "NOT FOUND"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-2 font-mono text-xs">
        <p className="font-bold text-primary text-sm font-display">INORDER TRAVERSAL (PROVES BST IS SORTED):</p>
        <div className="p-3 bg-secondary rounded-lg border border-border text-emerald font-bold text-sm">
          [{bst.inorder().join(", ")}]
        </div>
      </div>
    </div>
  );
}
