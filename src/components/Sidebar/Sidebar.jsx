import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
import {
  BarChartOutlined,
  DropboxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { route } from "../../routes";

export default function Sidebar() {
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
      getItem("User", route.home, <DropboxOutlined />, [
        getItem("User Profile", route.introWorkspace, <DropboxOutlined />),
        getItem("User Setting", route.introWorkspace, <BarChartOutlined />),
        getItem("User Role", route.home, <BarChartOutlined />),
      ]),
      getItem("Workspace", route.introWorkspace, <BarChartOutlined />),
      getItem("Back to Home", route.home, <HomeOutlined />),
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
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={270}
      className="!bg-[#ffffff] !border !border-[#cccccc] !border-t-0 sidebar"
    >
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="h-full !bg-[#ffffff]"
        selectedKeys={currentURI}
        openKeys={openKeys}
        onOpenChange={handleSubMenuOpen}
      >
        {items.map((item) =>
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((subItem) => (
                <Menu.Item
                  key={subItem.key}
                  icon={subItem.icon}
                  onClick={(e) => handleSelectKey(e.keyPath[1])}
                >
                  <Link to={subItem.key}>{subItem.label}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
  );
}
