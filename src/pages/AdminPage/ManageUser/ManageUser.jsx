import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import {
  Avatar,
  Button,
  Modal,
  Spin,
  Table,
  Card,
  Typography,
  Space,
} from "antd";
import { FaBan } from "react-icons/fa";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [isModalBanUser, setIsModalBanUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUser();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      await adminService.banUser(userId);
      toast.success("User banned successfully!");
      fetchUsers();
      setIsModalBanUser(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to ban user");
    }
  };

  const handleModalBanUser = (user) => {
    setSelectedUser(user);
    setIsModalBanUser(true);
  };

  const usernameFilters = [
    ...Array.from(new Set(users.map((item) => item.username))).map(
      (username) => ({
        text: username,
        value: username,
      })
    ),
  ];

  const emailFilters = [
    ...Array.from(new Set(users.map((item) => item.email))).map((email) => ({
      text: email,
      value: email,
    })),
  ];

  const userColumns = [
    {
      title: "Avatar",
      dataIndex: ["profile", "avatarUrl"],
      key: "avatar",
      render: (url) => <Avatar src={url} size={40} />,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      filters: usernameFilters,
      onFilter: (value, record) => record.username === value,
      filterSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: emailFilters,
      onFilter: (value, record) => record.email === value,
      filterSearch: true,
    },
    {
      title: "Full Name",
      dataIndex: ["profile", "fullName"],
      key: "fullName",
    },
    {
      title: "Gender",
      dataIndex: ["profile", "gender"],
      key: "gender",
    },
    {
      title: "Phone",
      dataIndex: ["profile", "phone"],
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => handleModalBanUser(record)}
          className="!border-none"
          title="Ban User"
        >
          <FaBan size={20} className="text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card bordered={false} className="shadow-md">
        <div className="mb-5">
          <Title level={3}>Manage Users</Title>
          <Text type="secondary">
            Review all users, filter them by email/username, and manage access.
          </Text>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={users}
            columns={userColumns}
            rowKey="id"
            bordered
            pagination={{ pageSize: 8 }}
          />
        )}
      </Card>

      <Modal
        open={isModalBanUser}
        onCancel={() => setIsModalBanUser(false)}
        title={<span className="text-lg font-semibold">Ban User</span>}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="primary"
              danger
              onClick={() => handleBanUser(selectedUser?.id)}
            >
              Confirm Ban
            </Button>
            <Button onClick={() => setIsModalBanUser(false)}>Cancel</Button>
          </div>
        }
      >
        <div className="space-y-2">
          <Text>Are you sure you want to ban this user?</Text>
          <div className="flex items-center gap-3 mt-2">
            <Avatar src={selectedUser?.profile?.avatarUrl} size={48} />
            <div>
              <Text strong>{selectedUser?.username}</Text>
              <br />
              <Text type="secondary">{selectedUser?.email}</Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
