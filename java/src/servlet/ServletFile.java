import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@WebServlet(urlPatterns = "/static/*")
public class ServletFile extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
    ServletContext ctx = req.getServletContext();

    // RequestURI包含ContextPath,需要去掉:
    String uri = req.getRequestURI();
    String contextPath = ctx.getContextPath();
    String urlPath = uri.substring(contextPath.length());

    // 获取真实文件路径:
    String filePath = ctx.getRealPath(urlPath);

    // 无法获取到路径:
    if (filePath == null) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    Path path = Paths.get(filePath);

    // 文件不存在:
    if (!path.toFile().isFile()) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    // 根据文件名猜测Content-Type:
    String mime = Files.probeContentType(path);
    if (mime == null) mime = "application/octet-stream";

    resp.setContentType(mime);

    InputStream is = new BufferedInputStream(new FileInputStream(filePath));
    OutputStream os = resp.getOutputStream();

    // 读取文件并写入Response:
    try (is) {
      is.transferTo(os);
    }

    os.flush();
  }
}
