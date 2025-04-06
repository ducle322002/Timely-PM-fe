import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Tooltip,
  Progress,
} from "antd";
const { Sider } = Layout;
import {
  BarChartOutlined,
  DropboxOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { route } from "../../routes";

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
  const user = useSelector(selectUser);

  useEffect(() => {
    setItems([
      // getItem("User", "", <DropboxOutlined />, [
      //   getItem("User Profile", "", <DropboxOutlined />),
      //   getItem("User Setting", "", <BarChartOutlined />),
      //   getItem("User Role", "", <BarChartOutlined />),
      // ]),
      getItem("Dashboard", route.dashboard, <BarChartOutlined />),
      getItem("Project Statistic", route.projectStatistic, <DropboxOutlined />),
      getItem("Manage User", route.adminUser, <UserOutlined />),
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
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="h-full"
          selectedKeys={currentURI}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={
                  <div className="flex justify-between items-center ">
                    {item.label}
                  </div>
                }
              >
                {item.children.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    icon={subItem.icon}
                    onClick={(e) => handleSelectKey(e.keyPath[1])}
                    className="dark:!text-[#ffffff]"
                  >
                    <Link to={subItem.key}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <div className="flex justify-between items-center">
                  <Link to={item.key}>{item.label}</Link>
                </div>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
    </>
  );
}
