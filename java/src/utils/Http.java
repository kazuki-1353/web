import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.*;

public class Main {

  public static void main(String[] args) throws Exception {
    Http.Get("https://www.sina.com.cn/");
    Http.Post("https://www.sina.com.cn/", "username=bob&password=123456");
  }
}

class Http {

  // 全局HttpClient:
  static HttpClient httpClient = HttpClient.newBuilder().build();

  public static void Get(String url) throws Exception {
    URI uri = new URI(url);
    HttpRequest.Builder builder = HttpRequest.newBuilder(uri);

    /* 设置Header */
    // builder.header("User-Agent", ""); // 客户端自身标识信息
    // builder.header("Accept", "*/*"); // 客户端希望接收的数据类型

    /* 设置超时 */
    Duration timeout = Duration.ofSeconds(5);
    builder.timeout(timeout);

    /* 设置版本 */
    builder.version(HttpClient.Version.HTTP_2);

    HttpRequest request = builder.build();
    HttpResponse<String> response = httpClient.send(
      request,
      HttpResponse.BodyHandlers.ofString()
    );

    String res = response.body();
    System.out.println(res);
  }

  public static void Post(String url, String body) throws Exception {
    URI uri = new URI(url);
    HttpRequest.Builder builder = HttpRequest.newBuilder(uri);

    /* 设置Header */
    builder.header("Content-Type", "application/x-www-form-urlencoded");
    // builder.header("Accept", "*/*"); // 客户端希望接收的数据类型

    /* 设置超时 */
    Duration timeout = Duration.ofSeconds(5);
    builder.timeout(timeout);

    /* 设置版本 */
    builder.version(HttpClient.Version.HTTP_2);

    /* 使用POST并设置Body */
    builder.POST(
      HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8)
    );

    HttpRequest request = builder.build();
    HttpResponse<String> response = httpClient.send(
      request,
      HttpResponse.BodyHandlers.ofString()
    );

    String res = response.body();
    System.out.println(res);
  }
}
