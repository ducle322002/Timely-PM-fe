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
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./SidebarProject.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { route } from "../../routes";
import { IoRocket, IoRocketOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import projectService from "../../services/projectService";

export default function SidebarProject() {
  function getItem(label, key, icon, children) {
    return { key, label, icon, children };
  }

  const [items, setItems] = useState([]);
  const [key, setKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const currentURI = location.pathname;

  const user = useSelector(selectUser);

  const [projects, setProjects] = useState([]);
  const fetchProject = async () => {
    try {
      const response = await projectService.getProjects();
      const filteredResponse = response.data.filter(
        (project) => project.userId === user.id
      );
      console.log(filteredResponse);
      console.log(response.data);
      setProjects(filteredResponse);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchProject();
    console.log(projects);
  }, []);

  useEffect(() => {
    setItems([
      projects && projects.length > 0
        ? getItem(
            "Project",
            "",
            <IoRocket />,
            projects.map((item) =>
              getItem(
                item.name,
                `${route.workspace}/${route.project}/${item.id}`,
                ""
              )
            )
          )
        : getItem("Project", "", <IoRocketOutline />),
      getItem("Back to Home", route.home, <HomeOutlined />),
    ]);
  }, [projects]);

  const handleSubMenuOpen = (openKeys) => {
    setOpenKeys(openKeys);
    localStorage.setItem("keys", JSON.stringify(openKeys));
  };
  const handleSelectKey = (key) => {
    setKey(key);
  };

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
          selectedKeys={[currentURI]}
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
