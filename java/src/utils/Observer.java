import java.util.ArrayList;
import java.util.List;

/** 观察者模式（Observer）又称发布-订阅模式（Publish-Subscribe：Pub/Sub）
 *
 *
 */
public class Observer implements Publisher {

  private List<Subscriber> subscribers = new ArrayList<>();

  // 注册观察者:
  public void addObserver(Subscriber observer) {
    this.subscribers.add(observer);
  }

  // 取消注册:
  public void removeObserver(Subscriber observer) {
    this.subscribers.remove(observer);
  }

  public void publish() {
    // 通知观察者:
    subscribers.forEach(i -> i.onSubscribe());
  }
}

/** 发布者 */
interface Publisher {
  public void publish();
}

/** 订阅者 */
interface Subscriber {
  public void onSubscribe();
}
