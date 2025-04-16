import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
import {
  BarChartOutlined,
  DropboxOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

import { route } from "../../routes";
import logoNoBG from "../../assets/logoNoBG.png";
import "./SidebarAdmin.scss";
export default function SidebarAdmin() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const [items, setItems] = useState([]);
  const [key, setKey] = useState();
  const location = useLocation();
  const currentURI =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const dataOpen = JSON.parse(localStorage.getItem("keys")) ?? [];

  const [openKeys, setOpenKeys] = useState(dataOpen);

  useEffect(() => {
    setItems([
      getItem("Dashboard", route.dashboard, <BarChartOutlined />),
      getItem("Project Statistic", route.projectStatistic, <DropboxOutlined />),
      getItem("Manage User", route.adminUser, <UserOutlined />),
      getItem("Manage Feedback", route.feedbackManage, <UserOutlined />),
      getItem("News Management", route.newsManagement, <DropboxOutlined />),
      getItem("Back to Home", route.welcome, <HomeOutlined />),
    ]);
  }, []);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };
  const handleSelectKey = (keyPath) => {
    setKey(keyPath);
  };
  useEffect(() => {
    localStorage.setItem("keys", JSON.stringify(openKeys));
  }, [openKeys]);

  useEffect(() => {
    handleSubMenuOpen([...openKeys, key]);
  }, [currentURI]);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={270}
        className="!bg-[#001529] shadow-lg transition-all duration-300 !fixed !top-0 !left-0 !h-screen !z-1000"
      >
        <div className="py-4 px-6 border-b border-gray-700">
          <img src={logoNoBG} alt="Logo" className="w-30 h-30 mx-auto" />
        </div>
        <div className="text-white text-center font-semibold text-lg py-4 px-6 border-b border-gray-700">
          {collapsed ? "🌐" : "Admin Panel"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentURI]}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
          className="h-full"
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={
                  <span className="text-sm font-medium">{item.label}</span>
                }
              >
                {item.children.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    icon={subItem.icon}
                    onClick={(e) => handleSelectKey(e.keyPath[1])}
                    className="!text-white hover:!bg-blue-500/20 transition-all"
                  >
                    <Link to={subItem.key} className="pl-2 block">
                      {subItem.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                className="!text-white hover:!bg-blue-500/20 transition-all"
              >
                <Link to={item.key} className="pl-2 block text-sm font-medium">
                  {item.label}
                </Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
    </>
  );
}
