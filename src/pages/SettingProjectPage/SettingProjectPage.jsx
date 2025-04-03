import React, { useEffect, useState } from "react";
import { Card, Switch, Button, Modal } from "antd";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import toast from "react-hot-toast";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <Card title="Project Settings" className="shadow-md rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Enable Notifications</span>
          <Switch defaultChecked />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Project Status</span>
          <span
            className={projectDetail.status ? "text-red-500" : "text-green-500"}
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
    </motion.div>
  );
}
