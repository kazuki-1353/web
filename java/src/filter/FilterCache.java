import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.WriteListener;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;

@WebFilter("/cache/*")
public class FilterCache implements Filter {

  // Path到byte[]的缓存:
  private ConcurrentHashMap<String, byte[]> cache = new ConcurrentHashMap<>();

  @Override
  public void doFilter(
    ServletRequest request,
    ServletResponse response,
    FilterChain chain
  ) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse res = (HttpServletResponse) response;

    // 获取Path:
    String url = req.getRequestURI();

    // 获取缓存内容:
    byte[] data = this.cache.get(url);

    res.setHeader("X-Cache-Hit", data == null ? "No" : "Yes");

    if (data == null) {
      // 缓存未找到,构造一个伪造的Response:
      CachedHttpServletResponse wrapper = new CachedHttpServletResponse(res);
      // 让下游组件写入数据到伪造的Response:
      chain.doFilter(request, wrapper);
      // 从伪造的Response中读取写入的内容并放入缓存:
      data = wrapper.getContent();
      cache.put(url, data);
    }

    // 写入到原始的Response:
    ServletOutputStream os = res.getOutputStream();
    os.write(data);
    os.flush();
  }
}

/** 构造一个伪造的HttpServletResponse */
class CachedHttpServletResponse extends HttpServletResponseWrapper {

  private boolean open = false;
  private ByteArrayOutputStream os = new ByteArrayOutputStream();

  public CachedHttpServletResponse(HttpServletResponse res) {
    super(res);
  }

  // 获取Writer:
  @Override
  public PrintWriter getWriter() throws IOException {
    if (open) throw new IllegalStateException("Cannot re-open writer!");

    open = true;
    return new PrintWriter(os, false, StandardCharsets.UTF_8);
  }

  // 获取OutputStream:
  @Override
  public ServletOutputStream getOutputStream() throws IOException {
    if (open) throw new IllegalStateException("Cannot re-open output stream!");

    open = true;
    return new ServletOutputStream() {
      @Override
      public boolean isReady() {
        return true;
      }

      @Override
      public void setWriteListener(WriteListener listener) {}

      // 实际写入ByteArrayOutputStream:
      @Override
      public void write(int b) throws IOException {
        os.write(b);
      }
    };
  }

  // 返回写入的byte[]:
  public byte[] getContent() {
    return os.toByteArray();
  }
}
