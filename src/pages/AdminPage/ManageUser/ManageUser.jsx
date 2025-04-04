import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { Table } from "antd";

export default function ManageUser() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = adminService.getAllUser();
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

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={users} />
      )}
    </div>
  );
}
