import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Menu,
  Modal,
  Progress,
  Steps,
} from "antd";
import toast from "react-hot-toast";
import projectService from "../../services/projectService";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";
import moment from "moment/moment";
import { SearchOutlined } from "@ant-design/icons";

export default function IntroWorkspacePage() {
  const user = useSelector(selectUser);

  const [isModalCreateProject, setIsModalCreateProject] = useState(false);
  const [isModalJoinProject, setIsModalJoinProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProjectLog, setSelectedProjectLog] = useState({});

  const [projects, setProjects] = useState([]);
  const [formCreateProject] = Form.useForm();
  const [formJoinProject] = Form.useForm();

  const navigate = useNavigate();
  const showModalCreateProject = () => {
    setIsModalCreateProject(true);
  };
  const handleCancelCreateProject = () => {
    setIsModalCreateProject(false);
  };

  const fetchProject = async () => {
    try {
      const response = await projectService.getProjectsForUser();

      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjectLog = async (projectId) => {
    try {
      const response = await projectService.getProjectLog(projectId);
      console.log(response.data);
      setSelectedProjectLog((prevLogs) => ({
        ...prevLogs,
        [projectId]: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const items = filteredProjects.map((project) => ({
    key: project.id,
    label: (
      <div className="flex justify-between items-center">
        <span className="font-medium">{project.name}</span>
        <span
          className={`ml-2 px-2 py-1 text-xs rounded-full ${
            project.status === "PENDING"
              ? "bg-yellow-100 text-yellow-600"
              : project.status === "PROCESSING"
              ? "bg-blue-100 text-blue-600"
              : project.status === "DONE"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {project.status}
        </span>
      </div>
    ),
    children: (
      <div className="rounded-xl">
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-4">
            <h3 className="text-gray-800 font-semibold">Project Manager:</h3>
            <p className="text-gray-600 font-medium">
              {project.profile.fullName}
            </p>
          </div>
          <Button
            className="!bg-[#1968db] !text-white"
            onClick={() =>
              navigate(`${route.workspace}/${route.project}/${project.id}`)
            }
          >
            Go To This Workspace
          </Button>
        </div>
      </div>
    ),
  }));

  useEffect(() => {
    fetchProject();
    console.log("fetching");
  }, []);

  const handleCreateProject = async (values) => {
    values.status = "PENDING";
    values.image =
      "https://smartpro.vn/images/programes/768x1024/423247project_mobile.jpg";
    console.log(values);
    console.log(values.name);
    try {
      const response = await projectService.createProjects(values);
      console.log(response);

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

      fetchProject();
      formCreateProject.resetFields();
      setIsModalCreateProject(false);
      setIsLoadingModalVisible(true);
      setProgress(0);
      // navigate(`${route.workspace}/${route.project}/${response.data.id}`);
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  const handleJoinProject = async (values) => {
    const params = {
      code: values.code,
    };
    try {
      const response = await projectService.joinProject(params);
      console.log(response);
      fetchProject();
      formJoinProject.resetFields();
      setIsModalJoinProject(false);
      toast.success("Joining Project Request Sent, Please Wait For Approval");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCollapseChange = (key) => {
    if (key) {
      fetchProjectLog(key); // key is the project ID
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <Card
              title={<div className="text-center">Workspace</div>}
              className="w-[55%] mt-[5%]"
              style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
            >
              <div className="flex flex-col items-start justify-center gap-[5%]">
                <Menu theme="light" mode="vertical" className="w-full">
                  <Menu.Item onClick={() => showModalCreateProject()}>
                    Create new Workspace
                  </Menu.Item>
                  <Menu.Item onClick={() => setIsModalJoinProject(true)}>
                    Join an existing Workspace
                  </Menu.Item>
                </Menu>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-center mt-[5%]">
            <Card
              title={
                <>
                  <div className="flex justify-between items-center w-full">
                    <div className="!w-[250px]"></div>
                    <div className="text-center">Your Project</div>
                    <Input
                      placeholder="Search workspace..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="!w-[250px]"
                    />
                  </div>
                </>
              }
              className="w-[55%] mt-[5%]"
              style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
            >
              {items.length > 0 && projects ? (
                <Collapse
                  accordion
                  items={items}
                  bordered={false}
                  ghost={true}
                  onChange={handleCollapseChange}
                />
              ) : (
                <div className="text-center text-2xl">
                  You haven't created or joined any workspace yet
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>

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
        </Form>
      </Modal>

      <Modal
        open={isModalJoinProject}
        onCancel={handleCancelCreateProject}
        title="Join Project"
        footer={[
          <Button key="back" onClick={() => setIsModalJoinProject(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formJoinProject.submit()}
          >
            Join
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formJoinProject}
          onFinish={handleJoinProject}
          requiredMark={false}
        >
          <Form.Item
            label="Project Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please Enter Project Code",
              },
            ]}
          >
            <Input type="text" />
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
    </div>
  );
}
