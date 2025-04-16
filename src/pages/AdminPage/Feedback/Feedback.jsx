import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import adminService from "./../../../services/adminService";
import { Button, Modal, Table, Card, Typography, Space, Spin } from "antd";

const { Title, Text } = Typography;

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllFeedback();
      setFeedback(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch feedback");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (record) => {
    Modal.confirm({
      title: `Delete feedback from ${record.user.username}?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await adminService.deleteFeedback(record.id);
          toast.success("Feedback deleted successfully!");
          fetchFeedback();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete");
          console.error(error);
        }
      },
    });
  };

  const emailFilters = [
    ...Array.from(new Set(feedback.map((item) => item.user.email))).map(
      (email) => ({ text: email, value: email })
    ),
  ];

  const usernameFilters = [
    ...Array.from(new Set(feedback.map((item) => item.user.username))).map(
      (username) => ({ text: username, value: username })
    ),
  ];

  const columns = [
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      filters: emailFilters,
      onFilter: (value, record) => record.user.email === value,
      filterSearch: true,
    },
    {
      title: "Username",
      dataIndex: ["user", "username"],
      key: "username",
      filters: usernameFilters,
      onFilter: (value, record) => record.user.username === value,
      filterSearch: true,
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      render: (text) => (
        <Text>
          {text || <Text type="secondary">No feedback provided</Text>}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => handleDeleteFeedback(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="p-6">
      <Card bordered={false} className="shadow-md">
        <div className="mb-4">
          <Title level={3}>User Feedback</Title>
          <Text type="secondary">
            View, filter, and manage all feedback submitted by users.
          </Text>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={feedback}
            rowKey="id"
            bordered
            pagination={{ pageSize: 8 }}
          />
        )}
      </Card>
    </div>
  );
}
