import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import taskService from "../../services/taskService";
import { Avatar, Modal, Spin, Tabs } from "antd";
import projectService from "../../services/projectService";
import toast from "react-hot-toast";
import { UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import issueService from "../../services/issueService";
import questionService from "../../services/questionService";

export default function BoardPage() {
  const [tasksByStatus, setTasksByStatus] = useState({
    PENDING: [],
    TODO: [],
    INPROGRESS: [],
    DONE: [],

    OPEN: [],
    NOT_BUG: [],
    FIXED: [],
    PENDING_RETEST: [],
    RETEST: [],
    RE_OPENED: [],
    VERIFIED: [],
    CLOSED: [],
  });

  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const [topics, setTopics] = useState([]);
  const [defaultTabKey, setDefaultTabKey] = useState("");
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [activeTopicType, setActiveTopicType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      setProjectDetail(response.data);
      const sortedTopics = response.data.topics.sort((a, b) =>
        b.type.localeCompare(a.type)
      );
      setTopics(sortedTopics);
      // Set the default tab key after topics are sorted
      if (sortedTopics.length > 0) {
        setDefaultTabKey(sortedTopics[0].id); // Default to the first topic's ID
        setActiveTabKey(sortedTopics[0].id); // Set active tab to the first topic
        setActiveTopicType(sortedTopics[0].type); // Ensure type is set
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchByType = async () => {
    if (!activeTabKey || !activeTopicType) return;
    setLoading(true);

    try {
      let response = null;
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      switch (activeTopicType) {
        case "TASK":
          response = await taskService.getTasks(params);

          break;
        case "ISSUE":
          response = await issueService.getIssues(params);

          break;
        case "QUESTION":
          response = await questionService.getQuestions(params);

          break;
        default:
          return;
      }

      const data = response.data;
      console.log("data", data);
      if (activeTopicType === "ISSUE") {
        // Use issue-specific status grouping
        const issueGrouped = {
          OPEN: data.filter((t) => t.status === "OPEN"),
          NOT_BUG: data.filter((t) => t.status === "NOT_BUG"),
          FIXED: data.filter((t) => t.status === "FIXED"),
          PENDING_RETEST: data.filter((t) => t.status === "PENDING_RETEST"),
          RETEST: data.filter((t) => t.status === "RETEST"),
          RE_OPENED: data.filter((t) => t.status === "RE_OPENED"),
          VERIFIED: data.filter((t) => t.status === "VERIFIED"),
          CLOSED: data.filter((t) => t.status === "CLOSED"),
        };
        setTasksByStatus(issueGrouped);
      } else {
        // Use standard task/question status grouping
        const grouped = {
          PENDING: data.filter((t) => t.status === "PENDING"),
          TODO: data.filter((t) => t.status === "TODO"),
          INPROGRESS: data.filter((t) => t.status === "INPROGRESS"),
          DONE: data.filter((t) => t.status === "DONE"),
        };
        setTasksByStatus(grouped);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  // useEffect(() => {
  //   if (activeTabKey) {
  //     fetchTasks();
  //     fetchIssue();
  //     fetchQuestion();
  //   }
  // }, [activeTabKey]);

  useEffect(() => {
    if (activeTabKey && activeTopicType) {
      console.log(
        "activeTabKey:",
        activeTabKey,
        "activeTopicType:",
        activeTopicType
      );
      fetchByType();
    }
  }, [activeTabKey, activeTopicType]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const originalTasksByStatus = JSON.parse(JSON.stringify(tasksByStatus));

    if (sourceStatus === destinationStatus) {
      const reorderedTasks = Array.from(tasksByStatus[sourceStatus]);
      const [removed] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, removed);

      setTasksByStatus((prev) => ({
        ...prev,
        [sourceStatus]: reorderedTasks,
      }));
    } else {
      try {
        const sourceTasks = Array.from(tasksByStatus[sourceStatus]);
        const destinationTasks = Array.from(tasksByStatus[destinationStatus]);
        const [removed] = sourceTasks.splice(result.source.index, 1);
        destinationTasks.splice(result.destination.index, 0, removed);

        setTasksByStatus((prev) => ({
          ...prev,
          [sourceStatus]: sourceTasks,
          [destinationStatus]: destinationTasks,
        }));
        const updatePayload = {
          projectId: id,
          topicId: activeTabKey,
          status: destinationStatus,
        };

        switch (activeTopicType) {
          case "TASK":
            await taskService.updateTaskStatus(
              result.draggableId,
              updatePayload
            );
            break;
          case "ISSUE":
            if (
              (destinationStatus === "NOT_BUG" ||
                destinationStatus === "CLOSED") &&
              sourceStatus === "VERIFIED"
            ) {
              // Fixed the condition here - it was checking result.draggableId instead of destinationStatus
              await new Promise((resolve, reject) => {
                Modal.confirm({
                  title: `Are you sure you want to move this issue to ${destinationStatus}?`,
                  content: "This action cannot be undone.",
                  onOk: async () => {
                    try {
                      await issueService.updateIssueStataus(
                        result.draggableId,
                        updatePayload
                      );
                      resolve();
                    } catch (error) {
                      reject(error);
                    }
                  },
                  onCancel: () => {
                    // Restore the original state if user cancels
                    setTasksByStatus(originalTasksByStatus);
                    reject(new Error("Operation cancelled"));
                  },
                });
              });
            } else {
              await issueService.updateIssueStataus(
                result.draggableId,
                updatePayload
              );
            }
            break;
          case "QUESTION":
            await questionService.updateQuestionStatus(
              result.draggableId,
              updatePayload
            );
            break;
        }

        toast.success("Status updated successfully!");
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data.message);
        setTasksByStatus(originalTasksByStatus);
      }
    }
  };

  const renderTaskColumn = (status, title, color) => (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: color,
          }}
          className="space-y-4 min-w-[300px] rounded-2xl p-[2%] shadow-md flex-1 flex-grow"
        >
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {tasksByStatus[status]?.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
                  style={{
                    userSelect: "none",
                    ...provided.draggableProps.style,
                  }}
                >
                  {/* Task Header with Title */}
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-lg">{task.label}</p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "HIGH"
                          ? "bg-red-500 text-white"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Dates */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <p>
                      Start: {new Date(task.startDate).toLocaleDateString()}
                    </p>
                    <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>

                  {/* Assignee Info */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        src={task.assignee.profile.avatarUrl}
                        icon={<UserOutlined />}
                      />
                      <p className="text-sm font-medium">
                        {task.assignee.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.reporter?.username && (
                        <p className="text-sm text-gray-500">
                          Reporter: {task.reporter.username}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  const items = [
    ...topics.map((topic) => ({
      key: topic.id,
      label: (
        <div className="flex justify-between items-center gap-[10%]">
          <p
            style={{
              color:
                topic.type === "ISSUE"
                  ? "red"
                  : topic.type === "TASK"
                  ? "#1b97ff"
                  : "orange",
            }}
          >
            {topic.labels}
          </p>
        </div>
      ),
      children: (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "5%",
                alignItems: "flex-start",
              }}
            >
              {topic.type === "ISSUE" ? (
                <>
                  {renderTaskColumn("OPEN", "Open", "#fee2e2")}
                  {renderTaskColumn("RE_OPENED", "Re Opened", "#fee2e2")}
                  {renderTaskColumn("NOT_BUG", "Rejected", "#d1fae5")}
                  {renderTaskColumn("FIXED", "Fixed", "#fef3c7")}
                  {renderTaskColumn(
                    "PENDING_RETEST",
                    "Waiting Retest",
                    "#e0e7ff"
                  )}{" "}
                  {renderTaskColumn("RETEST", "Retest", "#e0e7ff")}
                  {renderTaskColumn("VERIFIED", "Verified", "#f5f3ff")}
                  {renderTaskColumn("CLOSED", "Closed", "#d1fae5")}
                </>
              ) : (
                <>
                  {" "}
                  {renderTaskColumn("PENDING", "New", "#ddeafe")}
                  {renderTaskColumn("TODO", "To Do", "#ddeafe")}
                  {renderTaskColumn("INPROGRESS", "In Progress", "#fef3c7")}
                  {renderTaskColumn("DONE", "Done", "#d1fae5")}
                </>
              )}
            </div>
          </DragDropContext>
        </>
      ),
    })),
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto"
    >
      <h1 className="text-2xl font-bold">Task Status Management Board</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          defaultActiveKey={defaultTabKey}
          activeKey={activeTabKey}
          onChange={(key) => {
            const selected = topics.find((topic) => topic.id === key);
            setActiveTabKey(key);
            setActiveTopicType(selected?.type); // capture type of topic
          }}
          items={items}
          size="large"
          className="w-[100%]"
        />
      )}
    </motion.div>
  );
}
