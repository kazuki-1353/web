import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(urlPatterns = "/")
public class ServletIndex extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws ServletException, IOException {
    res.setContentType("text/html");
    String name = req.getParameter("name");
    if (name == null) {
      name = "world";
    }
    PrintWriter pw = res.getWriter();
    pw.write("<h1>Hello, " + name + "!</h1>");
    pw.flush();
  }
}
