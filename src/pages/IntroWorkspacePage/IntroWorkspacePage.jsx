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
  Empty,
  Avatar,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  UserAddOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import projectService from "../../services/projectService";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";
import moment from "moment/moment";

const { Title, Text } = Typography;

export default function IntroWorkspacePage() {
  const user = useSelector(selectUser);
  const [isModalCreateProject, setIsModalCreateProject] = useState(false);
  const [isModalJoinProject, setIsModalJoinProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProjectLog, setSelectedProjectLog] = useState({});
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    try {
      const response = await projectService.getProjectsForUser();
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load your projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectLog = async (projectId) => {
    try {
      const response = await projectService.getProjectLog(projectId);
      setSelectedProjectLog((prevLogs) => ({
        ...prevLogs,
        [projectId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching project log:", error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return { bg: "!bg-yellow-100", text: "!text-yellow-600" };
      case "PROCESSING":
        return { bg: "!bg-blue-100", text: "!text-blue-600" };
      case "DONE":
        return { bg: "!bg-green-100", text: "!text-green-600" };
      default:
        return { bg: "!bg-gray-100", text: "!text-gray-600" };
    }
  };

  const items = filteredProjects.map((project) => {
    const statusColors = getStatusColor(project.status);

    return {
      key: project.id,
      label: (
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <Avatar
              shape="square"
              src={project.image}
              size="large"
              alt={project.name}
            />
            <div>
              <div className="font-medium text-lg">{project.name}</div>
              <Text type="secondary" className="text-xs">
                <CalendarOutlined className="mr-1" />
                {moment(project.createdAt).format("MMM DD, YYYY")}
              </Text>
            </div>
          </div>
          <Tag className={`${statusColors.bg} ${statusColors.text} px-3 py-1`}>
            {project.status}
          </Tag>
        </div>
      ),
      children: (
        <div className=" p-4 rounded-xl mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-gray-500" />
              <div>
                <Text type="secondary" className="block text-xs">
                  Project Manager
                </Text>
                <Text strong>{project.profile.fullName}</Text>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() =>
                navigate(
                  `${route.workspace}/${route.project}/${project.id}/${route.summary}`
                )
              }
              className="hover:scale-105 transition-transform"
            >
              Go To Workspace
            </Button>
          </div>
        </div>
      ),
    };
  });

  useEffect(() => {
    fetchProject();
  }, []);

  const handleCreateProject = async (values) => {
    values.status = "PENDING";
    values.image =
      "https://smartpro.vn/images/programes/768x1024/423247project_mobile.jpg";

    try {
      setIsLoadingModalVisible(true);
      setProgress(0);

      const response = await projectService.createProjects(values);

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

      await fetchProject();
      formCreateProject.resetFields();
      setIsModalCreateProject(false);
      toast.success("Project created successfully!");
    } catch (error) {
      setIsLoadingModalVisible(false);
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleJoinProject = async (values) => {
    const params = { code: values.code };

    try {
      const response = await projectService.joinProject(params);
      await fetchProject();
      formJoinProject.resetFields();
      setIsModalJoinProject(false);
      toast.success("Join request sent. Waiting for approval.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join project");
    }
  };

  const handleCollapseChange = (key) => {
    if (key) {
      fetchProjectLog(key);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto">
          {/* Actions Card */}
          <Card
            className="mb-8 border-none rounded-xl shadow-md"
            bodyStyle={{ padding: "24px" }}
          >
            <Title level={3} className="text-center mb-6">
              Workspace Actions
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="cursor-pointer h-full border border-blue-100 hover:border-blue-300 transition-all"
                  onClick={showModalCreateProject}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-blue-50 p-4 rounded-full mb-4">
                      <PlusCircleOutlined className="text-blue-500 text-2xl" />
                    </div>
                    <Title level={4}>Create Workspace</Title>
                    <Text type="secondary">Start a new project workspace</Text>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className="cursor-pointer h-full border border-green-100 hover:border-green-300 transition-all"
                  onClick={() => setIsModalJoinProject(true)}
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-green-50 p-4 rounded-full mb-4">
                      <UserAddOutlined className="text-green-500 text-2xl" />
                    </div>
                    <Title level={4}>Join Workspace</Title>
                    <Text type="secondary">Enter an existing project</Text>
                  </div>
                </Card>
              </motion.div>
            </div>
          </Card>

          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Card
              className="rounded-xl shadow-md border-none"
              title={
                <div className="flex justify-between items-center w-full py-2">
                  <Title level={3} className="mb-0">
                    Your Projects
                  </Title>
                  <Input
                    placeholder="Search projects..."
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                    allowClear
                  />
                </div>
              }
              bodyStyle={{
                padding:
                  isLoading || filteredProjects.length === 0 ? "40px" : "0px",
              }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spin size="large" />
                  <Text className="mt-4 text-gray-500">
                    Loading your projects...
                  </Text>
                </div>
              ) : filteredProjects.length > 0 ? (
                <Collapse
                  accordion
                  items={items}
                  bordered={false}
                  expandIconPosition="end"
                  className="custom-collapse !bg-white"
                  onChange={handleCollapseChange}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    searchTerm ? (
                      <Text>No projects match your search</Text>
                    ) : (
                      <div className="text-center">
                        <Text className="text-lg">No projects found</Text>
                        <div className="mt-2">
                          <Text type="secondary">
                            Create a new workspace or join an existing one
                          </Text>
                        </div>
                      </div>
                    )
                  }
                />
              )}
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Project Modal */}
      <Modal
        visible={isModalCreateProject}
        open={isModalCreateProject}
        onCancel={handleCancelCreateProject}
        title={<Title level={4}>Create New Project</Title>}
        footer={[
          <Button key="back" onClick={handleCancelCreateProject}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formCreateProject.submit()}
          >
            Create Project
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
                message: "Please enter a project name",
              },
            ]}
          >
            <Input
              placeholder="Enter your project name"
              size="large"
              prefix={<FileProtectOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Join Project Modal */}
      <Modal
        open={isModalJoinProject}
        onCancel={() => setIsModalJoinProject(false)}
        title={<Title level={4}>Join Existing Project</Title>}
        footer={[
          <Button key="back" onClick={() => setIsModalJoinProject(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formJoinProject.submit()}
          >
            Join Project
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
                message: "Please enter the project code",
              },
            ]}
          >
            <Input
              placeholder="Enter the project invitation code"
              size="large"
              prefix={<TeamOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Loading Modal */}
      <Modal
        visible={isLoadingModalVisible}
        open={isLoadingModalVisible}
        footer={null}
        closable={false}
        title={null}
        width={400}
      >
        <div className="flex flex-col items-center justify-center py-6">
          <img
            src="https://ideascale.com/wp-content/uploads/2022/03/Task-Management-Advantages-scaled.jpg"
            alt="Creating Project"
            className="w-3/4 mb-6 rounded-lg"
          />
          <Title level={4} className="mb-4">
            Creating Your Project
          </Title>
          <Progress
            percent={progress}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            className="w-full"
          />
          <Text type="secondary" className="mt-4">
            Please wait while we set up your workspace
          </Text>
        </div>
      </Modal>

      <style jsx>{`
        .custom-collapse .ant-collapse-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .custom-collapse .ant-collapse-content-box {
          padding: 0;
        }
      `}</style>
    </div>
  );
}
