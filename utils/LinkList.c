#include <stdio.h>
#include <stdlib.h>

/* 链表 */
typedef struct node
{
  int value;
  struct node *next;
} NODE, *LinkList;

/* 返回在链表中第 i 个元素 */
LinkList find(LinkList list, int index)
{
  LinkList node = list->next;

  /* 计数器 */
  int i = 1;

  while (node && i < index)
  {
    node = node->next;
    i++;
  }

  if (node && i == index)
  {
    return node;
  }
  else
  {
    return NULL;
  }
}

/* 在链表的第 i 个元素前插入元素, 成功返回0, 失败返回-1 */
int insert(LinkList list, int value, int index)
{
  /* 获取插入位置的前一个节点 */
  LinkList preNode = index == 1 ? list : fine(list, index - 1);
  if (!preNode)
    return -1; // 不存在节点时终止

  /* 新元素的节点空间 */
  LinkList newNode = (NODE *)malloc(sizeof(NODE));
  if (!newNode)
    return -1;

  newNode->value = value;
  newNode->next = preNode->next;
  preNode->next = newNode;

  return 0;
}

/* 删除链表的第 i 个元素, 成功返回0, 失败返回-1 */
int delete(LinkList list, int index)
{
  /* 获取删除位置的前一个节点 */
  LinkList preNode = index == 1 ? list : find(list, index - 1);
  if (!preNode || !preNode->next)
    return -1; // 不存在节点时终止

  /* 要删除的节点 */
  LinkList delNode = preNode->next;

  preNode->next = delNode->next;
  free(delNode); // 删除节点

  return 0;
}
