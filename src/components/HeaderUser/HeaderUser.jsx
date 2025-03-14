import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { route } from "../../routes"; // Assuming your routes file is set up similarly

const { Header } = Layout;

export default function HeaderUser() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const location = useLocation();

  // Use full pathname without splitting
  const currentURI = location.pathname;

  useEffect(() => {
    setItems([
      getItem("Dashboard", route.manage, <HomeOutlined />),
      getItem("Profile", route.profile, <UserOutlined />),
      getItem("Settings", route.settings, <HomeOutlined />),
    ]);
  }, []);

  useEffect(() => {
    setSelectedKey(currentURI);
  }, [currentURI]);

  return (
    <header className="border !border-[#cccccc] !border-r-0 !bg-[#ffffff] flex justify-between items-center !px-[5%] ">
      <h1 className="text-xl font-bold">Timely Project Management</h1>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        className=" flex items-center justify-start"
      >
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} className="!py-[5%]">
            <Link to={`${item.key}`}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </header>
  );
}
