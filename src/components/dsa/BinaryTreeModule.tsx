import { useState } from "react";
import { BinaryTree } from "@/dsa/tree/BinaryTree";

export default function BinaryTreeModule() {
  const [inputVal, setInputVal] = useState("10, 20, 30, 40, 50, 60, 70");

  const getTree = () => {
    const arr = inputVal.split(",").map(s => s.trim() === "null" ? null : parseInt(s.trim())).filter(n => n === null || !isNaN(n));
    const tree = new BinaryTree();
    tree.insertLevelOrder(arr);
    return tree;
  };

  const tree = getTree();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Binary Tree Module</h3>
        <p className="text-xs text-muted-foreground">Preorder • Inorder • Postorder • Level Order Traversals • Tree Height & Count</p>
      </div>

      <div className="glass-card p-4">
        <label className="text-xs text-muted-foreground block mb-1">Tree Array (Level Order Insertion)</label>
        <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="intel-input" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Height</span>
          <span className="font-bold text-xl text-primary font-mono">{tree.getHeight()}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Node Count</span>
          <span className="font-bold text-xl text-accent font-mono">{tree.getNodeCount()}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border col-span-2">
          <span className="text-xs text-muted-foreground block">Level Order Depth</span>
          <span className="font-bold text-sm text-emerald font-mono">{JSON.stringify(tree.levelOrder())}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
        <div className="p-3 bg-secondary/50 rounded-lg border border-border space-y-1">
          <span className="text-primary font-bold">PREORDER (Root → Left → Right):</span>
          <p className="text-foreground">{JSON.stringify(tree.preorder())}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg border border-border space-y-1">
          <span className="text-accent font-bold">INORDER (Left → Root → Right):</span>
          <p className="text-foreground">{JSON.stringify(tree.inorder())}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg border border-border space-y-1">
          <span className="text-emerald font-bold">POSTORDER (Left → Right → Root):</span>
          <p className="text-foreground">{JSON.stringify(tree.postorder())}</p>
        </div>
      </div>
    </div>
  );
}
