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
import React, { Children, useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import "./ProjectDetailPage.scss";
import issueService from "../../services/issueService";
import questionService from "../../services/questionService";
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

  const [formInviteMember] = Form.useForm();
  const [formCreateTopic] = Form.useForm();
  const [formCreateTask] = Form.useForm();
  const [formCreateIssue] = Form.useForm();
  const [formCreateQuestion] = Form.useForm();
  const [formUpdateTopic] = Form.useForm();
  const [formCreateIssueInTask] = Form.useForm();
  const [formUpdateTask] = Form.useForm();

  const [selectedTopic, setSelectedTopic] = useState({});
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskDetail, setTaskDetail] = useState(null);
  const [issueDetail, setIssueDetail] = useState({});
  const [questionDetail, setQuestionDetail] = useState({});

  const [issueInTask, setIssueInTask] = useState([]);

  const [issues, setIssues] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  const [selectedMember, setSelectedMember] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const user = useSelector(selectUser);

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
      const params = {
        projectId: id,
      };
      const response = await projectService.getMembers(params);
      console.log(response.data);
      setMembers(response.data);
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
    }
  };

  const handleCreateTask = async (values) => {
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
      toast.error(error.response.data.message);
    }
  };

  const handleCreateIssue = async (values) => {
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
    }
  };

  const handleCreateQuestion = async (values) => {
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
    const params = {
      projectId: id,
      topicId: activeTabKey,
    };
    const requestData = {
      label: values.label,
      summer: values.summer,
      description: values.description,
      attachment: "string",
      startDate: dayjs(values.dateRange[0]).toISOString(),
      dueDate: dayjs(values.dateRange[1]).toISOString(),
      priority: values.priority,
      severity: values.severity,
    };
    console.log(requestData);
    try {
      const response = await taskService.createIssueInTask(
        taskDetail.id,
        requestData,
        params
      );
      console.log(response);
      toast.success("Issue created successfully!");
      fetchTasks();
      fetchTaskDetail(taskDetail);
      setIsCreateIssueInTaskModal(false);
      formCreateIssueInTask.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
            issue.severity === "CATASTROPHIC"
              ? "bg-red-700"
              : issue.severity === "SEVERE"
              ? "bg-red-500"
              : issue.severity === "SIGNIFICANT"
              ? "bg-orange-500"
              : issue.severity === "MODERATE"
              ? "bg-yellow-500"
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
            <SettingOutlined onClick={() => showUpdateTopicModal(topic)} />
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
                ) : (
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
                )}
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
                  pagination={false}
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
    {
      key: "assignedToMe",
      label: "Assigned to Me",
      children: (
        <>
          {/* {loadingTasks ? (
            <div className="flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Table
                className="table-task"
                rowClassName="cursor-pointer hover:bg-gray-100"
                dataSource={[
                  ...tasks.filter((task) => task.user.id === user.id),
                  ...issues.filter((issue) => issue.user.id === user.id),
                  ...questions.filter(
                    (question) => question.assignee.id === user.id
                  ),
                ]}
                columns={taskColumns}
                pagination={false}
                bordered={false}
                rowHoverable={false}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedTask(record);
                    fetchTaskDetail(record.id);
                  },
                })}
              />
            </>
          )} */}
        </>
      ),
    },
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
        <Menu.Item
          key="update"
          onClick={() => handleShowModalUpdateTask(task)}
          icon={<EditOutlined />}
        >
          Update
        </Menu.Item>
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
      const response = await taskService.updateTask(selectedTask.id, params);
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
    try {
      const params = {
        userId: member.id,
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
                        <Button icon={<EllipsisOutlined />} />
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
                            {taskDetail.status}
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
                                  : taskDetail.severity === "MODERATE"
                                  ? "bg-yellow-100"
                                  : taskDetail.severity === "SIGNIFICANT"
                                  ? "bg-orange-200"
                                  : taskDetail.severity === "SEVERE"
                                  ? "bg-red-200"
                                  : taskDetail.severity === "CATASTROPHIC"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200"
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
                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
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
            <Button type="primary" onClick={() => formCreateTask.submit()}>
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
            label="Task Summer"
            rules={[{ required: true, message: "Please Enter Summer" }]}
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
            <Button type="primary" onClick={() => formCreateIssue.submit()}>
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
            label="Issue Summer"
            rules={[{ required: true, message: "Please Enter Summer" }]}
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
              <Select.Option value="MODERATE">Moderate</Select.Option>
              <Select.Option value="SIGNIFICANT">Significant</Select.Option>
              <Select.Option value="SEVERE">Severe</Select.Option>
              <Select.Option value="CATASTROPHIC">Catastrophic</Select.Option>
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
            <Button type="primary" onClick={() => formCreateQuestion.submit()}>
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
            name="summer"
            label="Question Summer"
            rules={[{ required: true, message: "Please Enter Summer" }]}
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
        visible={isCreateTopicModal}
        onCancel={() => setIsCreateTopicModal(false)}
        title="Create Topic"
        footer={
          <>
            <Button type="primary" onClick={() => formCreateTopic.submit()}>
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
        title="Update Topic"
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
                message: "Please Enter Labels Topic",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please Select Type Topic" }]}
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
        visible={isProjectMemberModal}
        onCancel={() => setIsProjectMemberModal(false)}
        title="Team's Members"
        footer={
          <Button onClick={() => setIsProjectMemberModal(false)}>Close</Button>
        }
      >
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

              <Popconfirm
                title={`Are you sure to remove ${member.fullName} from the project?`}
                description="This action cannot be undone."
                onConfirm={() => handleRemoveMember(member.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Remove</Button>
              </Popconfirm>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        visible={isCreateIssueInTaskModal}
        onCancel={() => setIsCreateIssueInTaskModal(false)}
        title={`Create Issue In Task ${taskDetail?.label}`}
        footer={
          <>
            <Button
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
            label="Issue Summer"
            rules={[{ required: true, message: "Please Enter Summer" }]}
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
              <Select.Option value="MODERATE">Moderate</Select.Option>
              <Select.Option value="SIGNIFICANT">Significant</Select.Option>
              <Select.Option value="SEVERE">Severe</Select.Option>
              <Select.Option value="CATASTROPHIC">Catastrophic</Select.Option>
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
        title={`Update Task ${taskDetail?.label}`}
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
          onFinish={() => handleUpdateTask(taskDetail)}
        >
          <Form.Item
            name="summer"
            label="Task Summer"
            rules={[{ required: true, message: "Please Enter Summer" }]}
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
