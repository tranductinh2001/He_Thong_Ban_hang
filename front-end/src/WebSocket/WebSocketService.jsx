import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { BehaviorSubject } from "rxjs";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.stompClient = null;
    this.topicSubjects = {}; // Lưu các BehaviorSubject cho từng topic
    this.isConnected = false;
  }

  connect() {
    if (!this.isConnected) {
      console.log("Connecting to WebSocket...");
      this.socket = new SockJS("http://localhost:8080/ws");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        () => {
          console.log("WebSocket connected!");
          this.isConnected = true;
        },
        (error) => {
          console.error("WebSocket connection failed:", error);
          this.isConnected = false;
          setTimeout(() => this.connect(), 5000); // Tự động thử kết nối lại sau 5 giây
        }
      );
    }
  }

  subscribeToTopic(topic) {
    if (!this.topicSubjects[topic]) {
      this.topicSubjects[topic] = new BehaviorSubject(null);
    }

    if (this.stompClient && this.isConnected) {
      console.log(`Subscribing to topic: ${topic}`);
      this.stompClient.subscribe(topic, (message) => {
        const data = message.body; // Chuyển đổi dữ liệu nếu cần
        console.log(`Received message from ${topic}:`, data);
        this.topicSubjects[topic].next(data); // Cập nhật dữ liệu vào BehaviorSubject
      });
    } else {
      console.warn("WebSocket is not connected. Retrying subscription...");
      setTimeout(() => this.subscribeToTopic(topic), 1000); // Thử lại sau 1 giây
    }
  }

  getTopicObservable(topic) {
    if (!this.topicSubjects[topic]) {
      this.topicSubjects[topic] = new BehaviorSubject(null);
    }
    return this.topicSubjects[topic].asObservable();
  }
}

const webSocketService = new WebSocketService();
webSocketService.connect(); // Kết nối WebSocket khi service được khởi tạo
export default webSocketService;
