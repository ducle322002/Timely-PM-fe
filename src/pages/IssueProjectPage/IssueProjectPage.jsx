import { Table, Avatar, Tooltip, Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import projectService from "../../services/projectService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { route } from "../../routes";

export default function IssueProjectPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [issues, setIssues] = useState([]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await projectService.getTasksForProject(id);
      console.log("task", response.data);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchIssues = async () => {
    setLoadingTasks(true);
    try {
      const response = await projectService.getIssuesForProject(id);
      console.log("issue", response.data);
      setIssues(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchIssues();
  }, [id]);

  const mappedIssues = issues.map((item) => ({
    key: item.id,
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
    assignee: item.assignee?.profile.fullName,
    reporter: item.reporter?.profile.fullName,
  }));

  // Map and normalize tasks (including their issues, if any)
  const mappedTasks = tasks.flatMap((task) => {
    const baseTask = {
      key: task.id,
      type: "Task",
      label: task.label,
      summary: task.summer,
      description: task.description,
      attachment: task.attachment?.fileName || "No File",
      attachmentLink: task.attachment?.fileUrl || null,
      startDate: task.startDate,
      dueDate: task.dueDate,
      priority: task.priority,
      severity: null, // Not available in task
      status: task.status,
      assignee: task.assignee?.profile.fullName,
      reporter: task.reporter?.profile.fullName,
    };

    const issueItems =
      task.issues?.map((issue) => ({
        key: issue.id,
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
        assignee: issue.assignee?.profile.fullName,
        reporter: issue.reporter?.profile.fullName,
      })) || [];

    return [baseTask, ...issueItems];
  });

  const allData = [...mappedIssues, ...mappedTasks];

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
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      filterSearch: true,
      filters: Array.from(new Set(allData.map((item) => item.label))).map(
        (label) => ({
          text: label,
          value: label,
        })
      ),
      onFilter: (value, record) => record.label === value,
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      render: (text, record) =>
        record.attachmentLink ? (
          <a
            href={record.attachmentLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        ) : (
          "No Attachment"
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
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      filters: Array.from(new Set(allData.map((item) => item.priority))).map(
        (priority) => ({
          text: priority,
          value: priority,
        })
      ),
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      filters: Array.from(
        new Set(allData.map((item) => item.severity).filter(Boolean))
      ).map((severity) => ({
        text: severity,
        value: severity,
      })),
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: Array.from(new Set(allData.map((item) => item.status))).map(
        (status) => ({
          text: status,
          value: status,
        })
      ),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
    },
    {
      title: "Details",
      key: "details",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() =>
            navigate(
              `${route.workspace}/${route.project}/${id}/task-detail/${record.key}`,
              { state: { data: record } }
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1 className="text-2xl font-bold">Overview </h1>
      {loadingTasks ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="id"
          pagination={true}
          columns={columns}
          dataSource={allData}
        />
      )}
    </>
  );
}
