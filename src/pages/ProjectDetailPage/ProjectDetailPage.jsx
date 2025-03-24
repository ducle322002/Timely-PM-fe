import { InboxOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
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
} from "antd";
const { RangePicker } = DatePicker;
import React, { Children, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import toast from "react-hot-toast";
import axios from "axios";
import projectService from "../../services/projectService";
import moment from "moment/moment";
import topicService from "../../services/topicService";
import dayjs from "dayjs";
import taskService from "../../services/taskService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { motion } from "framer-motion";
export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const [topics, setTopics] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [defaultTabKey, setDefaultTabKey] = useState("");
  const [isCreateTaskModal, setIsCreateTaskModal] = useState(false);
  const [isInviteMemberModal, setIsInviteMemberModal] = useState(false);
  const [isCreateTopicModal, setIsCreateTopicModal] = useState(false);
  const [isProjectMemberModal, setIsProjectMemberModal] = useState(false);
  const [formInviteMember] = Form.useForm();
  const [formCreateTopic] = Form.useForm();
  const [formCreateTask] = Form.useForm();
  const [selectedTopic, setSelectedTopic] = useState({});
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [loadingTasks, setLoadingTasks] = useState(false); // Add loading state
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
      if (sortedTopics.length > 0) {
        setDefaultTabKey(sortedTopics[0].id);
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
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoadingTasks(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMemberProject();
    fetchProjectDetail();
  }, [activeTabKey, id]);

  const showCreateTaskModal = (topic) => {
    setIsCreateTaskModal(true);
    setSelectedTopic(topic);
    setActiveTabKey(topic.id);
  };

  const showInviteMemberModal = () => {
    setIsInviteMemberModal(true);
  };

  const showCreateTopicModal = () => {
    setIsCreateTopicModal(true);
  };

  const showMemberProjectModal = () => {
    setIsProjectMemberModal(true);
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

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  const uploadFile = async () => {
    if (fileList.length === 0) {
      toast.warning("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });
    console.log(formData);
    setFileList([]);
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      toast.error("File upload failed!");
      console.error(error);
    }
  };

  const handleCreateTask = async (values) => {
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
      const response = await taskService.createTask(requestData, params);
      console.log(response);
      toast.success("Task created successfully!");
      fetchTasks();
      setIsCreateTaskModal(false);
      formCreateTask.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const items = topics.map((topic) => {
    return {
      key: topic.id,
      label: (
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
      ),
      children: (
        <>
          <div className="flex justify-end items-center mb-[1%]">
            <Button
              icon={<FaPlus />}
              className="!bg-[#1968db] !text-white"
              onClick={() => showCreateTaskModal(topic)}
            >
              New Task
            </Button>
          </div>
          {loadingTasks ? (
            <div className="flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {tasks.map((task) => (
                <>
                  <div
                    className="flex justify-between items-center gap-[15%] mt-[1%] cursor-pointer hover:bg-gray-100 py-[3%] px-[2%] rounded-lg"
                    onClick={() => setSelectedTask(task)} // Update the selected task
                  >
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
                    <div className=" flex justify-between items-center gap-[10%]">
                      <p className="w-[100px]">{task.user.username}</p>
                      <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        src={task.user.profile.avatarUrl}
                      />
                    </div>
                  </div>
                </>
              ))}
            </>
          )}
        </>
      ),
      // children: topic.tasks?.map((task) => {
      //   return (
      //     <div className="flex justify-between items-center gap-[15%] mb-[3%]">
      //       <div>
      //         <p>{task?.title}</p>
      //         <p>{task?.status}</p>
      //         <div className="">
      //           <p>
      //             {moment(task?.created_at).format("DD/MM/YYYY")} -{" "}
      //             {moment(task?.updated_at).format("DD/MM/YYYY")}
      //           </p>
      //         </div>
      //       </div>
      //       <div className=" flex justify-between items-center gap-[10%]">
      //         <p className="w-[100px]">Created By</p>
      //         <Avatar size="large" icon={<UserOutlined />} />
      //       </div>
      //     </div>
      //   );
      // }),
    };
  });
  const dateLeft = (dueDate) => {
    const currentDate = new Date();
    const dueDateConvert = new Date(dueDate);
    const diffTime = Math.abs(dueDateConvert - currentDate);
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

      return 0; // Return 0 if less than 1 day
    }

    return diffDays; // Return days if more than 1 day
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
            className="!bg-[#1968db] !text-white mr-[5%]"
            onClick={() => showMemberProjectModal()}
          >
            View Members
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Button
            icon={<FaPlus />}
            className="!bg-[#1968db] !text-white mr-[5%]"
            onClick={() => showInviteMemberModal()}
          >
            Invite Member
          </Button>
          <Button icon={<FaPlus />} onClick={() => showCreateTopicModal()}>
            New Topic
          </Button>
        </div>
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
              {selectedTask ? (
                <motion.div
                  key={selectedTask.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl shadow-md p-6 bg-white"
                >
                  <h2
                    className={`text-xl font-semibold mb-2 ${
                      selectedTask.priority === "HIGH"
                        ? "text-red-500"
                        : selectedTask.priority === "MEDIUM"
                        ? "text-yellow-500"
                        : "text-green-500"
                    } `}
                  >
                    {selectedTask.label}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedTask.summer}</p>
                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-1">
                      Description
                    </p>
                    <p className="text-gray-500 whitespace-pre-line">
                      {selectedTask.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar src={selectedTask?.user?.profile?.avatarUrl} />
                    <span className="text-gray-700 font-medium">
                      {selectedTask?.user?.username}
                    </span>
                  </div>
                  <div className="flex gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p>
                        {moment(selectedTask.startDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p>{moment(selectedTask.dueDate).format("DD/MM/YYYY")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days Left</p>
                      {dateLeft(selectedTask.dueDate) < 1 ? (
                        <p className="text-red-500 font-bold">{countdown}</p>
                      ) : (
                        <p>{dateLeft(selectedTask.dueDate)} days</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Priority</p>
                    <p>
                      <span
                        className={`inline-block px-3 py-1 text-white rounded-full ${
                          selectedTask.priority === "HIGH"
                            ? "bg-red-500"
                            : selectedTask.priority === "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {selectedTask.priority}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
                    {/* Mock attachment display */}
                    <div className="border rounded p-2 text-sm text-gray-600">
                      No attachments uploaded.
                    </div>
                  </div>
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
        onCancel={() => setIsCreateTaskModal(false)}
        title="Create Task"
        footer={
          <>
            <Button type="primary" onClick={() => formCreateTask.submit()}>
              Create
            </Button>
            <Button onClick={() => setIsCreateTaskModal(false)}>Cancel</Button>
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
            name="label"
            label="Task Label"
            rules={[{ required: true, message: "Please enter Task Label" }]}
          >
            <Input />
          </Form.Item>
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
            <RangePicker format={"DD/MM/YYYY"} />
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
            <RangePicker format={"DD/MM/YYYY"} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isProjectMemberModal}
        onCancel={() => setIsProjectMemberModal(false)}
        title="Team's Member"
        footer={
          <>
            <Button onClick={() => setIsProjectMemberModal(false)}>
              Close
            </Button>
          </>
        }
      >
        <div className="max-h-[50vh] overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex justify-start items-center gap-[5%] mb-4"
            >
              <Avatar icon={<UserOutlined />} src={member.avatarUrl} />
              <span>{member.fullName}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
