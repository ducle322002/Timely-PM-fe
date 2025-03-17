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
} from "antd";
import toast from "react-hot-toast";
import projectService from "../../services/projectService";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";

export default function IntroWorkspacePage() {
  const user = useSelector(selectUser);

  const [isModalCreateProject, setIsModalCreateProject] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projects, setProjects] = useState([]);
  const [formCreateProject] = Form.useForm();
  const navigate = useNavigate();
  const showModalCreateProject = () => {
    setIsModalCreateProject(true);
  };
  const handleCancelCreateProject = () => {
    setIsModalCreateProject(false);
  };
  const fetchProject = async () => {
    try {
      const response = await projectService.getProjects();
      const filterResponse = response.data.filter(
        (project) => project.profile.id === user.id
      );
      console.log(response.data);
      setProjects(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const items = projects.map((project) => {
    return {
      key: project.id,
      label: project.name,
      children: (
        <div className="flex justify-between items-center">
          <p>{project.name}</p>
          <Button
            className="!bg-[#1968db] !text-white"
            onClick={() =>
              navigate(`${route.workspace}/${route.project}/${project.id}`)
            }
          >
            Go To This Workspace
          </Button>
        </div>
      ),
    };
  });
  console.log(items);
  useEffect(() => {
    fetchProject();
  }, []);

  const handleCreateProject = async (values) => {
    console.log(values);
    values.status = "PENDING";
    values.image =
      "https://smartpro.vn/images/programes/768x1024/423247project_mobile.jpg";
    try {
      setIsModalCreateProject(false);
      setIsLoadingModalVisible(true);
      setProgress(0);

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
      // navigate(`${route.workspace}/${route.project}/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Create project failed");
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
                  <Menu.Item>Join an existing Workspace</Menu.Item>
                </Menu>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-center mt-[5%]">
            <Card
              title={<div className="text-center">Your Workspace</div>}
              className="w-[55%] mt-[5%]"
              style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
            >
              {items.length > 0 && projects ? (
                <Collapse
                  accordion
                  items={items}
                  bordered={false}
                  ghost={true}
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
