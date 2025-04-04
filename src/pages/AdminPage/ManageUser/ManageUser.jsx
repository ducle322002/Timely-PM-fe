import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { Avatar, Button, Modal, Spin, Table } from "antd";
import { FaBan } from "react-icons/fa";
import toast from "react-hot-toast";

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
      console.log(response.data);
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
      const response = await adminService.banUser(userId);
      console.log(response.data);
      console.log(response);
      fetchUsers();
      toast.success("User banned successfully!");
      setIsModalBanUser(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to ban user:", error);
    }
  };

  const handleModalBanUser = (user) => {
    setIsModalBanUser(true);
    setSelectedUser(user);
    console.log(selectedUser);
  };

  const userColumns = [
    {
      title: "Avatar",
      dataIndex: ["profile", "avatarUrl"],
      key: "avatar",
      render: (url) => <Avatar src={url} />,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      filters: [
        ...new Set(
          users.map((item) => ({
            text: item.username,
            value: item.username,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.username === value,
      filterSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: [
        ...new Set(
          users.map((item) => ({
            text: item.email,
            value: item.email,
          }))
        ),
      ], // 👈 Auto-generate filters
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
      render: (text, record) => (
        <div>
          <Button
            onClick={() => handleModalBanUser(record)}
            className="!border-none"
          >
            <FaBan size={30} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={users} columns={userColumns} />
      )}

      <Modal
        open={isModalBanUser}
        onCancel={() => setIsModalBanUser(false)}
        title="Ban User"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => handleBanUser(selectedUser.id)}
              className="!bg-[#FF4D4F] !text-[#ffffff] "
            >
              Ban User
            </Button>
            <Button
              onClick={() => setIsModalBanUser(false)}
              className="!bg-[#ffffff] !text-[#000000]"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div>
          <p>Are you sure you want to ban {selectedUser?.username}?</p>
        </div>
      </Modal>
    </div>
  );
}
