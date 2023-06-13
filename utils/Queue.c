#include <stdio.h>
#include <stdlib.h>

#define MAX_Q_SIZE 100

/* 循环队列, 队尾为空元素, 若下一位置为队头时表示队满 */
typedef struct
{
  /* 储存空间 */ int *base;
  /* 队头指针 */ int front;
  /* 队尾指针 */ int rear;
} SqQueue;

/* 创建一个空的循环队列, 成功返回0, 失败返回-1 */
int init(SqQueue *Q)
{
  Q->base = (int *)malloc(MAX_Q_SIZE * sizeof(int));
  if (!Q->base)
    return -1;

  Q->front = 0;
  Q->rear = 0;

  return 0;
}

/* 元素入队, 成功返回0, 失败返回-1 */
int en(SqQueue *Q, int item)
{
  /* 下一个索引 */
  int next = (Q->rear + 1) % MAX_Q_SIZE;

  /* 判断是否队列已满 */
  if (next == Q->front)
    return -1;

  Q->base[Q->rear] = item; // 相当于 arr[rear]=item
  Q->rear = next;          // 更新队尾

  return 0;
}

/* 元素出队, 成功返回0, 失败返回-1 */
int del(SqQueue *Q, int *item)
{
  /* 判断是否队列为空 */
  if (Q->rear == Q->front)
    return -1;

  *item = Q->base[Q->front]; // 相当于 item=arr[front]

  /* 下一个索引 */
  int next = (Q->front + 1) % MAX_Q_SIZE;
  Q->front = next; // 更新队头

  return 0;
}