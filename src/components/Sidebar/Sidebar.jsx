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
  const [selectedKey, setSelectedKey] = useState("");
  const location = useLocation();

  // Use full pathname without splitting
  const currentURI = location.pathname;

  const dataOpen = JSON.parse(localStorage.getItem("keys")) ?? [];
  const [openKeys, setOpenKeys] = useState(dataOpen);
  const user = useSelector(selectUser);

  useEffect(() => {
    setItems([
      getItem("User", route.home, <DropboxOutlined />, [
        getItem("User Profile", route.manage, <DropboxOutlined />),
        getItem("User Setting", route.manage, <BarChartOutlined />),
        getItem("User Role", route.home, <BarChartOutlined />),
      ]),
      getItem("Manage Project", route.manage, <BarChartOutlined />),
      getItem("Back to Home", route.home, <HomeOutlined />),
    ]);
  }, []);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };

  const handleSelectKey = (key) => {
    setSelectedKey(key);
  };

  useEffect(() => {
    localStorage.setItem("keys", JSON.stringify(openKeys));
  }, [openKeys]);

  useEffect(() => {
    setSelectedKey(currentURI);
  }, [currentURI]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
      className="!bg-[#ffffff] !border !border-[#cccccc] !border-t-0 sidebar"
    >
      <Menu
        theme="light"
        mode="inline"
        className="h-full !bg-[#ffffff]  "
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleSubMenuOpen}
      >
        {items.map((item) =>
          item.children ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((subItem) => (
                <Menu.Item
                  key={subItem.key}
                  onClick={() => handleSelectKey(subItem.key)}
                  icon={subItem.icon}
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
