import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import taskService from "../../services/taskService";

export default function BoardPage() {
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const { id } = useParams();

  const fetchTasks = async () => {
    try {
      const params = {
        projectId: id,
        topicId: "debb8c3b-f9bf-4351-9c24-b00febac3fc1",
      };
      const response = await taskService.getTasks(params);
      const tasks = response.data;
      console.log("task", tasks);
      setToDoTasks(tasks.filter((task) => task.priority === "LOW"));
      setInProgressTasks(tasks.filter((task) => task.priority === "MEDIUM"));
      setDoneTasks(tasks.filter((task) => task.priority === "HIGH"));
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

    if (sourceDroppableId === destinationDroppableId) {
      const tasks = getTasksByDroppableId(sourceDroppableId);
      const reorderedTasks = Array.from(tasks);
      const [removed] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, removed);

      setTasksByDroppableId(sourceDroppableId, reorderedTasks);
    } else {
      const sourceTasks = getTasksByDroppableId(sourceDroppableId);
      const destinationTasks = getTasksByDroppableId(destinationDroppableId);
      const [removed] = sourceTasks.splice(result.source.index, 1);
      destinationTasks.splice(result.destination.index, 0, removed);

      setTasksByDroppableId(sourceDroppableId, sourceTasks);
      setTasksByDroppableId(destinationDroppableId, destinationTasks);
    }
  };

  const getTasksByDroppableId = (droppableId) => {
    switch (droppableId) {
      case "toDoTasks":
        return toDoTasks;
      case "inProgressTasks":
        return inProgressTasks;
      case "doneTasks":
        return doneTasks;
      default:
        return [];
    }
  };

  const setTasksByDroppableId = (droppableId, tasks) => {
    switch (droppableId) {
      case "toDoTasks":
        setToDoTasks(tasks);
        break;
      case "inProgressTasks":
        setInProgressTasks(tasks);
        break;
      case "doneTasks":
        setDoneTasks(tasks);
        break;
      default:
        break;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          gap: "5%",
          alignItems: "flex-start", // Ensure boards align at the top
        }}
      >
        <Droppable droppableId="toDoTasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: "#ddeafe",
                padding: "20px",
                width: "300px",
                borderRadius: "8px",
                flexGrow: 1, // Allow the board to grow based on its content
              }}
            >
              <h2 className="text-xl font-bold mb-[5%]">To Do</h2>
              {toDoTasks.map((task, index) => (
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

        <Droppable droppableId="inProgressTasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: "#ddeafe",
                padding: "20px",
                width: "300px",
                borderRadius: "8px",
                flexGrow: 1, // Allow the board to grow based on its content
              }}
            >
              <h2 className="text-xl font-bold mb-[5%]">In Progress</h2>
              {inProgressTasks.map((task, index) => (
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

        <Droppable droppableId="doneTasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: "#ddeafe",
                padding: "20px",
                width: "300px",
                borderRadius: "8px",
                flexGrow: 1, // Allow the board to grow based on its content
              }}
            >
              <h2 className="text-xl font-bold mb-[5%]">Done</h2>
              {doneTasks.map((task, index) => (
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
      </div>
    </DragDropContext>
  );
}
