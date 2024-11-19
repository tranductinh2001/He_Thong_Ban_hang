import React, { createContext, useContext, useEffect, useState } from "react";
import webSocketService from "./WebSocketService";

// Tạo Context
const WebSocketContext = createContext(null);

// Provider để quản lý WebSocket
export const WebSocketProvider = ({ topics, children }) => {
  const [receivedData, setReceivedData] = useState({});

  useEffect(() => {
    const subscriptions = {};

    // Kết nối WebSocket và subscribe tới các topic
    topics.forEach((topic) => {
      webSocketService.subscribeToTopic(topic);

      // Lắng nghe dữ liệu từ BehaviorSubject
      const subscription = webSocketService
        .getTopicObservable(topic)
        .subscribe((data) => {
          if (!data || Object.keys(data).length === 0) {
            console.warn(`Received empty or invalid data for topic: ${topic}`);
            return; // Bỏ qua nếu data rỗng hoặc không hợp lệ
          }

          setReceivedData((prevData) => ({
            ...prevData,
            [topic]: data, // Cập nhật dữ liệu cho topic cụ thể
          }));
        });

      subscriptions[topic] = subscription;
    });

    // Cleanup các subscription khi component unmount
    return () => {
      Object.values(subscriptions).forEach((subscription) =>
        subscription.unsubscribe()
      );
    };
  }, [topics]);

  return (
    <WebSocketContext.Provider value={{ receivedData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom Hook để sử dụng dữ liệu WebSocket
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
