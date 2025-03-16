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
import "./Sidebar.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { route } from "../../routes";
import { IoRocket, IoRocketOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

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
  const current = "in Workspace";
  // const current = "out Workspace";

  const project = [
    {
      id: "1",
      label: "Project 1",
    },
    {
      id: "2",
      label: "Project 23423",
    },
  ];

  useEffect(() => {
    if (current === "out Workspace") {
      setItems([
        getItem("User", "", <DropboxOutlined />, [
          getItem("User Profile", "", <DropboxOutlined />),
          getItem("User Setting", "", <BarChartOutlined />),
          getItem("User Role", "", <BarChartOutlined />),
        ]),
        getItem("Workspace", route.introWorkspace, <BarChartOutlined />),
        getItem("Back to Home", route.home, <HomeOutlined />),
      ]);
    }
    if (current === "in Workspace") {
      setItems([
        project.length > 0
          ? getItem(
              "Project",
              "",
              <IoRocket />,
              project.map((item) =>
                getItem(
                  item.label,
                  `${route.workspace}/${route.project}/${item.id}`,
                  ""
                )
              )
            )
          : getItem("Project", "", <IoRocketOutline />),
        getItem("Back to Home", route.home, <HomeOutlined />),
      ]);
    }
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

  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const [isModalCreateProject, setIsModalCreateProject] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formCreateProject] = Form.useForm();
  const showModalCreateProject = () => {
    setIsModalCreateProject(true);
  };
  const handleCancelCreateProject = () => {
    setIsModalCreateProject(false);
  };

  const handleCreateProject = async (values) => {
    console.log(values);
    try {
      setIsModalCreateProject(false);
      setIsLoadingModalVisible(true);
      setProgress(0);

      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setIsLoadingModalVisible(false);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error("Create project failed");
    }
  };

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
                  <div className="flex justify-between items-center">
                    {item.label}

                    {item.label === "Project" && (
                      <>
                        <Tooltip
                          placement="topLeft"
                          title={"Create Project"}
                          arrow={mergedArrow}
                        >
                          <Button
                            color="default"
                            variant="filled"
                            className="button-selected !font-bold "
                            toolt
                            onClick={() => showModalCreateProject()}
                          >
                            <FaPlus />
                          </Button>
                        </Tooltip>
                      </>
                    )}
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
                  {item.label === "Project" && (
                    <>
                      <Tooltip
                        placement="topLeft"
                        title={"Create Project"}
                        arrow={mergedArrow}
                      >
                        <Button
                          color="default"
                          variant="filled"
                          className="button-selected !font-bold "
                          toolt
                          onClick={() => showModalCreateProject()}
                        >
                          <FaPlus />
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>

      <Modal
        visible={isModalCreateProject}
        open={isModalCreateProject}
        onCancel={handleCancelCreateProject}
        title="Create Project"
        footer={[
          <Button key="back" onClick={handleCancelCreateProject}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formCreateProject.submit()}
          >
            Create
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formCreateProject}
          onFinish={handleCreateProject}
          requiredMark={false}
        >
          <Form.Item
            label="Project Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please Enter Project Name",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Due Date">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isLoadingModalVisible}
        footer={null}
        closable={false}
        title={
          <>
            <h4 className="font-bold text-xl text-center">Creating Project</h4>
          </>
        }
      >
        <div className="flex flex-col items-center justify-center gap-[5%]">
          <img
            src="https://ideascale.com/wp-content/uploads/2022/03/Task-Management-Advantages-scaled.jpg"
            alt=""
          />
          <Progress percent={progress} />
        </div>
      </Modal>
    </>
  );
}
