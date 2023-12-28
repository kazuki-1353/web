public class StringUtils {

  /** 把字符串首字母大写, 其余小写 */
  public static String capitalize(String source) {
    if (source.length() == 0) {
      return source;
    }

    char first = source.charAt(0);
    String rest = source.substring(1);

    String str = Character.toUpperCase(first) + rest.toLowerCase();
    return str;
  }
}
