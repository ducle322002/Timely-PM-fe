import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
import { HomeOutlined, ProjectOutlined } from "@ant-design/icons";
import { Link, useLocation, useParams } from "react-router-dom";
import "./SidebarProject.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { route } from "../../routes";
import { CiViewBoard } from "react-icons/ci";
import { IoRocketOutline } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { MdSummarize } from "react-icons/md";

export default function SidebarProject() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const [items, setItems] = useState([]);
  const [key, setKey] = useState();
  const location = useLocation();
  const currentURI = location.pathname; // Use the full pathname
  const dataOpen = JSON.parse(localStorage.getItem("keys")) ?? [];

  const [openKeys, setOpenKeys] = useState(dataOpen);
  const { id } = useParams();
  const user = useSelector(selectUser);

  useEffect(() => {
    setItems([
      getItem(
        "Summary",
        `${route.workspace}/${route.project}/${id}/summary`,
        <MdSummarize />
      ),
      getItem(
        "Overview",
        `${route.workspace}/${route.project}/${id}/${route.projectIssue}`,
        <ProjectOutlined />
      ),
      getItem(
        "Go to Project",
        `${route.workspace}/${route.project}/${id}`,
        <IoRocketOutline />
      ),
      getItem(
        "Board",
        `${route.workspace}/${route.project}/${id}/${route.board}`,
        <CiViewBoard />
      ),
      getItem(
        "Project Setting",
        `${route.workspace}/${route.project}/${id}/${route.projectSetting}`,
        <ProjectOutlined />
      ),
      getItem(
        "Project History",
        `${route.workspace}/${route.project}/${id}/${route.projectHistory}`,
        <FaHistory />
      ),

      getItem(
        "Back to Workspace",
        `${route.home}/${route.introWorkspace}`,
        <HomeOutlined />
      ),
    ]);
  }, [id]);

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
        className="!bg-[#ffffff] !border !border-[#cccccc] !border-t-0 sidebar"
      >
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="h-full !bg-[#ffffff]"
          selectedKeys={[currentURI]} // Ensure this is set correctly for selection
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={
                  <div className="flex justify-between items-center">
                    {item.label}
                  </div>
                }
              >
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
