import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Progress } from "antd";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";

export default function SummaryProjectPage() {
  const { id } = useParams();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    toDoTasks: 0,
    progressTasks: 0,
    doneTasks: 0,
    tasksByStatus: {},
    priorityDistribution: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjectsById(id);
        const data = response.data.chartData;

        setStats({
          totalTasks: data.totalTasks || 0,
          pendingTasks: data.pendingTasks || 0,
          toDoTasks: data.toDoTasks || 0,
          progressTasks: data.progressTasks || 0,
          doneTasks: data.doneTasks || 0,
          tasksByStatus: data.tasksByStatus || {},
          priorityDistribution: data.priorityDistribution || {},
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchData();
  }, [id]);

  const barData = {
    labels: ["Pending", "To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          stats.tasksByStatus.PENDING || 0,
          stats.tasksByStatus.TODO || 0,
          stats.tasksByStatus.INPROGRESS || 0,
          stats.doneTasks || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  const pieData = {
    labels: ["HIGH", "MEDIUM", "LOW"],
    datasets: [
      {
        label: "Priority Distribution",
        data: [
          stats.priorityDistribution.HIGH || 0,
          stats.priorityDistribution.MEDIUM || 0,
          stats.priorityDistribution.LOW || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const completedTasks = stats.doneTasks || 0;
  const totalTasks = stats.totalTasks || 0;
  const pendingTasks = stats.pendingTasks || 0;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare a data source with group header rows.
  // For group header rows, use a property (for example, "group") and no "label/value" pair.
  const dataSource = [
    { key: "1", label: "Total Tasks", value: totalTasks },
    { key: "group1", group: "Task Status Metrics" },
    { key: "2", label: "Pending Tasks", value: pendingTasks },
    { key: "3", label: "In Progress Tasks", value: stats.progressTasks || 0 },
    { key: "4", label: "To Do Tasks", value: stats.toDoTasks || 0 },
    { key: "5", label: "Completed Tasks", value: completedTasks },
    { key: "group2", group: "Priority Distribution Metrics" },
    {
      key: "6",
      label: "High Priority Tasks",
      value: stats.priorityDistribution.HIGH || 0,
    },
    {
      key: "7",
      label: "Medium Priority Tasks",
      value: stats.priorityDistribution.MEDIUM || 0,
    },
    {
      key: "8",
      label: "Low Priority Tasks",
      value: stats.priorityDistribution.LOW || 0,
    },
  ];

  // Define table columns with onCell adjustments.
  const columns = [
    {
      title: "Metric",
      dataIndex: "label",
      key: "label",
      // Render group header if "group" exists.
      render: (text, record) => {
        if (record.group) {
          return (
            <strong style={{ fontSize: "1.1rem", color: "#1890ff" }}>
              {record.group}
            </strong>
          );
        }
        return text;
      },
      // If row is a group header, span both columns.
      onCell: (record) => {
        if (record.group) {
          return { colSpan: 2 };
        }
        return {};
      },
    },
    {
      title: "Quantity",
      dataIndex: "value",
      key: "value",
      // Hide this cell if it's a group header.
      onCell: (record) => {
        if (record.group) {
          return { colSpan: 0 };
        }
        return {};
      },
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-[5%]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Project Summary
      </h1>

      {/* Overall Progress */}
      <Row className="mb-8">
        <Col span={24}>
          <Card className="shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
              strokeColor={{
                from: "#1890ff",
                to: "#52c41a",
              }}
              size="large"
              showInfo
            />
          </Card>
        </Col>
      </Row>

      {/* Widgets */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-lg text-center text-3xl font-bold">
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-lg text-center text-3xl font-bold">
            <Statistic
              title="Completed Tasks"
              value={completedTasks}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-lg text-center text-3xl font-bold">
            <Statistic
              title="Pending Tasks"
              value={pendingTasks}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-lg text-center text-3xl font-bold">
            <Statistic
              title="Progress"
              value={`${progress}%`}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        {/* Bar Chart */}
        <Col xs={24} md={24}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card title="Tasks by Status" className="shadow-lg rounded-lg ">
              <div className="flex justify-center items-center h-[600px]">
                <Bar data={barData} />
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              title="Priority Distribution"
              className="shadow-lg rounded-lg "
            >
              <div className="flex justify-center items-center h-full">
                <Pie data={pieData} className="!h-[620px]" />
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Grouped Metrics Table */}
        <Col xs={24} md={12}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card title="Task Metrics" className="shadow-lg rounded-lg">
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                className="!h-[620px]"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
}
