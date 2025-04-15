import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Descriptions, Button, Card, Tag, Badge } from "antd";
import { motion } from "framer-motion";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

export default function DetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.data) {
    return (
      <div className="text-center text-gray-500 mt-10">No data provided.</div>
    );
  }

  const item = state.data;

  // Color mapping for statuses

  const statusMap = {
    PENDING: {
      tagColor: "default",
      badgeStatus: "default",
      label: "Pending",
    },
    TODO: {
      tagColor: "blue",
      badgeStatus: "processing",
      label: "To Do",
    },
    INPROGRESS: {
      tagColor: "orange",
      badgeStatus: "warning",
      label: "In Progress",
    },
    DONE: {
      tagColor: "green",
      badgeStatus: "success",
      label: "Done",
    },
  };

  const currentStatus = statusMap[item.status] || {
    tagColor: "default",
    badgeStatus: "default",
    label: item.status,
  };

  return (
    <motion.div
      className="max-w-8xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {item.type} - {item.label}
          </h1>
          <p className="text-sm text-gray-500">
            Track the progress and status of this item below.
          </p>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Main Info */}

        <div className="md:col-span-2 space-y-6">
          {/* Status Card */}
          <Card title="Status" className="shadow rounded-xl">
            <div className="flex items-center gap-2">
              <Badge status={currentStatus.badgeStatus} />
              <Tag
                color={currentStatus.tagColor}
                className="text-sm px-3 py-1 rounded-md"
              >
                {currentStatus.label}
              </Tag>
            </div>
          </Card>

          <Card title="Details" className="shadow rounded-xl">
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Summary">
                {item.summary}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {item.description}
              </Descriptions.Item>
              <Descriptions.Item label="Attachment">
                {item.attachmentLink ? (
                  <a
                    href={item.attachmentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📎 {item.attachment}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No attachment</span>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Priority">
                {item.priority}
              </Descriptions.Item>
              {item.severity && (
                <Descriptions.Item label="Severity">
                  {item.severity || "N/A"}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </div>

        {/* Right Side: Meta Info */}
        <div className="space-y-6">
          <Card title="People" className="shadow rounded-xl">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Assignee">
                {item.assignee}
              </Descriptions.Item>
              <Descriptions.Item label="Reporter">
                {item.reporter}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Dates" className="shadow rounded-xl">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Start Date">
                {moment(item.startDate).format("DD-MM-YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {moment(item.dueDate).format("DD-MM-YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
