import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

@WebServlet(urlPatterns = "/upload/file")
public class ServletUpload extends HttpServlet {

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
    throws ServletException, IOException {
    InputStream input = req.getInputStream();
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    for (;;) {
      int len = input.read(buffer);
      if (len == -1) {
        break;
      }
      output.write(buffer, 0, len);
    }
    String uploadedText = output.toString(StandardCharsets.UTF_8);
    System.out.println("uploaded: " + uploadedText);
    PrintWriter pw = resp.getWriter();
    pw.write("<h1>Uploaded:</h1>");
    pw.write("<pre><code>");
    pw.write(uploadedText);
    pw.write("</code></pre>");
    pw.flush();
  }
}
