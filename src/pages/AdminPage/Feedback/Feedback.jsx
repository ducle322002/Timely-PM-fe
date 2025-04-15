import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import adminService from "./../../../services/adminService";
import { Button, Modal, Table } from "antd";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const fetchFeedback = async () => {
    try {
      const response = await adminService.getAllFeedback();
      setFeedback(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  const handleDeleteFeedback = async (record) => {
    Modal.confirm({
      title: `Are you sure you want to delete this feedback of user ${record.user.username}?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await adminService.deleteFeedback(record.id);
          console.log(response.data);
          toast.success("Feedback deleted successfully!");
          fetchFeedback();
        } catch (error) {
          toast.error(error.response.data.message);
          console.error(error.response.data.message);
        }
      },
    });
  };
  const columns = [
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      render: (text) => {
        return <p>{text || "None"}</p>;
      },
    },

    {
      title: "Actions",

      render: (index, record) => {
        return (
          <div>
            <Button
              variant="solid"
              color="danger"
              onClick={() => handleDeleteFeedback(record)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    fetchFeedback();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={feedback} rowKey="id" bordered />
    </div>
  );
}
