import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Dropdown, Empty, Layout, Menu, Typography } from "antd";
import {
  HomeOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { route } from "../../routes"; // Assuming your routes file is set up similarly
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import logoNoBg from "../../assets/logoNoBG.png";
import toast from "react-hot-toast";
import userService from "../../services/userService";
import Cookies from "js-cookie";
import moment from "moment";

const { Header } = Layout;
const { Text } = Typography;

export default function HeaderProject() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const user = useSelector(selectUser);
  const ws = useRef(null);

  // Use full pathname without splitting
  const currentURI = location.pathname;

  useEffect(() => {
    setItems([
      user
        ? getItem(
            `Welcome ${user?.username}`,
            route.userProfile,
            <UserOutlined />
          )
        : getItem(`Sign In`, route.login, <UserOutlined />),
    ]);
  }, [user]);

  useEffect(() => {
    setSelectedKey(currentURI);
  }, [currentURI]);

  const fetchNotification = async () => {
    try {
      const response = await userService.getNotification();
      setNotification(
        response.data.sort(
          (a, b) => new Date(b?.createAt) - new Date(a?.createAt)
        )
      );
      console.log("Fetched notifications:", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotification();
    }
  }, [user]);

  const connectWebSocket = () => {
    const wsUrl = `ws://14.225.220.28:8080/notification`;

    // Create new WebSocket connection
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected successfully");
      setIsConnected(true);

      // Send authentication token if available
      const token = Cookies.get("token")?.replaceAll('"', "");
      if (token) {
        ws.current.send(JSON.stringify({ type: "auth", token: token }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        console.log("Received WebSocket message:", event.data);
        const data = JSON.parse(event.data);

        // Ensure data has the expected format and properties
        if (data && data.message) {
          setNotification((prev) => {
            const newNotifications = [data, ...prev].sort(
              (a, b) => new Date(b.createAt) - new Date(a.createAt)
            );

            return newNotifications;
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      toast.error("Connection error occurred");
    };

    ws.current.onclose = (event) => {
      console.log(
        `WebSocket disconnected: code ${event.code}, reason: ${event.reason}`
      );
      setIsConnected(false);
    };
  };

  // Initialize WebSocket connection
  useEffect(() => {
    if (user) {
      connectWebSocket();
    }

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user]);

  // Handle connection status changes
  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connection established");
    } else {
      console.log("WebSocket disconnected or not connected");
    }
  }, [isConnected]);

  const getMenu = () => {
    return (
      <Menu className="!w-100 !max-h-[40vh] !p-2 !shadow-lg !rounded-md !border !border-gray-200">
        {!isConnected && (
          <Menu.Item className="!p-3 !mb-1 !rounded-sm !bg-yellow-50">
            <Text className="text-sm text-yellow-600">
              Notification service is currently offline. Reconnecting...
            </Text>
          </Menu.Item>
        )}
        {notification.length === 0 ? (
          <Empty description="No notifications" className="py-4" />
        ) : (
          notification.map((noti, index) => (
            <Menu.Item
              key={index}
              className="!p-3 !mb-1 !rounded-sm hover:!bg-gray-100"
            >
              <div className="flex flex-col">
                <Text className="text-sm text-gray-800">{noti?.message}</Text>
                <Text className="text-xs text-gray-500">
                  {moment(noti.createAt).fromNow()}
                </Text>
              </div>
            </Menu.Item>
          ))
        )}
      </Menu>
    );
  };

  return (
    <header className="border !border-[#cccccc] !border-r-0 !bg-[#ffffff] flex justify-between items-center px-[3%]">
      <h1 className="text-xl font-bold flex items-center justify-between gap-[5%] text-nowrap">
        <img src={logoNoBg} alt="" className="h-[50px]" />
        Timely PM
      </h1>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        className="w-[350px] flex justify-center items-center"
      >
        <Dropdown overlay={getMenu()} trigger={["click"]}>
          <Menu.Item key={99} className="!py-[5%]">
            <Badge
              count={notification.length}
              size="small"
              offset={[0, 0]}
              style={{ backgroundColor: isConnected ? undefined : "#faad14" }}
            >
              <Button
                icon={<NotificationOutlined />}
                color="default"
                variant="text"
              />
            </Badge>
          </Menu.Item>
        </Dropdown>
        {items.map((item, index) => (
          <Menu.Item key={index} icon={item.icon} className="!py-[5%]">
            <Link to={`${item.key}`}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </header>
  );
}
