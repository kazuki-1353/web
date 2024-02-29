import java.util.Arrays;
import java.util.Comparator;

public class ArraySort {

  // public static void main(String[] args) {
  //   String[] array = { "apple", "Pear", "Banana", "orange" };
  //   ArraySort.bubbleSort(array, String::compareToIgnoreCase); // 忽略大小写
  //   System.out.println(Arrays.toString(array));
  // }

  /** 冒泡排序, 策略模式 */
  static <T> void bubbleSort(T[] a, Comparator<? super T> c) {
    int last = a.length - 1;

    /* 遍历第t轮 */
    for (int t = 0; t < last; t++) {
      /* 比较首个索引元素 ~ 最后索引-t的元素, 因为每轮都把最大的元素放到最后了 */
      for (int i = 0; i < last - t; i++) {
        // 比较两个元素的大小, 依赖传入的策略
        int res = c.compare(a[i], a[i + 1]);

        /* 如果前面元素比后面元素大 */
        if (res > 0) {
          T temp = a[i];
          a[i] = a[i + 1];
          a[i + 1] = temp;
        }
      }
    }
  }
}
