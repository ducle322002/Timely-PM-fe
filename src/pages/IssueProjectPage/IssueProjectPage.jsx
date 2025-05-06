import {
  Table,
  Avatar,
  Tooltip,
  Button,
  Spin,
  Badge,
  Input,
  Empty,
  Tag,
  Space,
  Card,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import projectService from "../../services/projectService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { route } from "../../routes";
import moment from "moment";
import { all } from "axios";

export default function IssueProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [issues, setIssues] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await projectService.getTasksForProject(id);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchIssues = async () => {
    setLoadingTasks(true);
    try {
      const response = await projectService.getIssuesForProject(id);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchIssues();
  }, [id]);

  // Ensure each item has a unique key by using a prefix with the ID
  const mappedIssues = issues.map((item) => ({
    key: `issue-${item.id}`,
    id: item.id,
    type: "Issue",
    label: item.label,
    summary: item.summer,
    description: item.description,
    attachment: item.attachment?.fileName || "No File",
    attachmentLink: item.attachment?.fileUrl || null,
    startDate: item.startDate,
    dueDate: item.dueDate,
    priority: item.priority,
    severity: item.severity,
    status: item.status,
    assignee: item.assignee,
    reporter: item.reporter,
  }));

  // Map and normalize tasks with unique prefixed keys
  const mappedTasks = tasks.flatMap((task) => {
    const baseTask = {
      key: `task-${task.id}`,
      id: task.id,
      type: "Task",
      label: task.label,
      summary: task.summer,
      description: task.description,
      attachment: task.attachment?.fileName || "No File",
      attachmentLink: task.attachment?.fileUrl || null,
      startDate: task.startDate,
      dueDate: task.dueDate,
      priority: task.priority,
      severity: null,
      status: task.status,
      assignee: task.assignee,
      reporter: task.reporter,
    };

    const issueItems =
      task.issues?.map((issue) => ({
        key: `task-issue-${issue.id}`,
        id: issue.id,
        type: "Issue (from task)",
        label: issue.label,
        summary: issue.summer,
        description: issue.description,
        attachment: issue.attachment?.fileName || "No File",
        attachmentLink: issue.attachment?.fileUrl || null,
        startDate: issue.startDate,
        dueDate: issue.dueDate,
        priority: issue.priority,
        severity: issue.severity,
        status: issue.status,
        assignee: issue.assignee,
        reporter: issue.reporter,
      })) || [];
    console.log(task);
    return [baseTask, ...issueItems];
  });
  console.log(tasks);
  const allData = [...mappedIssues, ...mappedTasks];

  console.log(allData);
  // Filter data based on search text
  const filteredData = searchText
    ? allData.filter(
        (item) =>
          (item.label?.toLowerCase() || "").includes(
            searchText.toLowerCase()
          ) ||
          (item.summary?.toLowerCase() || "").includes(
            searchText.toLowerCase()
          ) ||
          (item.description?.toLowerCase() || "").includes(
            searchText.toLowerCase()
          ) ||
          (item.assignee?.username?.toLowerCase() || "").includes(
            searchText.toLowerCase()
          ) ||
          (item.reporter?.username?.toLowerCase() || "").includes(
            searchText.toLowerCase()
          )
      )
    : allData;

  // Get priority color
  const getPriorityColor = (priority) => {
    switch ((priority || "").toUpperCase()) {
      case "HIGH":
        return "red";
      case "MEDIUM":
        return "orange";
      case "LOW":
        return "green";
      default:
        return "default";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DONE":
        return "green";
      case "INPROGRESS":
        return "blue";
      case "TODO":
        return "purple";
      case "PENDING":
        return "orange";
      default:
        return "default";
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    if (type === "Task") return <FileTextOutlined />;
    return <ExclamationCircleOutlined />;
  };

  // Create unique filters by extracting distinct values
  const getUniqueFilters = (fieldName) => {
    const uniqueValues = [
      ...new Set(allData.map((item) => item[fieldName]).filter(Boolean)),
    ];
    return uniqueValues.map((value) => ({
      text: value === "PENDING" ? "NEW" : value,
      value: value,
    }));
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Task", value: "Task" },
        { text: "Issue", value: "Issue" },
        { text: "Issue (from task)", value: "Issue (from task)" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) => (
        <Tag icon={getTypeIcon(text)} color={text === "Task" ? "blue" : "red"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      filterSearch: true,
      filters: getUniqueFilters("label"),
      onFilter: (value, record) => record.label === value,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: getUniqueFilters("status"),
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Badge
          status={
            getStatusColor(status) === "green"
              ? "success"
              : getStatusColor(status) === "blue"
              ? "processing"
              : getStatusColor(status) === "orange"
              ? "warning"
              : "default"
          }
          text={
            <Tag color={getStatusColor(status)}>
              {status === "PENDING" ? "NEW" : status}
            </Tag>
          }
        />
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      filters: getUniqueFilters("priority"),
      onFilter: (value, record) => record.priority === value,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) =>
        dueDate ? moment(dueDate).format("DD-MM-YYYY") : "N/A",
      sorter: (a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return moment(a.dueDate).unix() - moment(b.dueDate).unix();
      },
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      render: (assignee) => {
        if (!assignee) return <span className="text-gray-400">Unassigned</span>;

        return (
          <Tooltip
            title={assignee.username || "Unassigned"}
            className="flex items-center justify-start gap-5"
          >
            <Avatar
              size="small"
              src={assignee.profile?.avatarUrl}
              style={{
                backgroundColor: assignee ? "#1890ff" : "#ccc",
              }}
            />
            <span className="truncate w-30">
              {assignee.username || "Unassigned"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
      render: (reporter) => {
        if (!reporter) return <span className="text-gray-400">Unassigned</span>;

        return (
          <Tooltip
            title={reporter.username || "Unassigned"}
            className="flex items-center justify-start gap-5"
          >
            <Avatar
              size="small"
              src={reporter.profile?.avatarUrl}
              style={{
                backgroundColor: reporter ? "#1890ff" : "#ccc",
              }}
            />
            <span className="truncate w-20">
              {reporter.username || "Unassigned"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(
              `${route.workspace}/${route.project}/${id}/task-detail/${record.id}`,
              { state: { data: record } }
            )
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold m-0">Project Issues & Tasks</h1>
          <Space size="middle">
            <Input
              placeholder="Search issues & tasks"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Space>
        </div>

        {loadingTasks ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading tasks and issues..." />
          </div>
        ) : filteredData.length === 0 ? (
          <Empty
            description="No tasks or issues found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-16"
          />
        ) : (
          <Table
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            columns={columns}
            dataSource={filteredData}
            scroll={{ x: 1000 }}
            rowClassName={(record) =>
              record.type.includes("Issue") ? "bg-red-50" : ""
            }
            rowKey="key"
          />
        )}
      </Card>
    </div>
  );
}
