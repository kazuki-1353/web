#include <stdio.h>
#include <stdlib.h>

typedef struct BiTnode
{
  int data;
  struct BiTnode *lchild, *rchild;
} BiTnode, *BiTree;

/* 先序遍历 */
void orderPre(BiTree root, void (*cb)())
{
  if (root == NULL)
    return;

  cb(root->data);             // 访问根节点
  orderPre(root->lchild, cb); // 遍历左子树
  orderPre(root->rchild, cb); // 遍历右子树
}

/* 中序遍历 */
void orderIn(BiTree root, void (*cb)())
{
  if (root == NULL)
    return;

  orderPre(root->lchild, cb); // 遍历左子树
  cb(root->data);             // 访问根节点
  orderPre(root->rchild, cb); // 遍历右子树
}

/* 后序遍历 */
void orderPost(BiTree root, void (*cb)())
{
  if (root == NULL)
    return;

  orderPre(root->lchild, cb); // 遍历左子树
  orderPre(root->rchild, cb); // 遍历右子树
  cb(root->data);             // 访问根节点
}

/* test-s */

/* test-e */
