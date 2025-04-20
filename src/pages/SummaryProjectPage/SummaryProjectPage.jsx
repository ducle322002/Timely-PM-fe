import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import {
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("Project");

  // Color scheme for consistency
  const colors = {
    primary: "#1890ff",
    success: "#52c41a",
    warning: "#faad14",
    danger: "#ff4d4f",
    pending: "#FF6384",
    toDo: "#36A2EB",
    inProgress: "#FFCE56",
    done: "#4CAF50",
    high: "#ff4d4f",
    medium: "#faad14",
    low: "#52c41a",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await projectService.getProjectsById(id);
        const data = response.data.chartData;

        setProjectName(response.data.name || "Project");
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
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load project data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const barData = {
    labels: ["New", "To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Tasks by Status",
        data: [
          stats.tasksByStatus.PENDING || 0,
          stats.tasksByStatus.TODO || 0,
          stats.tasksByStatus.INPROGRESS || 0,
          stats.doneTasks || 0,
        ],
        backgroundColor: [
          colors.pending,
          colors.toDo,
          colors.inProgress,
          colors.done,
        ],
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
        backgroundColor: [colors.high, colors.medium, colors.low],
      },
    ],
  };

  const completedTasks = stats.doneTasks || 0;
  const totalTasks = stats.totalTasks || 0;
  const pendingTasks = stats.pendingTasks || 0;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  // Prepare project status summary text
  const getStatusSummary = () => {
    if (totalTasks === 0)
      return "No tasks have been created for this project yet.";
    if (progress === 100)
      return "All tasks have been completed! The project is done.";
    if (progress > 75)
      return "The project is nearing completion with most tasks done.";
    if (progress > 50)
      return "Good progress! More than half of the tasks are completed.";
    if (progress > 25)
      return "The project is underway with some completed tasks.";
    return "The project is in early stages with most tasks still pending.";
  };

  // Add priority indicator
  const getPriorityStatus = () => {
    const highCount = stats.priorityDistribution.HIGH || 0;
    const total = Object.values(stats.priorityDistribution).reduce(
      (sum, current) => sum + current,
      0
    );

    if (total === 0)
      return { text: "No priority tasks", color: colors.primary };
    if (highCount > 0)
      return {
        text: `${highCount} high priority tasks require attention`,
        color: colors.high,
      };
    return { text: "No high priority tasks pending", color: colors.success };
  };

  const priorityStatus = getPriorityStatus();

  // Prepare a data source with group header rows.
  const dataSource = [
    { key: "1", label: "Total Tasks", value: totalTasks },
    { key: "group1", group: "Task Status Metrics" },
    { key: "2", label: "New Tasks", value: pendingTasks },
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
            <strong style={{ fontSize: "1.1rem", color: colors.primary }}>
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

  // Set chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false,
        mode: "index",
      },
      legend: {
        position: "top",
      },
    },
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          tip="Loading project dashboard..."
          size="large"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert
          message="Error Loading Project"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4  "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
            {projectName} Summary
          </h1>

          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <p className="text-lg text-center text-gray-700">
              {getStatusSummary()}
            </p>
            <p
              className="text-center mt-2"
              style={{ color: priorityStatus.color }}
            >
              {priorityStatus.text}
            </p>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card
            className="shadow-md rounded-lg hover:shadow-lg transition-shadow"
            bodyStyle={{ padding: "24px" }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Overall Progress</h2>
              <div className="text-sm text-gray-500">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
              strokeColor={{
                from: colors.primary,
                to: colors.success,
              }}
              size="large"
              showInfo
              format={(percent) => (
                <Tooltip
                  title={`${completedTasks}/${totalTasks} tasks completed`}
                >
                  <span>{percent}%</span>
                </Tooltip>
              )}
            />
          </Card>
        </motion.div>

        {/* Widgets */}
        <motion.div variants={itemVariants} className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card
                className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                bodyStyle={{ padding: "20px" }}
              >
                <Statistic
                  title={<span className="font-medium">Total Tasks</span>}
                  value={totalTasks}
                  valueStyle={{ color: colors.primary }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                bodyStyle={{ padding: "20px" }}
              >
                <Statistic
                  title={<span className="font-medium">Completed Tasks</span>}
                  value={completedTasks}
                  valueStyle={{ color: colors.success }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                bodyStyle={{ padding: "20px" }}
              >
                <Statistic
                  title={<span className="font-medium">New Tasks</span>}
                  value={pendingTasks}
                  valueStyle={{ color: colors.warning }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                bodyStyle={{ padding: "20px" }}
              >
                <Statistic
                  title={<span className="font-medium">Progress</span>}
                  value={progress}
                  suffix="%"
                  valueStyle={{
                    color:
                      progress < 30
                        ? colors.warning
                        : progress < 70
                        ? colors.primary
                        : colors.success,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Charts */}
        <Row gutter={[24, 24]}>
          {/* Bar Chart */}
          <Col xs={24} lg={24}>
            <motion.div variants={itemVariants}>
              <Card
                title="Tasks by Status"
                className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="h-64 md:h-80">
                  <Bar data={barData} options={chartOptions} />
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Pie Chart */}
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card
                title="Priority Distribution"
                className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                bodyStyle={{ padding: "24px" }}
              >
                <div className="h-64 md:h-131">
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </Card>
            </motion.div>
          </Col>

          {/* Grouped Metrics Table */}
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants}>
              <Card
                title="Task Metrics"
                className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
              >
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  bordered
                  size="middle"
                  className="overflow-hidden"
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </motion.div>
  );
}
