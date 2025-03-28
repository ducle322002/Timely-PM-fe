import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import taskService from "../../services/taskService";
import { Tabs } from "antd";
import projectService from "../../services/projectService";
import toast from "react-hot-toast";

export default function BoardPage() {
  const [tasksByStatus, setTasksByStatus] = useState({
    PENDING: [],
    TODO: [],
    INPROGRESS: [],
    DONE: [],
  });

  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const [topics, setTopics] = useState([]);
  const [defaultTabKey, setDefaultTabKey] = useState("");
  const [activeTabKey, setActiveTabKey] = useState(null);

  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      setProjectDetail(response.data);
      const sortedTopics = response.data.topics.sort((a, b) =>
        b.type.localeCompare(a.type)
      );
      setTopics(sortedTopics);
      if (sortedTopics.length > 0) {
        setDefaultTabKey(sortedTopics[0].id);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await taskService.getTasks(params);
      const tasks = response.data;

      // Group tasks by status
      const groupedTasks = {
        PENDING: tasks.filter((task) => task.status === "PENDING"),
        TODO: tasks.filter((task) => task.status === "TODO"),
        INPROGRESS: tasks.filter((task) => task.status === "INPROGRESS"),
        DONE: tasks.filter((task) => task.status === "DONE"),
      };

      setTasksByStatus(groupedTasks);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
    fetchTasks();
  }, [id, activeTabKey]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;

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
        const response = await taskService.updateTaskStatus(
          result.draggableId,
          {
            projectId: id,
            topicId: activeTabKey,
            status: destinationStatus,
          }
        );
        console.log(response.data);
        toast.success("Task status updated successfully!");
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data.message);
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
            padding: "20px",
            width: "300px",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <h2 className="text-xl font-bold mb-[5%]">{title}</h2>
          {tasksByStatus[status].map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    userSelect: "none",
                    padding: 16,
                    margin: "0 0 8px 0",
                    backgroundColor: "#fff",
                    color: "#333",
                    ...provided.draggableProps.style,
                  }}
                >
                  {task.label}
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: "flex",
              gap: "5%",
              alignItems: "flex-start",
            }}
          >
            {renderTaskColumn("PENDING", "Pending", "#ddeafe")}
            {renderTaskColumn("TODO", "To Do", "#ddeafe")}
            {renderTaskColumn("INPROGRESS", "In Progress", "#fef3c7")}
            {renderTaskColumn("DONE", "Done", "#d1fae5")}
          </div>
        </DragDropContext>
      ),
    })),
  ];

  return (
    <Tabs
      defaultActiveKey={defaultTabKey}
      activeKey={activeTabKey}
      onChange={setActiveTabKey}
      items={items}
      size="large"
      className="w-[100%]"
    />
  );
}
