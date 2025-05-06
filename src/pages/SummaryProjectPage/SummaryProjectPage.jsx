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
  Tabs,
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
  BugOutlined,
  TagOutlined,
} from "@ant-design/icons";

export default function SummaryProjectPage() {
  const { id } = useParams();
  const [stats, setStats] = useState({
    // Task stats
    totalTasks: 0,
    pendingTasks: 0,
    toDoTasks: 0,
    inProgressTasks: 0,
    waitingTestTasks: 0,
    doneTasks: 0,
    tasksByStatus: {},
    priorityDistribution: {},

    // Issue stats
    totalIssues: 0,
    openIssues: 0,
    notBugIssues: 0,
    fixedIssues: 0,
    pendingRetestIssues: 0,
    retestIssues: 0,
    reOpenedIssues: 0,
    verifiedIssues: 0,
    closedIssues: 0,
    issueByStatus: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("Project");
  const [activeTab, setActiveTab] = useState("tasks");

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
    closed: "#9C27B0",
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
          inProgressTasks: data.inProgressTasks || 0,
          waitingTestTasks: data.waitingTestTasks || 0,
          doneTasks: data.doneTasks || 0,
          tasksByStatus: data.tasksByStatus || {},
          priorityDistribution: data.priorityDistribution || {},

          // Issue stats
          totalIssues: data.totalIssues || 0,
          openIssues: data.openIssues || 0,
          notBugIssues: data.notBugIssues || 0,
          fixedIssues: data.fixedIssues || 0,
          pendingRetestIssues: data.pendingRetestIssues || 0,
          retestIssues: data.retestIssues || 0,
          reOpenedIssues: data.reOpenedIssues || 0,
          verifiedIssues: data.verifiedIssues || 0,
          closedIssues: data.closedIssues || 0,
          issueByStatus: data.issueByStatus || {},
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

  const taskBarData = {
    labels: Object.keys(stats.tasksByStatus).map((status) =>
      status === "DONE"
        ? "Done"
        : status === "PENDING"
        ? "Pending"
        : status === "TODO"
        ? "To Do"
        : status === "INPROGRESS"
        ? "In Progress"
        : status
    ),
    datasets: [
      {
        label: "Tasks by Status",
        data: Object.values(stats.tasksByStatus),
        backgroundColor: Object.keys(stats.tasksByStatus).map((status) =>
          status === "DONE"
            ? colors.done
            : status === "PENDING"
            ? colors.pending
            : status === "TODO"
            ? colors.toDo
            : status === "INPROGRESS"
            ? colors.inProgress
            : colors.primary
        ),
      },
    ],
  };

  const issueBarData = {
    labels: Object.keys(stats.issueByStatus).map((status) =>
      status === "CLOSED" ? "Closed" : status === "OPEN" ? "Open" : status
    ),
    datasets: [
      {
        label: "Issues by Status",
        data: Object.values(stats.issueByStatus),
        backgroundColor: Object.keys(stats.issueByStatus).map((status) =>
          status === "CLOSED"
            ? colors.closed
            : status === "OPEN"
            ? colors.warning
            : colors.primary
        ),
      },
    ],
  };

  const priorityPieData = {
    labels: Object.keys(stats.priorityDistribution).map((priority) => priority),
    datasets: [
      {
        label: "Priority Distribution",
        data: Object.values(stats.priorityDistribution),
        backgroundColor: Object.keys(stats.priorityDistribution).map(
          (priority) =>
            priority === "HIGH"
              ? colors.high
              : priority === "MEDIUM"
              ? colors.medium
              : priority === "LOW"
              ? colors.low
              : colors.primary
        ),
      },
    ],
  };

  const completedTasks = stats.doneTasks || 0;
  const totalTasks = stats.totalTasks || 0;
  const pendingTasks = stats.pendingTasks || 0;
  const taskProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const closedIssues = stats.closedIssues || 0;
  const totalIssues = stats.totalIssues || 0;
  const issueProgress =
    totalIssues > 0 ? Math.round((closedIssues / totalIssues) * 100) : 0;

  // Prepare project status summary text
  const getStatusSummary = () => {
    if (totalTasks === 0 && totalIssues === 0)
      return "No tasks or issues have been created for this project yet.";

    let taskSummary = "";
    if (totalTasks > 0) {
      if (taskProgress === 100) taskSummary = "All tasks have been completed!";
      else if (taskProgress > 75) taskSummary = "Most tasks are complete.";
      else if (taskProgress > 50) taskSummary = "Good progress on tasks.";
      else if (taskProgress > 25) taskSummary = "Some tasks are completed.";
      else taskSummary = "Most tasks are still pending.";
    }

    let issueSummary = "";
    if (totalIssues > 0) {
      if (issueProgress === 100) issueSummary = "All issues have been closed!";
      else if (issueProgress > 75) issueSummary = "Most issues are closed.";
      else if (issueProgress > 50) issueSummary = "Good progress on issues.";
      else if (issueProgress > 25) issueSummary = "Some issues are closed.";
      else issueSummary = "Most issues are still open.";
    }

    if (totalTasks > 0 && totalIssues > 0)
      return `${taskSummary} ${issueSummary}`;
    else if (totalTasks > 0) return taskSummary;
    else return issueSummary;
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
        text: `${highCount} high priority items require attention`,
        color: colors.high,
      };
    return { text: "No high priority items pending", color: colors.success };
  };

  const priorityStatus = getPriorityStatus();

  // Prepare task metrics table data
  const taskMetricsData = [
    { key: "1", label: "Total Tasks", value: totalTasks },
    { key: "group1", group: "Task Status Metrics" },
    { key: "2", label: "New Tasks", value: pendingTasks },
    { key: "3", label: "To Do Tasks", value: stats.toDoTasks || 0 },
    { key: "4", label: "In Progress Tasks", value: stats.inProgressTasks || 0 },
    {
      key: "5",
      label: "Waiting for Test Tasks",
      value: stats.waitingTestTasks || 0,
    },
    { key: "6", label: "Completed Tasks", value: completedTasks },
    { key: "group2", group: "Priority Distribution" },
    {
      key: "7",
      label: "High Priority Items",
      value: stats.priorityDistribution.HIGH || 0,
    },
    {
      key: "8",
      label: "Medium Priority Items",
      value: stats.priorityDistribution.MEDIUM || 0,
    },
    {
      key: "9",
      label: "Low Priority Items",
      value: stats.priorityDistribution.LOW || 0,
    },
  ];

  // Prepare issue metrics table data
  const issueMetricsData = [
    { key: "1", label: "Total Issues", value: totalIssues },
    { key: "group1", group: "Issue Status Metrics" },
    { key: "2", label: "Open Issues", value: stats.openIssues || 0 },
    { key: "3", label: "Not Bug Issues", value: stats.notBugIssues || 0 },
    { key: "4", label: "Fixed Issues", value: stats.fixedIssues || 0 },
    {
      key: "5",
      label: "Waiting Retest Issues",
      value: stats.pendingRetestIssues || 0,
    },
    { key: "6", label: "Retest Issues", value: stats.retestIssues || 0 },
    { key: "7", label: "Reopened Issues", value: stats.reOpenedIssues || 0 },
    { key: "8", label: "Verified Issues", value: stats.verifiedIssues || 0 },
    { key: "9", label: "Closed Issues", value: stats.closedIssues || 0 },
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

  const items = [
    {
      key: "tasks",
      label: "Tasks",
      children: (
        <>
          {/* Task Widgets */}
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
                    value={taskProgress}
                    suffix="%"
                    valueStyle={{
                      color:
                        taskProgress < 30
                          ? colors.warning
                          : taskProgress < 70
                          ? colors.primary
                          : colors.success,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* Tasks Progress Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card
              className="shadow-md rounded-lg hover:shadow-lg transition-shadow"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Task Progress</h2>
                <div className="text-sm text-gray-500">
                  {completedTasks} of {totalTasks} tasks completed
                </div>
              </div>
              <Progress
                percent={taskProgress}
                status={taskProgress === 100 ? "success" : "active"}
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

          {/* Task Status Charts */}
          <Row gutter={[24, 24]}>
            {/* Task Bar Chart */}
            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card
                  title="Tasks by Status"
                  className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                  bodyStyle={{ padding: "24px" }}
                >
                  <div className="h-64 md:h-80">
                    <Bar data={taskBarData} options={chartOptions} />
                  </div>
                </Card>
              </motion.div>
            </Col>

            {/* Grouped Task Metrics Table */}
            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card
                  title="Task Metrics"
                  className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                >
                  <Table
                    columns={columns}
                    dataSource={taskMetricsData}
                    pagination={false}
                    bordered
                    size="middle"
                    className="overflow-hidden"
                  />
                </Card>
              </motion.div>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "issues",
      label: "Issues",
      children: (
        <>
          {/* Issue Widgets */}
          <motion.div variants={itemVariants} className="mb-8">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                  bodyStyle={{ padding: "20px" }}
                >
                  <Statistic
                    title={<span className="font-medium">Total Issues</span>}
                    value={totalIssues}
                    valueStyle={{ color: colors.primary }}
                    prefix={<BugOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                  bodyStyle={{ padding: "20px" }}
                >
                  <Statistic
                    title={<span className="font-medium">Closed Issues</span>}
                    value={stats.closedIssues}
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
                    title={<span className="font-medium">Open Issues</span>}
                    value={stats.openIssues}
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
                    title={<span className="font-medium">Resolution Rate</span>}
                    value={issueProgress}
                    suffix="%"
                    valueStyle={{
                      color:
                        issueProgress < 30
                          ? colors.warning
                          : issueProgress < 70
                          ? colors.primary
                          : colors.success,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* Issues Progress Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card
              className="shadow-md rounded-lg hover:shadow-lg transition-shadow"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Issue Resolution Progress
                </h2>
                <div className="text-sm text-gray-500">
                  {stats.closedIssues} of {totalIssues} issues closed
                </div>
              </div>
              <Progress
                percent={issueProgress}
                status={issueProgress === 100 ? "success" : "active"}
                strokeColor={{
                  from: colors.primary,
                  to: colors.success,
                }}
                size="large"
                showInfo
                format={(percent) => (
                  <Tooltip
                    title={`${stats.closedIssues}/${totalIssues} issues closed`}
                  >
                    <span>{percent}%</span>
                  </Tooltip>
                )}
              />
            </Card>
          </motion.div>

          {/* Issue Status Charts */}
          <Row gutter={[24, 24]}>
            {/* Issue Bar Chart */}
            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card
                  title="Issues by Status"
                  className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                  bodyStyle={{ padding: "24px" }}
                >
                  <div className="h-64 md:h-80">
                    <Bar data={issueBarData} options={chartOptions} />
                  </div>
                </Card>
              </motion.div>
            </Col>

            {/* Grouped Issue Metrics Table */}
            <Col xs={24} lg={12}>
              <motion.div variants={itemVariants}>
                <Card
                  title="Issue Metrics"
                  className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                >
                  <Table
                    columns={columns}
                    dataSource={issueMetricsData}
                    pagination={false}
                    bordered
                    size="middle"
                    className="overflow-hidden"
                  />
                </Card>
              </motion.div>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "priorities",
      label: "Priorities",
      children: (
        <>
          {/* Priority Widgets */}
          <motion.div variants={itemVariants} className="mb-8">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                  bodyStyle={{ padding: "20px" }}
                >
                  <Statistic
                    title={<span className="font-medium">High Priority</span>}
                    value={stats.priorityDistribution.HIGH || 0}
                    valueStyle={{ color: colors.high }}
                    prefix={<TagOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                  bodyStyle={{ padding: "20px" }}
                >
                  <Statistic
                    title={<span className="font-medium">Medium Priority</span>}
                    value={stats.priorityDistribution.MEDIUM || 0}
                    valueStyle={{ color: colors.medium }}
                    prefix={<TagOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="shadow-md rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                  bodyStyle={{ padding: "20px" }}
                >
                  <Statistic
                    title={<span className="font-medium">Low Priority</span>}
                    value={stats.priorityDistribution.LOW || 0}
                    valueStyle={{ color: colors.low }}
                    prefix={<TagOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* Priority Distribution Chart */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <motion.div variants={itemVariants}>
                <Card
                  title="Priority Distribution"
                  className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                  bodyStyle={{ padding: "24px" }}
                >
                  <div className="h-64 md:h-96">
                    <Pie data={priorityPieData} options={chartOptions} />
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <motion.div
      className="min-h-screen p-4"
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
              <h2 className="text-xl font-semibold">Project Overview</h2>
              <div className="text-sm text-gray-500">
                {totalTasks} Tasks · {totalIssues} Issues
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Task Progress</span>
                </div>
                <Progress
                  percent={taskProgress}
                  status={taskProgress === 100 ? "success" : "active"}
                  strokeColor={{
                    from: colors.primary,
                    to: colors.success,
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Issue Resolution</span>
                </div>
                <Progress
                  percent={issueProgress}
                  status={issueProgress === 100 ? "success" : "active"}
                  strokeColor={{
                    from: colors.primary,
                    to: colors.success,
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants}>
          <Tabs
            defaultActiveKey="tasks"
            items={items}
            onChange={setActiveTab}
            className="bg-white rounded-lg shadow-md p-4"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
