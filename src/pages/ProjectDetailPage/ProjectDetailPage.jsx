import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
  DatePicker,
} from "antd";
const { RangePicker } = DatePicker;
import React, { useEffect, useState } from "react";
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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});
  const [topics, setTopics] = useState([]);

  const [isCreateTaskModal, setIsCreateTaskModal] = useState(false);
  const [isInviteMemberModal, setIsInviteMemberModal] = useState(false);
  const [isCreateTopicModal, setIsCreateTopicModal] = useState(false);
  const [formInviteMember] = Form.useForm();
  const [formCreateTopic] = Form.useForm();

  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      console.log(response.data);
      setProjectDetail(response.data);
      setTopics(
        response.data.topics.sort((a, b) => b.type.localeCompare(a.type))
      );
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const showCreateTaskModal = () => {
    setIsCreateTaskModal(true);
  };

  const showInviteMemberModal = () => {
    setIsCreateTopicModal(true);
  };

  const showCreateTopicModal = () => {
    setIsCreateTopicModal(true);
  };
  const [fileList, setFileList] = useState([]);

  const handleInviteMember = async (values) => {
    console.log(values);
    const params = {
      userId: "98c7e87f-cff9-4d95-988b-cdaaaf1a74f4",
      role: values.role,
    };
    try {
      const response = await projectService.inviteMember(id, params);
      console.log(response);
    } catch (error) {
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

  const items = topics.map((topic) => {
    return {
      key: topic.id,
      label: (
        <p style={{ color: topic.type === "ISSUE" ? "red" : "#1b97ff" }}>
          {topic.labels}
        </p>
      ),
      // children: topic.tasks.map((task) => {
      //   return (
      //     <div className="flex justify-between items-center gap-[15%] mb-[3%]">
      //       <div>
      //         <p>{task.title}</p>
      //         <p>{task.status}</p>
      //         <div className="">
      //           <p>
      //             {moment(task.created_at).format("DD/MM/YYYY")} -{" "}
      //             {moment(task.updated_at).format("DD/MM/YYYY")}
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
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-[5%]">
          <h1 className="text-2xl font-bold text-nowrap">
            {projectDetail.name}
          </h1>
          <Button
            icon={<FaPlus />}
            className="!bg-[#1968db] !text-white mr-[5%]"
            onClick={() => showInviteMemberModal()}
          >
            Invite Member
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Button
            icon={<FaPlus />}
            className="!bg-[#1968db] !text-white mr-[5%]"
            onClick={() => showCreateTaskModal()}
          >
            New Task
          </Button>
          <Button icon={<FaPlus />} onClick={() => showCreateTopicModal()}>
            New Topic
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <></>
      ) : (
        <>
          <Tabs defaultActiveKey="1" items={items} size="large" />
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
        >
          <Form.Item name="email" label="Member's email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="role" label="Role">
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
            <Button type="primary" onClick={() => uploadFile()}>
              Create
            </Button>
            <Button onClick={() => setIsCreateTaskModal(false)}>Cancel</Button>
          </>
        }
      >
        <Form layout="vertical" className="max-h-[50vh] overflow-y-auto">
          <Form.Item name="title" label="Task Title">
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Task Description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="title" label="Assign to">
            <Select placeholder="Select Team member" size="large">
              <Select.Option>
                <div className="!flex !justify-start !items-center !gap-[5%]">
                  <Avatar icon={<UserOutlined />} />
                  <span>John Doe</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="title" label="Reporter">
            <Select placeholder="Select Team member" size="large">
              <Select.Option>
                <div className="!flex !justify-start !items-center !gap-[5%]">
                  <Avatar icon={<UserOutlined />} />
                  <span>John Doe</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="title" label="Attachment">
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
    </div>
  );
}
