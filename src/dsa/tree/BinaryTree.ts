/**
 * ============================================================
 * BINARY TREE MODULE
 * ============================================================
 * Real Binary Tree implementation with:
 * - Node structure
 * - Insert / build
 * - Traversals: Preorder, Inorder, Postorder, Level Order
 * - Height & Node Count computation
 */

export class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(val: number) {
    this.val = val;
  }
}

export class BinaryTree {
  root: TreeNode | null = null;

  insertLevelOrder(arr: (number | null)[]): void {
    if (arr.length === 0 || arr[0] === null) return;

    this.root = new TreeNode(arr[0]);
    const queue: TreeNode[] = [this.root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
      const curr = queue.shift()!;

      if (i < arr.length && arr[i] !== null) {
        curr.left = new TreeNode(arr[i]!);
        queue.push(curr.left);
      }
      i++;

      if (i < arr.length && arr[i] !== null) {
        curr.right = new TreeNode(arr[i]!);
        queue.push(curr.right);
      }
      i++;
    }
  }

  preorder(): number[] {
    const res: number[] = [];
    function traverse(node: TreeNode | null) {
      if (!node) return;
      res.push(node.val);
      traverse(node.left);
      traverse(node.right);
    }
    traverse(this.root);
    return res;
  }

  inorder(): number[] {
    const res: number[] = [];
    function traverse(node: TreeNode | null) {
      if (!node) return;
      traverse(node.left);
      res.push(node.val);
      traverse(node.right);
    }
    traverse(this.root);
    return res;
  }

  postorder(): number[] {
    const res: number[] = [];
    function traverse(node: TreeNode | null) {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      res.push(node.val);
    }
    traverse(this.root);
    return res;
  }

  levelOrder(): number[][] {
    if (!this.root) return [];
    const result: number[][] = [];
    const queue: TreeNode[] = [this.root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: number[] = [];
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        currentLevel.push(node.val);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      result.push(currentLevel);
    }
    return result;
  }

  getHeight(node: TreeNode | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  getNodeCount(node: TreeNode | null = this.root): number {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }
}
