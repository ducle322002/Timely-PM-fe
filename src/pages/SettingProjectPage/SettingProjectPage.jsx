import React, { useEffect, useState } from "react";
import { Card, Switch, Button, Modal, Input, Tabs } from "antd";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import toast from "react-hot-toast";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function SettingProjectPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [projectDetail, setProjectDetail] = useState({});

  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      setProjectDetail(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const handleCloseProject = () => {
    setModalOpen(true);
  };

  const confirmCloseProject = async () => {
    try {
      const response = await projectService.closeProject(id);
      console.log(response);
      toast.success(response.message);
      fetchProjectDetail(); // Refresh project details after closing
      setModalOpen(false);
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedProjectName, setUpdatedProjectName] = useState("");

  const handleEditName = () => {
    setIsEditingName(true);
    setUpdatedProjectName(projectDetail.name); // Set the current name as the initial value
  };

  const handleSaveName = async () => {
    const requestData = {
      name: updatedProjectName.trim(),
      status: projectDetail.status,
      image: projectDetail.image,
    };
    if (!updatedProjectName) {
      toast.error("Project name cannot be empty.");
      return;
    }
    try {
      const response = await projectService.updateProject(id, requestData);
      console.log(response);
      toast.success("Project name updated successfully!");
      setIsEditingName(false);
      fetchProjectDetail(); // Refresh project details after updating
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to update project name.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs>
          <Tabs.TabPane
            tab="Project Settings"
            key="1"
            className="p-6 max-w-2xl mx-auto"
          >
            <Card title="Project Settings" className="shadow-md rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">
                  Enable Notifications
                </span>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Project Code</span>
                <Input.Password
                  value={projectDetail.code}
                  readOnly
                  bordered={false}
                  style={{ width: "100px", backgroundColor: "transparent" }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Project Status</span>
                <span
                  className={
                    projectDetail.status ? "text-red-500" : "text-green-500"
                  }
                >
                  {projectDetail.status}
                </span>
              </div>

              <Button
                danger
                className="mt-4 w-full"
                onClick={() => handleCloseProject()}
                disabled={projectDetail.status === "DONE"}
              >
                Close Project
              </Button>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Project Details"
            key="2"
            className="p-6 max-w-2xl mx-auto"
          >
            <Card title="Project Details" className="shadow-md rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Project Name</span>
                <Input
                  value={
                    isEditingName ? updatedProjectName : projectDetail.name
                  }
                  onChange={(e) => setUpdatedProjectName(e.target.value)}
                  readOnly={!isEditingName}
                  bordered={isEditingName}
                  style={{
                    width: "50%",
                    backgroundColor: isEditingName ? "white" : "transparent",
                  }}
                />
              </div>
              <Button
                type={isEditingName ? "primary" : "default"}
                onClick={isEditingName ? handleSaveName : handleEditName}
                className="w-full rounded-lg"
              >
                {isEditingName ? "Save" : "Edit"}
              </Button>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </motion.div>
      <Modal
        title="Confirm Close Project"
        open={modalOpen}
        onOk={confirmCloseProject}
        onCancel={() => setModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to close this project? This action is
          irreversible.
        </p>
      </Modal>
    </>
  );
}
