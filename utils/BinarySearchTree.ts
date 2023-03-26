/**实例化节点 */
type TreeNode = null | CreateNode;
class CreateNode {
  constructor(key: number) {
    this.key = key;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  /**节点的健值 */ key: number;
  /**指向父节点的指针 */ parent: TreeNode;
  /**指向左节点的指针 */ left: TreeNode;
  /**指向右节点的指针 */ right: TreeNode;
}

class BinarySearchTree {
  constructor(key?: number) {
    if (key !== undefined) this.root = new CreateNode(key);
  }

  /**根节点 */
  root: TreeNode = null;

  /**向树中插入一个新的键 */
  insert(key: number) {
    let node = new CreateNode(key);

    if (this.root) {
      // 插入节点（传入根节点作为参数）
      this.insertNode(this.root, node);
    } else {
      // 如果树为空，直接将该节点作为根节点
      this.root = node;
    }
  }

  /**向节点中插入一个子节点 */
  insertNode(current: TreeNode, node: TreeNode) {
    if (!current || !node) return null;

    let { left, right } = current;

    // 判断是否应该插入左子节点
    if (current.key > node.key) {
      // 判断当前节点的左子节点是否存在
      if (left) {
        // 将要插入的节点与左子节点的后代继续比较，直到找到能够插入的位置
        this.insertNode(left, node);
      } else {
        // 直接在该左子节点处插入
        current.left = node;
        node.parent = current;
      }
    } else {
      if (right) {
        // 将要插入的节点与右子节点的后代继续比较，直到找到能够插入的位置
        this.insertNode(right, node);
      } else {
        // 直接在该右子节点处插入
        current.right = node;
        node.parent = current;
      }
    }
  }

  /**移除特定值并返回该节点, 允许传入子树 */
  remove(key: number, node = this.root): TreeNode {
    if (!node) return null;

    // 找到要删除的节点
    let current = this.find(key, node);
    if (!current) return null;

    this.removeNode(current);
    return current;
  }

  /**移除树中的一个节点, 返回该节点的父节点 */
  removeNode(node: TreeNode): TreeNode {
    if (!node) return null;

    let { parent, left, right } = node;

    // 判断是否存在父节点
    if (parent) {
      let position = this.findPosition(parent, node);

      switch (true) {
        // 该节点有左节点
        case !!left:
          parent[position] = left;
          break;

        // 该节点有右节点
        case !!right:
          parent[position] = right;
          break;

        // 该节点没有子节点
        default:
          parent[position] = null;
          break;
      }

      return parent;
    } else {
      this.root = null; // 如果没有父节点, 则移除根节点
      return null;
    }
  }

  /**搜索特定值, 允许传入子树 */
  find(key: number, node = this.root): TreeNode {
    if (!node) return null;

    let { key: currentKey, left, right } = node;

    switch (true) {
      // 如果要查找的值小于该节点，继续递归遍历其左侧节点
      case key < currentKey:
        return this.find(key, left);

      // 如果要查找的值大于该节点，继续递归遍历其右侧节点
      case key > currentKey:
        return this.find(key, right);

      // 如果要查找的值等于该节点，说明查找成功，返回改节点
      default:
        return node;
    }
  }

  /**查找父节点中子节点的位置 */
  findPosition(parent: TreeNode, node: TreeNode): string {
    switch (node) {
      case parent?.left:
        return 'left';

      case parent?.right:
        return 'right';

      default:
        throw new Error('父节点没有该子节点');
    }
  }

  /**搜索最小值, 允许传入子树 */
  min(node = this.root): TreeNode {
    if (node?.left) {
      // 一直遍历左侧子节点，直到底部
      return this.min(node.left);
    } else {
      return node;
    }
  }

  /**搜索最大值, 允许传入子树 */
  max(node = this.root): TreeNode {
    if (node?.right) {
      // 一直遍历右侧子节点，直到底部
      return this.max(node.right);
    } else {
      return node;
    }
  }

  /**先序遍历, 保证从左到右遍历节点 */
  preOrderTraverse(cb: (key: number) => void, node: TreeNode) {
    if (!node) return;

    let { key, left, right } = node;

    // 回调当前节点的值
    cb(key);

    // 先遍历左子节点, 再遍历右子节点
    this.preOrderTraverse(cb, left);
    this.preOrderTraverse(cb, right);
  }

  /**后序遍历, 保证从下到上遍历节点 */
  postOrderTraverse(cb: (key: number) => void, node: TreeNode) {
    if (!node) return;

    let { key, left, right } = node;

    // 先遍历左子节点, 再遍历右子节点
    this.postOrderTraverse(cb, left);
    this.postOrderTraverse(cb, right);

    // 回调当前节点的值
    cb(key);
  }

  /**中序遍历, 保证从小到大遍历节点 */
  inOrderTraverse(cb: (key: number) => void, node: TreeNode) {
    if (!node) return;

    let { key, left, right } = node;

    // 先遍历左子节点
    this.inOrderTraverse(cb, left);

    // 回调当前节点的值
    cb(key);

    // 再遍历左子节点
    this.inOrderTraverse(cb, right);
  }

  /**遍历 */
  each(cb: (key: number) => void, mode?: 'in' | 'pre' | 'post') {
    switch (mode) {
      case 'pre':
        this.preOrderTraverse(cb, this.root);
        break;

      case 'post':
        this.postOrderTraverse(cb, this.root);
        break;

      case 'in':
      default:
        this.inOrderTraverse(cb, this.root);
        break;
    }
  }

  /**遍历并返回数组 */
  map(cb: (key: number) => any, mode?: 'in' | 'pre' | 'post') {
    let arr: any[] = [];
    this.each((i) => {
      let item = cb(i);
      arr.push(item);
    }, mode);

    return arr;
  }
}

module.exports = BinarySearchTree;

/* 测试 */
let tree0 = new BinarySearchTree();
console.log(tree0.min() === null);
console.count('1');

let tree1 = new BinarySearchTree();
tree1.insert(4);
console.log(tree1.root?.key === 4);
console.log(tree1.min()?.key === 4);
console.count('2');

let tree2 = new BinarySearchTree(9);
tree2.insert(2);
tree2.insert(33);
tree2.insert(22);
tree2.insert(44);
console.log(tree2.root?.key === 9);
console.log(tree2.root?.right?.key === 33);
console.log(tree2.min()?.key === 2);
console.count('3');
console.log(tree2.find(1) === null);
console.log(tree2.find(2) === tree2.min());
console.log(tree2.find(22) !== tree2.max());
console.log(tree2.remove(44) === tree2.find(33));
console.count('3');
tree2.each((i) => {
  console.log(i);
}, 'pre');
console.count('3');
tree2.each((i) => {
  console.log(i);
}, 'post');
console.count('3');
tree2.each((i) => {
  console.log(i);
});
console.count('3');
console.log(tree2.map((i) => i * 2));
console.count('3');
/* 测试 */
