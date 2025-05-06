import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  InboxOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
  DatePicker,
  Spin,
  Table,
  Collapse,
  Dropdown,
  Menu,
  Popconfirm,
} from "antd";
const { RangePicker } = DatePicker;
import React, { Children, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import toast from "react-hot-toast";
import projectService from "../../services/projectService";
import moment from "moment/moment";
import topicService from "../../services/topicService";
import dayjs from "dayjs";
import taskService from "../../services/taskService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { m, motion } from "framer-motion";
import "./ProjectDetailPage.scss";
import issueService from "../../services/issueService";
import questionService from "../../services/questionService";
import TabPane from "antd/es/tabs/TabPane";
import Cookies from "js-cookie";
import { IoSettingsOutline } from "react-icons/io5";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const [topics, setTopics] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [defaultTabKey, setDefaultTabKey] = useState("");
  const [isCreateTaskModal, setIsCreateTaskModal] = useState(false);
  const [isCreateQuestionModal, setIsCreateQuestionModal] = useState(false);
  const [isCreateIssueModal, setIsCreateIssueModal] = useState(false);

  const [isInviteMemberModal, setIsInviteMemberModal] = useState(false);
  const [isRemoveMemberModal, setIsRemoveMemberModal] = useState(false);
  const [isCreateTopicModal, setIsCreateTopicModal] = useState(false);
  const [isProjectMemberModal, setIsProjectMemberModal] = useState(false);
  const [isUpdateTopicModal, setIsUpdateTopicModal] = useState(false);
  const [isModalUpdateTask, setIsModalUpdateTask] = useState(false);
  const [isModalDeleteTask, setIsModalDeleteTask] = useState(false);
  const [isCreateIssueInTaskModal, setIsCreateIssueInTaskModal] =
    useState(false);

  const [loadingCreateTask, setLoadingCreateTask] = useState(false);
  const [loadingCreateIssue, setLoadingCreateIssue] = useState(false);
  const [loadingCreateQuestion, setLoadingCreateQuestion] = useState(false);
  const [loadingCreateTopic, setLoadingCreateTopic] = useState(false);

  const [loadingCreateIssueInTask, setLoadingCreateIssueInTask] =
    useState(false);
  const [formInviteMember] = Form.useForm();
  const [formCreateTopic] = Form.useForm();
  const [formCreateTask] = Form.useForm();
  const [formCreateIssue] = Form.useForm();
  const [formCreateQuestion] = Form.useForm();
  const [formUpdateTopic] = Form.useForm();
  const [formCreateIssueInTask] = Form.useForm();
  const [formUpdateTask] = Form.useForm();
  const [formUpdateStatusMember] = Form.useForm();

  const [selectedTopic, setSelectedTopic] = useState({});
  const [members, setMembers] = useState([]);
  const [memberRequest, setMemberRequest] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [taskDetail, setTaskDetail] = useState(null);

  const [issueInTask, setIssueInTask] = useState([]);

  const [issues, setIssues] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  const [loadingTasks, setLoadingTasks] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [comments, setComments] = useState([]);
  const user = useSelector(selectUser);
  const ws = useRef(null);
  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    const token = Cookies.get("token")?.replaceAll('"', "");
    if (ws.current && newComment.trim()) {
      const commentData = {
        questionId: taskDetail.id,
        token: token,
        content: newComment,
      };
      ws.current.send(JSON.stringify(commentData));

      setNewComment(""); // Clear the input field
    }
  };

  useEffect(() => {
    if (ws.current && taskDetail) {
      const token = Cookies.get("token")?.replaceAll('"', "");
      const commentData = {
        questionId: taskDetail.id,
        token: token,
        action: "getComments",
      };

      // Request comments for the selected task
      ws.current.send(JSON.stringify(commentData));
    }
  }, [taskDetail]);

  useEffect(() => {
    // Connect to WebSocket server

    ws.current = new WebSocket(`wss://api.timelypm.online/comment`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      ws.current.send("Hello from React!");
    };

    ws.current.onmessage = (event) => {
      const newComment = JSON.parse(event.data);

      // Check if the received data is a single comment or an array
      if (Array.isArray(newComment)) {
        // If it's an array, replace the entire comments list
        setComments(
          newComment.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      } else {
        // If it's a single comment, append it to the existing list
        setComments((prev) => [...prev, newComment]);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup on unmount
    return () => {
      ws.current.close();
    };
  }, []);

  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      console.log(response.data);
      setProjectDetail(response.data);
      const sortedTopics = response.data.topics.sort((a, b) =>
        b.type.localeCompare(a.type)
      );

      setTopics(sortedTopics);

      // Set the default tab key after topics are sorted
      if (sortedTopics.length > 0) {
        setDefaultTabKey(sortedTopics[0].id); // Default to the first topic's ID
        setActiveTabKey(sortedTopics[0].id); // Set active tab to the first topic
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchMemberProject = async () => {
    try {
      const response = await projectService.getMembers(id);
      console.log("members", response.data);
      setMembers(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchMemberRequestProject = async () => {
    try {
      const response = await projectService.getMemberRequest(id);
      console.log("Member Request", response.data);
      setMemberRequest(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };
  const fetchTasks = async () => {
    setLoadingTasks(true); // Set loading state to true

    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await taskService.getTasks(params);
      const sortResponse = response.data.sort((a, b) => {
        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      console.log("task", response.data);
      setTasks(sortResponse);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingTasks(false); // Set loading state to false
    }
  };

  const fetchTaskDetail = async (task) => {
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await taskService.getTasksDetail(task.id, params);

      console.log("Task Detail", response.data);
      setTaskDetail(response.data);
      setIssueInTask(response.data.issues);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const fetchIssueDetail = async (issue) => {
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await issueService.getIssueDetail(issue.id, params);

      console.log("Issue Detail", response.data);
      setTaskDetail(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const fetchQuestionDetail = async (question) => {
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await questionService.getQuestionDetail(
        question.id,
        params
      );

      console.log("Question Detail", response.data);
      setTaskDetail(response.data);
      setIssueInTask(null);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const fetchIssue = async () => {
    setLoadingTasks(true); // Set loading state to true

    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await issueService.getIssues(params);
      const sortResponse = response.data.sort((a, b) => {
        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      console.log("issue", response.data);
      setIssues(sortResponse);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingTasks(false); // Set loading state to false
    }
  };

  const fetchQuestion = async () => {
    setLoadingTasks(true); // Set loading state to true

    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await questionService.getQuestions(params);
      const sortResponse = response.data.sort((a, b) => {
        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      console.log("question", response.data);
      setQuestions(sortResponse);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingTasks(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchMemberRequestProject();
    fetchMemberProject();
    fetchProjectDetail();
  }, [id]);

  useEffect(() => {
    if (activeTabKey) {
      fetchIssue();
      fetchQuestion();
      fetchTasks();
    }
  }, [activeTabKey]);

  const showCreateTaskModal = (topic) => {
    setIsCreateTaskModal(true);
    setSelectedTopic(topic);
    setActiveTabKey(topic.id);
  };

  const showCreateIssueModal = (topic) => {
    setIsCreateIssueModal(true);
    setSelectedTopic(topic);
    setActiveTabKey(topic.id);
  };

  const showCreateQuestionModal = (topic) => {
    setIsCreateQuestionModal(true);
    setSelectedTopic(topic);
    setActiveTabKey(topic.id);
  };

  const showInviteMemberModal = () => {
    setIsInviteMemberModal(true);
  };

  // const showRemoveMemberModal = (member) => {
  //   setIsRemoveMemberModal(true);
  //   setSelectedMember(member);
  // };

  const showCreateTopicModal = () => {
    setIsCreateTopicModal(true);
  };

  const showMemberProjectModal = () => {
    setIsProjectMemberModal(true);
  };

  const showCreateIssueInTaskModal = (task) => {
    setIsCreateIssueInTaskModal(true);
    setSelectedTask(task);
  };

  const showUpdateTopicModal = (topic) => {
    setIsUpdateTopicModal(true);
    setSelectedTopic(topic);
    console.log(topic);
    formUpdateTopic.setFieldsValue({
      labels: topic.labels,
      type: topic.type,
      description: topic.description,
      dateRange: [dayjs(topic.startDate), dayjs(topic.dueDate)],
    });
  };

  const [fileList, setFileList] = useState([]);

  const handleInviteMember = async (values) => {
    console.log(values);
    const params = {
      id: id,
      email: values.email,
      role: values.role,
    };
    try {
      const response = await projectService.inviteMember(id, params);
      console.log(response);
      toast.success("Invite member successfully!");
      setIsInviteMemberModal(false);
      formInviteMember.resetFields();
      fetchMemberProject();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const handleCreateTopic = async (values) => {
    setLoadingCreateTopic(true); // Set loading state to true
    const requestData = {
      projectId: id,
      type: values.type,
      description: values.description,
      labels: values.labels,
      startDate: dayjs(values.dateRange[0]).toISOString(),
      dueDate: dayjs(values.dateRange[1]).toISOString(),
    };
    console.log(requestData);
    try {
      const response = await topicService.createTopic(requestData);
      console.log(response);
      toast.success("Topic created successfully!");
      fetchProjectDetail();
      setIsCreateTopicModal(false);
      formCreateTopic.resetFields();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingCreateTopic(false); // Set loading state to false
    }
  };

  const handleCreateTask = async (values) => {
    setLoadingCreateTask(true);
    const params = {
      projectId: id,
      topicId: selectedTopic.id,
    };

    const formData = new FormData();
    formData.append("assigneeTo", values.assigneeTo);
    formData.append("reporter", values.reporter);
    formData.append("summer", values.summer);
    formData.append("description", values.description);
    formData.append(
      "startDate",
      dayjs(values.dateRange[0]).format("YYYY-MM-DD")
    ); // Format to 'yyyy-MM-dd'
    formData.append("dueDate", dayjs(values.dateRange[1]).format("YYYY-MM-DD"));
    formData.append("priority", values.priority);

    // Append the file if it exists
    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    } else {
      toast.error("Please upload a file!");
      setLoadingCreateTask(false); // Set loading state to false
      return;
    }
    console.log(formData);
    try {
      const response = await taskService.createTask(formData, params);
      console.log(response);
      toast.success("Task created successfully!");
      fetchTasks();
      setFileList([]);
      setIsCreateTaskModal(false);
      formCreateTask.resetFields();
    } catch (error) {
      console.log(error);
      toast.error("Error Creating Task");
    } finally {
      setLoadingCreateTask(false); // Set loading state to false
    }
  };

  const handleCreateIssue = async (values) => {
    setLoadingCreateIssue(true); // Set loading state to true
    const params = {
      projectId: id,
      topicId: selectedTopic.id,
    };
    console.log(values);
    const formDataIssue = new FormData();
    formDataIssue.append("assigneeTo", values.assigneeTo);
    formDataIssue.append("reporter", values.reporter);
    formDataIssue.append("summer", values.summer);
    formDataIssue.append("description", values.description);
    formDataIssue.append(
      "startDate",
      dayjs(values.dateRange[0]).format("YYYY-MM-DD")
    ); // Format to 'yyyy-MM-dd'
    formDataIssue.append(
      "dueDate",
      dayjs(values.dateRange[1]).format("YYYY-MM-DD")
    );
    formDataIssue.append("priority", values.priority);
    formDataIssue.append("severity", values.severity);
    // Append the file if it exists
    if (fileList.length > 0) {
      formDataIssue.append("file", fileList[0].originFileObj);
    } else {
      toast.error("Please upload a file!");
      setLoadingCreateTask(false); // Set loading state to false
      return;
    }
    console.log(formDataIssue);
    try {
      const response = await issueService.createIssue(formDataIssue, params);
      console.log(response);
      toast.success("Issue created successfully!");
      fetchIssue();
      setIsCreateIssueModal(false);
      formCreateIssue.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingCreateIssue(false); // Set loading state to false
    }
  };
  const handleCreateQuestion = async (values) => {
    setLoadingCreateQuestion(true); // Set loading state to true
    const params = {
      projectId: id,
      topicId: selectedTopic.id,
    };
    const requestData = {
      assigneeTo: values.assigneeTo,
      label: values.label,
      summer: values.summer,
      description: values.description,
      startDate: dayjs(values.dateRange[0]).toISOString(),
      dueDate: dayjs(values.dateRange[1]).toISOString(),
      priority: values.priority,
      attachment: "string",
    };
    console.log(requestData);
    try {
      const response = await questionService.createQuestion(
        requestData,
        params
      );
      console.log(response);
      toast.success("Question created successfully!");
      fetchQuestion();
      setIsCreateQuestionModal(false);
      formCreateQuestion.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingCreateQuestion(false); // Set loading state to false
    }
  };

  const handleUpdateTopic = async (values) => {
    const params = {
      projectId: id,
    };
    const requestData = {
      type: values.type,
      description: values.description,
      labels: values.labels,
      startDate: dayjs(values.dateRange[0]).toISOString(),
      dueDate: dayjs(values.dateRange[1]).toISOString(),
    };
    console.log(requestData);
    try {
      const response = await topicService.updateTopic(
        selectedTopic.id,
        requestData,
        params
      );
      console.log(response);
      toast.success("Topic Updated successfully!");
      fetchProjectDetail();
      setIsUpdateTopicModal(false);
      formUpdateTopic.resetFields();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  //tạo issue trong task
  const handleCreateIssueInTask = async (values) => {
    setLoadingCreateIssueInTask(true); // Set loading state to true
    const params = {
      projectId: id,
      topicId: activeTabKey,
    };

    const formDataIssue = new FormData();
    formDataIssue.append("label", values.label);
    formDataIssue.append("assigneeTo", values.assigneeTo);
    formDataIssue.append("reporter", values.reporter);
    formDataIssue.append("summer", values.summer);
    formDataIssue.append("description", values.description);
    formDataIssue.append(
      "startDate",
      dayjs(values.dateRange[0]).format("YYYY-MM-DD")
    );
    formDataIssue.append(
      "dueDate",
      dayjs(values.dateRange[1]).format("YYYY-MM-DD")
    );
    formDataIssue.append("priority", values.priority);
    formDataIssue.append("severity", values.severity);
    if (fileList.length > 0) {
      formDataIssue.append("file", fileList[0].originFileObj);
    } else {
      toast.error("Please upload a file!");
      setLoadingCreateTask(false); // Set loading state to false
      return;
    }

    console.log(formDataIssue);
    try {
      const response = await taskService.createIssueInTask(
        taskDetail.id,
        formDataIssue,
        params
      );
      console.log(response);
      toast.success("Issue created successfully!");
      fetchTasks();
      fetchTaskDetail(taskDetail);
      setFileList([]);
      setIsCreateIssueInTaskModal(false);
      formCreateIssueInTask.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingCreateIssueInTask(false); // Set loading state to false
    }
  };

  const handleUpdateIssueInTaskStatus = async (issue, status) => {
    const params = {
      projectId: id,
      topicId: activeTabKey,
      status: status,
    };
    try {
      const response = await issueService.updateIssueStataus(issue.id, params);
      console.log(response);
      toast.success("Issue updated successfully!");
      fetchTasks();
      fetchTaskDetail(taskDetail);
    } catch (error) {
      toast.error(error.response.data.message || "Error updating issue status");
      console.log(error.response.data);
    }
  };

  const taskColumns = [
    {
      title: "",
      dataIndex: "label",
      key: "label",
      width: 300,
      render: (text, task) => (
        <div>
          <p
            className={`font-bold ${
              task.priority === "HIGH"
                ? "text-red-500"
                : task.priority === "MEDIUM"
                ? "text-yellow-500"
                : "text-green-500"
            } 
              text-xl`}
          >
            {task?.label}
          </p>
          <p>{task?.priority}</p>
          <div className="">
            <p>
              {moment(task?.startDate).format("DD/MM/YYYY")} -{" "}
              {moment(task?.dueDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "user.username",
      key: "assignee",
      align: "center",
      render: (text, task) => (
        <div className=" flex justify-center items-center gap-[10%]">
          <p className="">{task.assignee.username}</p>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={task.assignee.profile.avatarUrl}
          />
        </div>
      ),
    },
    {
      title: "Reporter",
      dataIndex: "reporter.username",
      key: "reporter",
      align: "center",
      render: (text, task) => (
        <div className=" flex justify-center items-center gap-[10%]">
          <p className="">{task.reporter.username}</p>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={task.reporter.profile.avatarUrl}
          />
        </div>
      ),
    },
  ];

  const questionColumns = [
    {
      title: "",
      dataIndex: "label",
      key: "label",
      width: 300,
      render: (text, task) => (
        <div>
          <p
            className={`font-bold ${
              task.priority === "HIGH"
                ? "text-red-500"
                : task.priority === "MEDIUM"
                ? "text-yellow-500"
                : "text-green-500"
            } 
              text-xl`}
          >
            {task?.label}
          </p>
          <p>{task?.priority}</p>
          <div className="">
            <p>
              {moment(task?.startDate).format("DD/MM/YYYY")} -{" "}
              {moment(task?.dueDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "user.username",
      key: "assignee",
      align: "center",
      render: (text, task) => (
        <div className=" flex justify-center items-center gap-[10%]">
          <p className="">{task.assignee.username}</p>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={task.assignee.profile.avatarUrl}
          />
        </div>
      ),
    },
    {
      title: "Created By",
      align: "center",
      render: (text, task) => (
        <div className=" flex justify-center items-center gap-[10%]">
          <p className="">{task.createBy.username}</p>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={task.createBy.profile.avatarUrl}
          />
        </div>
      ),
    },
  ];

  const itemsCollapseIssueInTask = issueInTask?.map((issue) => ({
    key: issue.id,
    label: (
      <div className="flex justify-between items-center">
        <p
          className={`font-bold ${
            issue.priority === "HIGH"
              ? "text-red-500"
              : issue.priority === "MEDIUM"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {issue.label}
        </p>
        <span
          className={`px-2 py-1 text-xs rounded-full text-white ${
            issue.severity === "MINOR"
              ? "bg-red-700"
              : issue.severity === "MAJOR"
              ? "bg-red-500"
              : issue.severity === "CRITICAL"
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
        >
          {issue.severity}
        </span>
      </div>
    ),
    children: (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-gray-700">{issue.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <p
              className={`font-bold ${
                issue.priority === "HIGH"
                  ? "text-red-500"
                  : issue.priority === "MEDIUM"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {issue.priority}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-bold text-gray-700">{issue.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="text-gray-700">
              {moment(issue.startDate).format("DD/MM/YYYY")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="text-gray-700">
              {moment(issue.dueDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <p className="text-sm text-gray-500">Reporter</p>
            <div className="flex items-center gap-2">
              <Avatar icon={<UserOutlined />} />
              <span className="text-gray-700">
                {issue.reporter?.username || "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Assignee</p>
            <div className="flex items-center gap-2">
              <Avatar icon={<UserOutlined />} />
              <span className="text-gray-700">
                {issue.assignee?.username || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {issue.status !== "CLOSED" && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Update status</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="mt-2">
                {taskDetail.assignee?.id === user.id &&
                  issue.status === "OPEN" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "NOT_BUG")
                        }
                      >
                        Rejected
                      </Button>

                      <Button
                        color=""
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "FIXED")
                        }
                      >
                        Fixed
                      </Button>
                    </div>
                  )}

                {taskDetail.assignee?.id === user.id &&
                  issue.status === "FIXED" && (
                    <Button
                      color=""
                      onClick={() =>
                        handleUpdateIssueInTaskStatus(issue, "PENDING_RETEST")
                      }
                    >
                      Waiting Retest
                    </Button>
                  )}

                {taskDetail.reporter?.id === user.id &&
                  issue.status === "PENDING_RETEST" && (
                    <>
                      <Button
                        color=""
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "RETEST")
                        }
                      >
                        Retest
                      </Button>
                    </>
                  )}

                {taskDetail.reporter?.id === user.id &&
                  issue.status === "RETEST" && (
                    <div className="flex gap-2">
                      <Button
                        color=""
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "VERIFIED")
                        }
                      >
                        Verified
                      </Button>

                      <Button
                        color=""
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "RE_OPENED")
                        }
                      >
                        Re Opened
                      </Button>
                    </div>
                  )}

                {taskDetail.reporter?.id === user.id &&
                  issue.status === "VERIFIED" && (
                    <>
                      <Button
                        color=""
                        onClick={() =>
                          handleUpdateIssueInTaskStatus(issue, "CLOSED")
                        }
                      >
                        Closed
                      </Button>
                    </>
                  )}
              </div>

              <div className="mt-2"></div>
            </div>
          </div>
        )}
      </div>
    ),
    style: {
      border: "none",
    },
  }));

  const items = [
    ...topics.map((topic) => {
      return {
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
            {projectDetail.userId === user.id && (
              <SettingOutlined onClick={() => showUpdateTopicModal(topic)} />
            )}
          </div>
        ),
        children: (
          <>
            {projectDetail.userId === user.id && (
              <div className="flex justify-end items-center mb-[1%]">
                {topic.type === "TASK" ? (
                  <>
                    <Button
                      icon={<FaPlus />}
                      className={`  !py-[3%] ${
                        projectDetail.status === "DONE"
                          ? "bg-gray-500"
                          : "!bg-[#1968db] !text-white"
                      } `}
                      onClick={() => showCreateTaskModal(topic)}
                      disabled={projectDetail.status === "DONE"}
                    >
                      New Task
                    </Button>
                  </>
                ) : topic.type === "ISSUE" ? (
                  <></>
                ) : (
                  <></>
                )}
              </div>
            )}

            {topic.type === "ISSUE" &&
              (projectDetail.userId === user.id ||
                members
                  .filter((member) => member.role === "QA")
                  .some((member) => member.fullName === user.fullName)) && (
                <div className="flex justify-end items-center mb-[1%]">
                  <Button
                    icon={<FaPlus />}
                    className={`  !py-[3%] ${
                      projectDetail.status === "DONE"
                        ? "bg-gray-500"
                        : "!bg-red-500 !text-white"
                    } `}
                    onClick={() => showCreateIssueModal(topic)}
                    disabled={projectDetail.status === "DONE"}
                  >
                    New Issue
                  </Button>
                </div>
              )}
            {topic.type === "QUESTION" && (
              <div className="flex justify-end items-center mb-[1%]">
                <Button
                  icon={<FaPlus />}
                  className={`!py-[3%] ${
                    projectDetail.status === "DONE"
                      ? "bg-gray-500"
                      : "!bg-orange-500 !text-white"
                  } `}
                  onClick={() => showCreateQuestionModal(topic)}
                  disabled={projectDetail.status === "DONE"}
                >
                  New Question
                </Button>
              </div>
            )}

            {loadingTasks ? (
              <div className="flex justify-center items-center">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <Table
                  className="table-task"
                  rowClassName="cursor-pointer hover:bg-gray-100"
                  dataSource={
                    topic.type === "TASK"
                      ? tasks
                      : topic.type === "ISSUE"
                      ? issues
                      : questions
                  }
                  questionColumns
                  taskColumns
                  columns={
                    topic.type === "QUESTION" ? questionColumns : taskColumns
                  }
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    hideOnSinglePage: true,
                    position: ["bottomCenter"],
                  }}
                  bordered={false}
                  rowHoverable={false}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedTask(record);
                      topic.type === "TASK"
                        ? fetchTaskDetail(record)
                        : topic.type === "ISSUE"
                        ? fetchIssueDetail(record)
                        : fetchQuestionDetail(record);
                    },
                  })}
                />
              </>
            )}
          </>
        ),
      };
    }),
  ];

  const dateLeft = (dueDate) => {
    const currentDate = new Date();
    const dueDateConvert = new Date(dueDate);
    const diffTime = dueDateConvert - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = dueDateConvert - now;
        if (timeLeft <= 0) {
          clearInterval(interval);
          setCountdown("Task is overdue");
        } else {
          const hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setCountdown(`${hours}: ${minutes}: ${seconds}`);
        }
      }, 1000);

      return 0;
    }

    return diffDays;
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
    toast.success(info.fileList[0].name + " uploaded successfully!");
    console.log(info);
  };

  const getMenu = (task) => {
    return (
      <Menu>
        {task.assignee && task.reporter && !task.severity && (
          <Menu.Item
            key="update"
            onClick={() => handleShowModalUpdateTask(task)}
            icon={<EditOutlined />}
          >
            Update
          </Menu.Item>
        )}

        <Menu.Item
          key="delete"
          onClick={() => handleShowModalDeleteTask(task)}
          icon={<DeleteOutlined />}
        >
          Delete
        </Menu.Item>
      </Menu>
    );
  };

  const handleShowModalUpdateTask = (task) => {
    setSelectedTask(task);
    setIsModalUpdateTask(true);
    formUpdateTask.setFieldsValue({
      summer: task.summer,
      description: task.description,
      dateRange: [dayjs(task.startDate), dayjs(task.dueDate)],

      priority: task.priority,
      severity: task.severity ? task.severity : "MINOR",
    });
  };

  const handleShowModalDeleteTask = (task) => {
    setSelectedTask(task);
    setIsModalDeleteTask(true);
  };

  const handleDeleteTask = async (task) => {
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await taskService.deleteTask(task.id, params);
      console.log(response);
      toast.success("Task deleted successfully!");
      fetchTasks();
      setTaskDetail(null);
      setSelectedTask(null);
      setIsModalDeleteTask(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const handleUpdateTask = async (values) => {
    console.log(values);
    const formDataUpdate = new FormData();
    formDataUpdate.append("summer", values.summer);
    formDataUpdate.append("description", values.description);
    formDataUpdate.append(
      "startDate",
      dayjs(values.dateRange[0]).format("YYYY-MM-DD")
    );
    formDataUpdate.append(
      "dueDate",
      dayjs(values.dateRange[1]).format("YYYY-MM-DD")
    );
    formDataUpdate.append("priority", values.priority);
    console.log(formDataUpdate);
    try {
      const params = {
        projectId: id,
        topicId: activeTabKey,
      };
      const response = await taskService.updateTask(
        selectedTask.id,
        formDataUpdate,
        params
      );
      console.log(response);
      toast.success("Task Updated successfully!");
      fetchTasks();
      setTaskDetail(null);
      setSelectedTask(null);
      setIsModalUpdateTask(false);
      formUpdateTask.resetFields();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const handleRemoveMember = async (member) => {
    console.log(member);
    try {
      const params = {
        projectMemberId: member,
      };
      const response = await projectService.removeMember(id, params);
      console.log(response);
      toast.success("Member removed successfully!");
      fetchMemberProject();
      setIsRemoveMemberModal(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  const handleStatusMember = async (values, member, status) => {
    const params = {
      memberId: member.id,
      role: values?.role ? values?.role : "",
      status: status,
    };
    try {
      if (status === "APPROVED") {
        const response = await projectService.statusMember(id, params);
        toast.success(" Approved Member successfully!");
        console.log(response);
      } else if (status === "REJECTED") {
        const response = await projectService.statusMember(id, params);
        toast.success("Rejected Member successfully!");
        console.log(response);
      }
      fetchMemberProject();
      fetchMemberRequestProject();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data);
    }
  };

  return (
    <div className="container mx-auto">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center"
      >
        <div className="flex justify-between items-center gap-[5%]">
          <h1 className="text-2xl font-bold text-nowrap">
            {projectDetail.name}
          </h1>
          <Button
            icon={<TeamOutlined />}
            className="!bg-[#1968db] !text-white mr-[5%] !py-[7%]"
            onClick={() => showMemberProjectModal()}
          >
            View Members
          </Button>
        </div>

        {projectDetail.userId === user.id && (
          <div className="flex justify-between items-center">
            <Button
              icon={<FaPlus />}
              className={` mr-[5%] !py-[7%] ${
                projectDetail.status === "DONE"
                  ? "bg-gray-500"
                  : "!bg-[#1968db] !text-white"
              } `}
              onClick={() => showInviteMemberModal()}
              disabled={projectDetail.status === "DONE"}
            >
              Invite Member
            </Button>
            <Button
              icon={<FaPlus />}
              onClick={() => showCreateTopicModal()}
              className="!py-[7%]"
              disabled={projectDetail.status === "DONE"}
            >
              New Module
            </Button>
          </div>
        )}
      </motion.div>
      {items.length === 0 ? (
        <></>
      ) : (
        <>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex"
          >
            <Tabs
              defaultActiveKey={defaultTabKey}
              activeKey={activeTabKey}
              onChange={setActiveTabKey}
              items={items}
              size="large"
              className="w-[50%]"
            />
            <div className="w-[50%] p-4">
              {taskDetail ? (
                <motion.div
                  key={taskDetail.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl shadow-md p-6 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <h2
                      className={`text-xl font-semibold mb-2 ${
                        taskDetail.priority === "HIGH"
                          ? "text-red-500"
                          : taskDetail.priority === "MEDIUM"
                          ? "text-yellow-500"
                          : "text-green-500"
                      } `}
                    >
                      {taskDetail.label}
                    </h2>

                    {projectDetail.userId === user.id && (
                      <Dropdown
                        overlay={getMenu(taskDetail)}
                        trigger={["click"]}
                      >
                        <Button icon={<IoSettingsOutline />} />
                      </Dropdown>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{taskDetail.summer}</p>
                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-1">
                      Description
                    </p>
                    <p className="text-gray-500 whitespace-pre-line">
                      {taskDetail.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <p className="w-25">Assign to: </p>
                    <div className="flex items-center gap-4">
                      <Avatar src={taskDetail?.assignee?.profile?.avatarUrl} />
                      <span className="text-gray-700 font-medium">
                        {taskDetail?.assignee?.username}
                      </span>
                    </div>
                  </div>
                  {taskDetail.reporter && (
                    <div className="flex items-center gap-4 mb-4">
                      <p className="w-25">Reported by: </p>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={taskDetail?.reporter?.profile?.avatarUrl}
                        />
                        <span className="text-gray-700 font-medium">
                          {taskDetail?.reporter?.username}
                        </span>
                      </div>
                    </div>
                  )}
                  {taskDetail.createBy && (
                    <div className="flex items-center gap-4 mb-4">
                      <p className="w-25">Created by: </p>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={taskDetail?.createBy?.profile?.avatarUrl}
                        />
                        <span className="text-gray-700 font-medium">
                          {taskDetail?.createBy?.username}
                        </span>
                      </div>
                    </div>
                  )}
                  {taskDetail.user && (
                    <div className="flex items-center gap-4 mb-4">
                      <p className="w-25">Created by: </p>
                      <div className="flex items-center gap-4">
                        <Avatar src={taskDetail?.user?.profile?.avatarUrl} />
                        <span className="text-gray-700 font-medium">
                          {taskDetail?.user?.username}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p>{moment(taskDetail.startDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p>{moment(taskDetail.dueDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days Left</p>
                      {dateLeft(taskDetail.dueDate) < 1 ? (
                        <p className="text-red-500 font-bold">{countdown}</p>
                      ) : (
                        <p>{dateLeft(taskDetail.dueDate)} days</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex">
                      <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p>
                          <span
                            className={`inline-block px-3 py-1 text-white rounded-full ${
                              taskDetail.priority === "HIGH"
                                ? "bg-red-500"
                                : taskDetail.priority === "MEDIUM"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            {taskDetail.priority}
                          </span>
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Status</p>
                        <p>
                          <span
                            className={`inline-block px-3 py-1 text-black rounded-full ${
                              taskDetail.status === "TODO"
                                ? "bg-[#ddeafe]"
                                : taskDetail.status === "INPROGRESS"
                                ? "bg-[#fef3c7]"
                                : taskDetail.status === "DONE"
                                ? "bg-[#d1fae5]"
                                : "bg-[#ddeafe]"
                            }`}
                          >
                            {taskDetail.status === "PENDING"
                              ? "NEW"
                              : taskDetail.status}
                          </span>
                        </p>
                      </div>

                      {taskDetail.severity && (
                        <div className="ml-4">
                          <p className="text-sm text-gray-500">Severity</p>
                          <p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full ${
                                taskDetail.severity === "MINOR"
                                  ? "bg-green-100"
                                  : taskDetail.severity === "MAJOR"
                                  ? "bg-yellow-100"
                                  : taskDetail.severity === "CRITICAL"
                                  ? "bg-orange-200"
                                  : "bg-red-200"
                              }`}
                            >
                              {taskDetail.severity}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {taskDetail.reporter?.id === user.id && (
                      <div>
                        <p className="text-sm text-gray-500 text-end">
                          Having Issue ?
                        </p>
                        <Button
                          color="danger"
                          variant="solid"
                          onClick={() => showCreateIssueInTaskModal(taskDetail)}
                        >
                          Create Issue
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    {taskDetail.user && taskDetail.reporter && (
                      <>
                        <p className="text-sm text-gray-500 mb-2">
                          Attachments
                        </p>
                        {/* Mock attachment display */}
                        <div className="border rounded p-2 text-sm text-gray-600">
                          {taskDetail.attachment ? (
                            <Link
                              to={taskDetail.attachment.downloadUrl}
                              target="_blank"
                            >
                              <p className="text-blue-500 hover:underline cursor-pointer">
                                {taskDetail.attachment.fileName}
                              </p>
                            </Link>
                          ) : (
                            <>No attachments uploaded.</>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {issueInTask != null && (
                    <div className="mt-4">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Issues
                      </p>
                      {itemsCollapseIssueInTask.length > 0 ? (
                        <Collapse
                          accordion
                          bordered={false}
                          items={itemsCollapseIssueInTask}
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                          )}
                        />
                      ) : (
                        <p className="text-gray-500">
                          No issues found for this task.
                        </p>
                      )}
                    </div>
                  )}
                  {taskDetail.createBy && (
                    <>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold">Comments</h3>
                        <div className="mt-4 space-y-4 overflow-y-auto max-h-[30vh]">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-4 bg-gray-100 rounded-lg flex items-start gap-4 shadow-sm hover:shadow-md transition"
                            >
                              <div className="flex-shrink-0">
                                <Avatar
                                  size="large"
                                  style={{
                                    backgroundColor:
                                      comment.userId === user.id
                                        ? "#1890ff"
                                        : "#f56a00",
                                  }}
                                  src={comment.avatarUrl}
                                >
                                  {comment.fullName?.charAt(0).toUpperCase()}
                                </Avatar>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <p className="font-medium text-gray-800">
                                    {comment.fullName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {moment(comment.createdAt).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </p>
                                </div>
                                <p className="text-gray-700 mt-1">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Input.TextArea
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1"
                          />
                          <Button type="primary" onClick={handleSendComment}>
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  )}{" "}
                </motion.div>
              ) : (
                <div className="text-gray-400 text-center mt-10">
                  Select a task to view detail
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      <Modal
        visible={isInviteMemberModal}
        onCancel={() => setIsInviteMemberModal(false)}
        title="Invite Member"
        footer={
          <>
            <Button type="primary" onClick={() => formInviteMember.submit()}>
              Invite
            </Button>
            <Button onClick={() => setIsInviteMemberModal(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <Form
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          form={formInviteMember}
          onFinish={handleInviteMember}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Member's email"
            rules={[{ required: true, message: "Please enter user's Email" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select Role" }]}
          >
            <Select placeholder="Select Role" size="large">
              <Select.Option value="DEV">Dev</Select.Option>
              <Select.Option value="QA">Qa</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isCreateTaskModal}
        onCancel={() => {
          setIsCreateTaskModal(false);
          setFileList([]);
        }}
        title="Create Task"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => formCreateTask.submit()}
              loading={loadingCreateTask}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setIsCreateTaskModal(false);
                setFileList([]);
                formCreateTask.resetFields(); // Reset the form fields
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Form
          form={formCreateTask}
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          onFinish={handleCreateTask}
          requiredMark={false}
        >
          <Form.Item
            name="summer"
            label="Task Summary"
            rules={[{ required: true, message: "Please Enter Summary" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Task Description"
            rules={[{ required: true, message: "Please Enter Description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="assigneeTo"
            label="Assign to"
            rules={[{ required: true, message: "Please Select Assignee" }]}
          >
            <Select placeholder="Select Team member" size="large">
              {members
                .filter((member) => member.role === "DEV")
                .map((member) => (
                  <Select.Option value={member.id}>
                    <div className="!flex !justify-start !items-center !gap-[5%]">
                      <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                      <span>{member.fullName}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reporter"
            label="Reporter"
            rules={[{ required: true, message: "Please Select Reporter" }]}
          >
            <Select placeholder="Select Reporter" size="large">
              {members
                .filter((member) => member.role === "QA")
                .map((member) => (
                  <Select.Option value={member.id}>
                    <div className="!flex !justify-start !items-center !gap-[5%]">
                      <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                      <span>{member.fullName}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="attachment" label="Attachment">
            <Dragger
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please Select Priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="LOW">Low</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isCreateIssueModal}
        onCancel={() => setIsCreateIssueModal(false)}
        title="Create Issue"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => formCreateIssue.submit()}
              loading={loadingCreateIssue}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setIsCreateIssueModal(false);
                setFileList([]);
                formCreateIssue.resetFields();
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Form
          form={formCreateIssue}
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          onFinish={handleCreateIssue}
          requiredMark={false}
        >
          <Form.Item
            name="summer"
            label="Issue Summary"
            rules={[{ required: true, message: "Please Enter Summary" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Issue Description"
            rules={[{ required: true, message: "Please Enter Description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="assigneeTo"
            label="Assign to"
            rules={[{ required: true, message: "Please Select Assignee" }]}
          >
            <Select placeholder="Select Team member" size="large">
              {members
                .filter((member) => member.role === "DEV")
                .map((member) => (
                  <Select.Option value={member.id}>
                    <div className="!flex !justify-start !items-center !gap-[5%]">
                      <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                      <span>{member.fullName}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reporter"
            label="Reporter"
            rules={[{ required: true, message: "Please Select Reporter" }]}
          >
            <Select placeholder="Select Reporter" size="large">
              {members
                .filter((member) => member.role === "QA")
                .map((member) => (
                  <Select.Option value={member.id}>
                    <div className="!flex !justify-start !items-center !gap-[5%]">
                      <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                      <span>{member.fullName}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="attachment" label="Attachment">
            <Dragger
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please Select Priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="LOW">Low</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: "Please Select Severity" }]}
          >
            <Select placeholder="Select severity" size="large">
              <Select.Option value="MINOR">Minor</Select.Option>
              <Select.Option value="MAJOR">Major</Select.Option>
              <Select.Option value="CRITICAL">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isCreateQuestionModal}
        onCancel={() => setIsCreateQuestionModal(false)}
        title="Create Question"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => formCreateQuestion.submit()}
              loading={loadingCreateQuestion}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setIsCreateQuestionModal(false);
                setFileList([]);
                formCreateQuestion.resetFields();
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Form
          form={formCreateQuestion}
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          onFinish={handleCreateQuestion}
          requiredMark={false}
        >
          <Form.Item
            name="Summary"
            label="Question Summary"
            rules={[{ required: true, message: "Please Enter Summary" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Question Description"
            rules={[{ required: true, message: "Please Enter Description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="assigneeTo"
            label="Assign to"
            rules={[{ required: true, message: "Please Select Assignee" }]}
          >
            <Select placeholder="Select Team member" size="large">
              {members.map((member) => (
                <Select.Option value={member.id}>
                  <div className="!flex !justify-start !items-center !gap-[5%]">
                    <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                    <span>{member.fullName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please Select Priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="LOW">Low</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isCreateTopicModal}
        onCancel={() => setIsCreateTopicModal(false)}
        title="Create Module"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => formCreateTopic.submit()}
              loading={loadingCreateTopic}
            >
              Create
            </Button>
            <Button onClick={() => setIsCreateTopicModal(false)}>Cancel</Button>
          </>
        }
      >
        <Form
          layout="vertical"
          form={formCreateTopic}
          onFinish={handleCreateTopic}
          requiredMark={false}
          className="max-h-[50vh] overflow-y-auto"
        >
          <Form.Item
            name="labels"
            label="Labels"
            rules={[
              {
                required: true,
                message: "Please Enter Labels Module",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Module"
            rules={[{ required: true, message: "Please Select Type Module" }]}
          >
            <Select placeholder="Select Module" size="large" allowClear>
              <Select.Option value="TASK">Task</Select.Option>
              <Select.Option value="ISSUE">Issue</Select.Option>
              <Select.Option value="QUESTION">Question</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please Enter Topic Description" },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isUpdateTopicModal}
        onCancel={() => setIsUpdateTopicModal(false)}
        title="Update Module"
        footer={
          <>
            <Button type="primary" onClick={() => formUpdateTopic.submit()}>
              Update
            </Button>
            <Button onClick={() => setIsUpdateTopicModal(false)}>Cancel</Button>
          </>
        }
      >
        <Form
          layout="vertical"
          form={formUpdateTopic}
          onFinish={handleUpdateTopic}
          requiredMark={false}
          className="max-h-[50vh] overflow-y-auto"
        >
          <Form.Item
            name="labels"
            label="Labels"
            rules={[
              {
                required: true,
                message: "Please Enter Labels Module",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please Select Type Module" }]}
          >
            <Select placeholder="Select Type" size="large" allowClear>
              <Select.Option value="TASK">Task</Select.Option>
              <Select.Option value="ISSUE">Issue</Select.Option>
              <Select.Option value="QUESTION">Question</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please Enter Module Description" },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isProjectMemberModal}
        onCancel={() => setIsProjectMemberModal(false)}
        title="Team's Members"
        footer={
          <Button onClick={() => setIsProjectMemberModal(false)}>Close</Button>
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Members" key="1">
            <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 pb-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      icon={<UserOutlined />}
                      src={member.avatarUrl}
                      size="large"
                    />
                    <div>
                      <p className="font-medium text-base text-gray-800">
                        {member.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="block">
                      <strong>Role:</strong> {member.role}
                    </span>
                    <span className="block">
                      <strong>Joined:</strong>{" "}
                      {moment(member.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  {member.role !== "PM" && (
                    <Popconfirm
                      title={`Are you sure to remove ${member.fullName} from the project?`}
                      description="This action cannot be undone."
                      onConfirm={() => handleRemoveMember(member.id)}
                      okText="Yes"
                      okType="danger"
                      cancelText="No"
                    >
                      <Button danger>Remove</Button>
                    </Popconfirm>
                  )}
                </div>
              ))}
            </div>
          </TabPane>
          {projectDetail.userId === user.id && (
            <TabPane tab="Pending Request" key="2">
              <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 pb-2">
                {memberRequest.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        icon={<UserOutlined />}
                        src={member.avatarUrl}
                        size="large"
                      />
                      <div>
                        <p className="font-medium text-base text-gray-800">
                          {member.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <Popconfirm
                      title={`Are you sure to Approve ${member.fullName} to join the project?`}
                      description={
                        <>
                          <p>This action cannot be undone.</p>
                          <Form
                            requiredMark={false}
                            layout="vertical"
                            title="Role"
                            onFinish={(values) =>
                              handleStatusMember(values, member, "APPROVED")
                            }
                            form={formUpdateStatusMember}
                          >
                            <Form.Item name="role" required>
                              <Select placeholder="Select Role" size="large">
                                <Select.Option value="DEV">Dev</Select.Option>
                                <Select.Option value="QA">Qa</Select.Option>
                              </Select>
                            </Form.Item>
                          </Form>
                        </>
                      }
                      onConfirm={() => formUpdateStatusMember.submit()}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary">Approve</Button>
                    </Popconfirm>

                    <Popconfirm
                      title={`Are you sure to Reject ${member.fullName} from the project?`}
                      description="This action cannot be undone."
                      onConfirm={() =>
                        handleStatusMember(null, member, "REJECTED")
                      }
                      okText="Yes"
                      okType="danger"
                      cancelText="No"
                    >
                      <Button color="danger" variant="solid">
                        Rejected
                      </Button>
                    </Popconfirm>
                  </div>
                ))}
              </div>
            </TabPane>
          )}
        </Tabs>
      </Modal>

      <Modal
        visible={isCreateIssueInTaskModal}
        onCancel={() => setIsCreateIssueInTaskModal(false)}
        title={`Create Issue In Task ${taskDetail?.label}`}
        footer={
          <>
            <Button
              loading={loadingCreateIssueInTask}
              type="primary"
              onClick={() => formCreateIssueInTask.submit()}
            >
              Create Issue
            </Button>
            <Button onClick={() => setIsCreateIssueInTaskModal(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <Form
          form={formCreateIssueInTask}
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          onFinish={handleCreateIssueInTask}
          requiredMark={false}
        >
          <Form.Item
            name="label"
            label="Issue Label"
            rules={[{ required: true, message: "Please enter Issue Label" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="summer"
            label="Issue Summary"
            rules={[{ required: true, message: "Please Enter Summary" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Issue Description"
            rules={[{ required: true, message: "Please Enter Description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="assigneeTo"
            label="Assign to"
            rules={[{ required: true, message: "Please Select Assignee" }]}
          >
            <Select placeholder="Select Team member" size="large">
              {members.map((member) => (
                <Select.Option value={member.id}>
                  <div className="!flex !justify-start !items-center !gap-[5%]">
                    <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                    <span>{member.fullName}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reporter"
            label="Reporter"
            rules={[{ required: true, message: "Please Select Reporter" }]}
          >
            <Select placeholder="Select Reporter" size="large">
              {members
                .filter((member) => member.role === "QA")
                .map((member) => (
                  <Select.Option value={member.id}>
                    <div className="!flex !justify-start !items-center !gap-[5%]">
                      <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
                      <span>{member.fullName}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="attachment" label="Attachment">
            <Dragger
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please Select Priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="LOW">Low</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: "Please Select Severity" }]}
          >
            <Select placeholder="Select severity" size="large">
              <Select.Option value="MINOR">Minor</Select.Option>
              <Select.Option value="MAJOR">Major</Select.Option>
              <Select.Option value="CRITICAL">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isModalDeleteTask}
        onCancel={() => setIsModalDeleteTask(false)}
        title={`Delete Task ${taskDetail?.label}`}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => handleDeleteTask(taskDetail)}
              danger
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                setIsModalDeleteTask(false);
                formUpdateTask.resetFields();
                setFileList([]);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <p>Are you sure want to delete this task</p>
      </Modal>

      <Modal
        visible={isModalUpdateTask}
        onCancel={() => setIsModalUpdateTask(false)}
        title={`${taskDetail?.label}`}
        footer={
          <>
            <Button onClick={() => setIsModalUpdateTask(false)}>Cancel</Button>
            <Button type="primary" onClick={() => formUpdateTask.submit()}>
              Update
            </Button>
          </>
        }
      >
        <Form
          form={formUpdateTask}
          layout="vertical"
          requiredMark={false}
          onFinish={handleUpdateTask}
        >
          <Form.Item
            name="summer"
            label="Task Summary"
            rules={[{ required: true, message: "Please Enter Summary" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Task Description"
            rules={[{ required: true, message: "Please Enter Description" }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Select Date Start - End"
            rules={[
              { required: true, message: "Please Select Date Start - End" },
            ]}
          >
            <RangePicker
              format={"DD/MM/YYYY"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              } // Disable past dates
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please Select Priority" }]}
          >
            <Select placeholder="Select Priority" size="large">
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="LOW">Low</Select.Option>
            </Select>
          </Form.Item>

          {taskDetail?.severity && (
            <Form.Item
              name="severity"
              label="Severity"
              rules={[{ required: true, message: "Please Select Severity" }]}
            >
              <Select placeholder="Select severity" size="large">
                <Select.Option value="MINOR">Minor</Select.Option>
                <Select.Option value="MAJOR">Major</Select.Option>
                <Select.Option value="CRITICAL">Critical</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* <Modal
        visible={isRemoveMemberModal}
        onCancel={() => setIsRemoveMemberModal(false)}
        title={`Remove Member ${selectedMember?.fullName}`}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => handleRemoveMember(selectedMember)}
              danger
            >
              Remove
            </Button>
            <Button onClick={() => setIsRemoveMemberModal(false)}>
              Cancel
            </Button>
          </>
        }
      >
        <p>Are you sure want to remove this member from the project?</p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. The member will lose access to the
          project.
        </p>
      </Modal> */}
    </div>
  );
}
