import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;

@WebFilter("/upload/*")
public class FilterValidateUpload implements Filter {

  @Override
  public void doFilter(
    ServletRequest request,
    ServletResponse response,
    FilterChain chain
  ) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse res = (HttpServletResponse) response;

    // 获取客户端传入的签名方法和签名:
    String digest = req.getHeader("Signature-Method");
    String signature = req.getHeader("Signature");

    if (
      digest == null ||
      digest.isEmpty() ||
      signature == null ||
      signature.isEmpty()
    ) {
      sendErrorPage(res, "Missing signature.");
      return;
    }

    // 读取Request的Body并验证签名:
    MessageDigest md = getMessageDigest(digest);
    InputStream input = new DigestInputStream(request.getInputStream(), md);

    @SuppressWarnings("resource")
    ByteArrayOutputStream os = new ByteArrayOutputStream();

    byte[] buffer = new byte[1024];
    for (;;) {
      int len = input.read(buffer);
      if (len == -1) {
        break;
      }
      os.write(buffer, 0, len);
    }

    String actual = toHexString(md.digest());
    if (!signature.equals(actual)) {
      sendErrorPage(res, "Invalid signature.");
      return;
    }

    // 验证成功后, 把传给下一个处理者的HttpServletRequest替换为我们自己“伪造”的ReReadableHttpServletRequest:
    chain.doFilter(
      new ReReadableHttpServletRequest(req, os.toByteArray()),
      response
    );
  }

  // 将byte[]转换为hex string:
  private String toHexString(byte[] digest) {
    StringBuilder sb = new StringBuilder();
    for (byte b : digest) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  }

  // 根据名称创建MessageDigest:
  private MessageDigest getMessageDigest(String name) throws ServletException {
    try {
      return MessageDigest.getInstance(name);
    } catch (NoSuchAlgorithmException e) {
      throw new ServletException(e);
    }
  }

  // 发送一个错误响应:
  private void sendErrorPage(HttpServletResponse res, String errorMessage)
    throws IOException {
    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    PrintWriter pw = res.getWriter();
    pw.write("<html><body><h1>");
    pw.write(errorMessage);
    pw.write("</h1></body></html>");
    pw.flush();
  }
}

/** 伪造一个HttpServletRequest */
class ReReadableHttpServletRequest extends HttpServletRequestWrapper {

  private byte[] body;
  private boolean open = false;

  public ReReadableHttpServletRequest(HttpServletRequest request, byte[] body) {
    super(request);
    this.body = body;
  }

  // 返回InputStream:
  @Override
  public ServletInputStream getInputStream() throws IOException {
    if (open) {
      throw new IllegalStateException("Cannot re-open input stream!");
    }
    open = true;
    return new ServletInputStream() {
      private int offset = 0;

      @Override
      public boolean isFinished() {
        return offset >= body.length;
      }

      @Override
      public boolean isReady() {
        return true;
      }

      @Override
      public void setReadListener(ReadListener listener) {}

      @Override
      public int read() throws IOException {
        if (offset >= body.length) {
          return -1;
        }
        int n = body[offset] & 0xff;
        offset++;
        return n;
      }
    };
  }

  // 返回Reader:
  @Override
  public BufferedReader getReader() throws IOException {
    if (open) {
      throw new IllegalStateException("Cannot re-open reader!");
    }
    open = true;
    return new BufferedReader(new InputStreamReader(getInputStream(), "UTF-8"));
  }
}
