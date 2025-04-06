import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { Button, DatePicker, Image, Select, Spin, Table, Tag } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ProjectStatistic() {
  const [projectData, setProjectData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllProject();
      setProjectData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  // Handle filters
  useEffect(() => {
    let data = [...projectData];

    if (statusFilter) {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      data = data.filter((item) =>
        item.topics?.some((topic) => {
          const topicStart = moment(topic.startDate);
          const topicEnd = moment(topic.dueDate);
          return (
            topicStart.isSameOrAfter(start, "day") &&
            topicEnd.isSameOrBefore(end, "day")
          );
        })
      );
    }

    setFilteredData(data);
  }, [statusFilter, dateRange, projectData]);

  const projectColumns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created By",
      dataIndex: ["profile", "fullName"],
      key: "fullName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "DONE" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Topics Count",
      dataIndex: "topics",
      key: "topics",
      render: (topics) => topics?.length ?? 0,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Project Statistics
      </h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <RangePicker
          onChange={(values) => setDateRange(values ?? [])}
          value={dateRange}
          format={"DD/MM/YYYY"}
        />
        <Select
          value={statusFilter}
          placeholder="Select Status"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="DONE">Done</Option>
        </Select>
        <Button
          onClick={() => {
            setDateRange([]);
            setStatusFilter(null);
            setFilteredData(projectData);
          }}
        >
          Reset Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={projectColumns}
          dataSource={filteredData}
          rowKey="id"
          bordered
        />
      )}
    </div>
  );
}
