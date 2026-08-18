/**
 * ============================================================
 * BINARY SEARCH TREE (BST) MODULE
 * ============================================================
 * Real BST operations:
 * - Insert
 * - Search
 * - Delete
 * - Min / Max
 * - Inorder Traversal (proves sorted order)
 */

export class BSTNode {
  val: number;
  left: BSTNode | null = null;
  right: BSTNode | null = null;

  constructor(val: number) {
    this.val = val;
  }
}

export class BinarySearchTree {
  root: BSTNode | null = null;

  insert(val: number): void {
    const newNode = new BSTNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let curr = this.root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = newNode;
          break;
        }
        curr = curr.left;
      } else if (val > curr.val) {
        if (!curr.right) {
          curr.right = newNode;
          break;
        }
        curr = curr.right;
      } else {
        // Duplicate values ignored or handled
        break;
      }
    }
  }

  search(val: number): { found: boolean; path: number[] } {
    const path: number[] = [];
    let curr = this.root;

    while (curr) {
      path.push(curr.val);
      if (val === curr.val) return { found: true, path };
      if (val < curr.val) curr = curr.left;
      else curr = curr.right;
    }

    return { found: false, path };
  }

  findMin(node: BSTNode | null = this.root): number | null {
    if (!node) return null;
    let curr = node;
    while (curr.left) curr = curr.left;
    return curr.val;
  }

  findMax(node: BSTNode | null = this.root): number | null {
    if (!node) return null;
    let curr = node;
    while (curr.right) curr = curr.right;
    return curr.val;
  }

  delete(val: number): void {
    this.root = this.deleteNode(this.root, val);
  }

  private deleteNode(node: BSTNode | null, val: number): BSTNode | null {
    if (!node) return null;

    if (val < node.val) {
      node.left = this.deleteNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.deleteNode(node.right, val);
    } else {
      // Node found
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node with two children: get inorder successor (smallest in right subtree)
      const minVal = this.findMin(node.right)!;
      node.val = minVal;
      node.right = this.deleteNode(node.right, minVal);
    }
    return node;
  }

  inorder(): number[] {
    const res: number[] = [];
    function traverse(node: BSTNode | null) {
      if (!node) return;
      traverse(node.left);
      res.push(node.val);
      traverse(node.right);
    }
    traverse(this.root);
    return res;
  }
}
