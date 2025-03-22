import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { route } from "../../routes"; // Assuming your routes file is set up similarly
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import logoNoBg from "../../assets/logoNoBG.png";
const { Header } = Layout;

export default function HeaderUser() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const user = useSelector(selectUser);

  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const location = useLocation();

  // Use full pathname without splitting
  const currentURI = location.pathname;

  useEffect(() => {
    setItems([
      getItem("Dashboard", route.manage, <HomeOutlined />),
      user
        ? getItem(
            `Welcome ${user.username}`,
            route.userProfile,
            <UserOutlined />
          )
        : getItem(`Sign In`, route.login, <UserOutlined />),
      // getItem("Settings", route.settings, <HomeOutlined />),
    ]);
  }, [user]);

  useEffect(() => {
    setSelectedKey(currentURI);
  }, [currentURI]);

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
        {items.map((item, index) => (
          <Menu.Item key={index} icon={item.icon} className="!py-[5%]">
            <Link to={`${item.key}`}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </header>
  );
}
