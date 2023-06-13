#include <stdio.h>
#include <string.h>

/* 查找并返回子字串C在主字串M中的索引, 若无返回-1 */
int StringSearch(char M[], char C[], int pos)
{
  int Mi = pos;
  int Ml = strlen(M);

  int Ci = 0;
  int Cl = strlen(C);

  while (Mi < Ml && Ci < Cl)
  {
    /* 如果两个字符相等 */
    if (M[Mi] == C[Ci])
    {
      Mi++;
      Ci++;
    }
    else
    {
      Mi = Mi - Ci + 1; // 主字串指针回退后+1
      Ci = 0;           // 子字串指针归零
    }
  }

  /* 字串索引 >= 子字串长度 代表找到了 */
  int isFind = Ci >= Cl;

  /* 如果找到时, 主字串指针回退 */
  int index = isFind ? Mi - Cl : -1;
  return index;
}
