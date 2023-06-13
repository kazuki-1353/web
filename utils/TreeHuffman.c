#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXLEAFNUM 50

typedef struct node
{
  int weight; /* 节点的权值 */
  int parent; /* 父节点的下标 */
  int lchild; /* 左子节点的下标 */
  int rchild; /* 右子节点的下标 */

  char ch;                           /* 作为叶子节点时的字符 */
} node, HuffmanTree[2 * MAXLEAFNUM]; // 总节点数 = 叶子节点数 + 权值节点数 + 1个留空(HT[0]表示无此节点)

/* 返回二叉树中两个权值最小的节点下标 */
int *get2Mins(HuffmanTree HT, int len)
{
  /* 缓存头2个下标 */
  static int res[2] = {0, 1};

  /* 从第3个下标开始 */
  for (int i = 2; i < len; i++)
  {
    int current = HT[i].weight;
    int min1 = HT[res[0]].weight;
    int min2 = HT[res[1]].weight;

    /* 如果大于两个缓存时跳过 */
    if (current > min1 && current > min2)
      continue;

    if (min1 > min2)
    {
      res[0] = i;
    }
    else
    {
      res[1] = i;
    }
  }

  return res;
}

/* 创建最优二叉树 */
void createHTree(
    HuffmanTree HT,
    char *c, /* 值数组 */
    int *w,  /* 权限数组 */
    int n    /* 数组长度 */
)
{
  if (n <= 1)
    return;

  int i;

  /* 前半为叶子节点, 根据 n 个权限值构造 n 颗只有根节点的二叉树 */
  for (i = 1; i <= n; i++)
  {
    HT[i].ch = c[i - 1];
    HT[i].weight = w[i - 1];

    HT[i].parent = 0;
    HT[i].lchild = 0;
    HT[i].rchild = 0;
  }

  /* 后半为权值节点, 个数为 n - 1 */
  for (i = n + 1; i < 2 * n; i++)
  {
    int *res = get2Mins(HT, i);
    int min1 = res[0];
    int min2 = res[1];

    HT[i].parent = 0;

    /* 左子节点 */
    HT[i].lchild = min1;
    HT[min1].parent = i;

    /* 右子节点 */
    HT[i].rchild = min2;
    HT[min2].parent = i;

    /* 权值为子节点合计 */
    HT[i].weight = HT[min1].weight + HT[min2].weight;
  }
}

typedef char *HuffmanCode[MAXLEAFNUM + 1];

/* 哈夫曼编码, 算出最优二叉树中所有叶子节点的编码后赋值给编码数组 */
void Encoding(HuffmanTree HT, int n, HuffmanCode HC)
{
  if (n <= 1)
    return;

  /* 编码字串 */
  char *cd = (char *)malloc(n * sizeof(char));
  cd[n - 1] = '\0'; // 添加字串的结束符

  /* 循环所有叶子节点 */
  for (int i = 0; i <= n; i++)
  {
    int start = n - 1;

    /* 从叶子节点向上遍历到树根节点 */
    for (int c = 0, f = HT[i].parent; f != 0; c = f, f = HT[f].parent)
    {
      if (HT[f].lchild == c)
      {
        cd[--start] = '0'; // 左
      }
      else
      {
        cd[--start] = '1'; // 右
      }
    }

    HC[i] = (char *)malloc((n - start) * sizeof(char)); // 分配当前编码长度的空间
    strcpy(HC[i], &cd[start]);                          // 赋值给编码数组
  }

  free(cd);
}

/* 哈夫曼解码 */
void Decoding(HuffmanTree HT, int n, char *buff, char *ch)
{
  int p = 2 * n - 1; // 树根节点的索引

  while (*buff)
  {
    if (buff[0] == '0')
    {
      p = HT[p].lchild;
    }
    else
    {
      p = HT[p].rchild;
    }

    /* 如果为叶子节点 */
    if (HT[p].lchild == 0 && HT[p].rchild == 0)
    {
      ch = HT[p].ch; // 传递叶子节点的字符
      p = 2 * n - 1; // 回到树根节点
    }

    buff++;
  }
}

/* test-s */

/* 返回数组中两个最小的数 */
// int *get2Mins(int *arr, int len)
// {
//   static int res[2];
//   res[0] = arr[0];
//   res[1] = arr[1];

//   for (int i = 2; i < len; i++)
//   {
//     if (arr[i] > res[0] && arr[i] > res[1])
//       continue;

//     if (res[0] > res[1])
//     {
//       res[0] = arr[i];
//     }
//     else
//     {
//       res[1] = arr[i];
//     }
//   }

//   return res;
// }
// int main()
// {

//   int arr[] = {3, 8, 2, 6, 1, 9, 7, 2, 4, 5};
//   int *res = get2Mins(arr, sizeof(arr) / sizeof(arr[0]));

//   printf("res[0]=%d; res[1]=%d;\n", res[0], res[1]);

//   return 0;
// }

/* test-e */
