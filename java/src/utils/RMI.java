import java.io.*;
import java.rmi.*;
import java.rmi.registry.*;
import java.rmi.server.*;
import java.time.*;

// public class Main {

//   public static void main(String[] args)
//     throws RemoteException, NotBoundException {
//     new Server("WorldClock", 1099);
//     new Client("WorldClock", 1099);
//   }
// }

interface WorldClock extends Remote {
  LocalDateTime getLocalDateTime(String zoneId) throws RemoteException;
}

class WorldClockService implements WorldClock {

  @Override
  public LocalDateTime getLocalDateTime(String zoneId) throws RemoteException {
    return LocalDateTime.now(ZoneId.of(zoneId)).withNano(0);
  }
}

class Server {

  public Server(String name, int port) throws RemoteException {
    // 实例化一个WorldClock
    WorldClock worldClock = new WorldClockService();

    // 将此服务转换为远程服务接口
    WorldClock skeleton = (WorldClock) UnicastRemoteObject.exportObject(
      worldClock,
      0
    );

    // 将RMI服务注册到指定端口
    Registry registry = LocateRegistry.createRegistry(port);

    // 注册服务并指定服务名称
    registry.rebind(name, skeleton);
  }
}

class Client {

  public Client(String name, int port)
    throws RemoteException, NotBoundException {
    // 连接到服务器localhost
    Registry registry = LocateRegistry.getRegistry("localhost", port);

    // 查找指定名称的服务并强制转型为WorldClock接口
    WorldClock worldClock = (WorldClock) registry.lookup(name);

    // 正常调用接口方法
    LocalDateTime now = worldClock.getLocalDateTime("Asia/Shanghai");

    System.out.println(now);
  }
}
