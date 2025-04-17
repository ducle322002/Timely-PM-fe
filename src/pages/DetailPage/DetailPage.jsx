import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Descriptions,
  Button,
  Card,
  Tag,
  Badge,
  Progress,
  Space,
  Tooltip,
  Divider,
} from "antd";
import { motion } from "framer-motion";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

export default function DetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ExclamationCircleOutlined style={{ fontSize: 48 }} />
        <p className="mt-4 text-lg">No data provided.</p>
        <Button type="primary" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const item = state.data;
  console.log(item);
  // Color mapping for statuses with better visual indicators
  const statusMap = {
    PENDING: {
      tagColor: "default",
      badgeStatus: "default",
      label: "New",
      progress: 0,
      color: "#d9d9d9",
    },
    TODO: {
      tagColor: "blue",
      badgeStatus: "processing",
      label: "To Do",
      progress: 25,
      color: "#1890ff",
    },
    INPROGRESS: {
      tagColor: "orange",
      badgeStatus: "warning",
      label: "In Progress",
      progress: 65,
      color: "#fa8c16",
    },
    DONE: {
      tagColor: "green",
      badgeStatus: "success",
      label: "Done",
      progress: 100,
      color: "#52c41a",
    },
  };

  // Priority indicators
  const priorityMap = {
    LOW: { color: "green", icon: "↓" },
    MEDIUM: { color: "blue", icon: "○" },
    HIGH: { color: "orange", icon: "↑" },
    CRITICAL: { color: "red", icon: "!!" },
  };

  const currentStatus = statusMap[item.status] || {
    tagColor: "default",
    badgeStatus: "default",
    label: item.status,
    progress: 0,
    color: "#d9d9d9",
  };

  const priorityStyle = priorityMap[item.priority.toUpperCase()] || {
    color: "default",
    icon: "",
  };

  // Calculate if due date is approaching or past
  const today = moment();
  const dueDate = moment(item.dueDate);
  const daysUntilDue = dueDate.diff(today, "days");

  const getDueDateStatus = () => {
    if (daysUntilDue < 0) return { color: "red", text: "Overdue" };
    if (daysUntilDue <= 2) return { color: "orange", text: "Due soon" };
    return { color: "green", text: "On track" };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with breadcrumb-like navigation */}
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-10"
        >
          Back to Overview
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{item.label}</h1>
            <Tag className="ml-2">{item.type}</Tag>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Status & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Status Card */}
          <Card
            className="shadow-md rounded-xl overflow-hidden border-t-4"
            style={{ borderTopColor: currentStatus.color }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium mb-2">Status</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Badge status={currentStatus.badgeStatus} />
                  <Tag
                    color={currentStatus.tagColor}
                    className="text-sm px-3 py-1 rounded-md"
                  >
                    {currentStatus.label}
                  </Tag>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 w-full sm:w-1/2">
                <Progress
                  percent={currentStatus.progress}
                  status={currentStatus.progress === 100 ? "success" : "active"}
                  strokeColor={currentStatus.color}
                />
              </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined />
                  <span className="text-gray-500">Assignee:</span>
                  <span className="font-medium">{item.assignee.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span className="text-gray-500">Reporter:</span>
                  <span className="font-medium">{item.reporter.username}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag
                    color={priorityStyle.color}
                    className="flex items-center"
                  >
                    {priorityStyle.icon} {item.priority}
                  </Tag>
                  {item.severity && (
                    <Tag color="purple">Severity: {item.severity}</Tag>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <ClockCircleOutlined />
                  <Tag color={dueDateStatus.color}>
                    {dueDateStatus.text} -{" "}
                    {moment(item.dueDate).format("DD-MM-YYYY")}
                  </Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card title="Details" className="shadow-md rounded-xl">
            <div className="mb-4">
              <h3 className="text-gray-500 mb-1">Summary</h3>
              <p className="text-lg">{item.summary}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-gray-500 mb-1">Description</h3>
              <div className="rounded-lg">{item.description}</div>
            </div>

            <div>
              <h3 className="text-gray-500 mb-1">Attachment</h3>
              {item.attachmentLink ? (
                <a
                  href={item.attachmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline p-2 border border-blue-100 rounded-lg bg-blue-50 inline-block"
                >
                  <FileOutlined /> {item.attachment}
                </a>
              ) : (
                <span className="text-gray-400 italic">No attachment</span>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Timeline & Metadata */}
        <div className="space-y-6">
          <Card title="Timeline" className="shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span className="text-gray-600">Start Date:</span>
                </div>
                <p className="font-medium">
                  {moment(item.startDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined
                    className={
                      dueDateStatus.color === "red" ? "text-red-500" : ""
                    }
                  />
                  <span className="text-gray-600">Due Date:</span>
                </div>
                <p
                  className={`font-medium ${
                    dueDateStatus.color === "red" ? "text-red-500" : ""
                  }`}
                >
                  {moment(item.dueDate).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>

            <div className="relative pt-4">
              <div
                className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"
                style={{ left: "7px" }}
              ></div>

              <div className="flex mb-4">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-green-500 z-10"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-gray-500">
                    {moment(item.startDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="relative">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      currentStatus.progress === 100
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } z-10`}
                  ></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">
                    Current Status: {currentStatus.label}
                  </p>
                  <p className="text-xs text-gray-500">Updated recently</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
