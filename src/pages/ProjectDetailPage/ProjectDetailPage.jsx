import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Modal, Select, Tabs } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProjectDetailPage() {
  const { id } = useParams();

  const projectDetail = {
    id: id,
    title: "Project 1",
    description: "Project 1 description",

    topic: [
      {
        id: 1,
        title: "Worked On",
        description: "Worked On description",
        tasks: [
          {
            id: 1,
            title: "Task 1",
            description: "Task 1 description",
            status: "Done",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
          {
            id: 2,
            title: "Task 2",
            description: "Task 2 description",
            status: "Done",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
        ],
      },
      {
        id: 2,
        title: "Assign To Me",
        description: "In Progress description",
        tasks: [
          {
            id: 1,
            title: "Task 1 by me",
            description: "Task 1 by me",
            status: "Waiting",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
          {
            id: 2,
            title: "Task 2 by me",
            description: "Task 2 by me",
            status: "Waiting",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
        ],
      },
      {
        id: 3,
        title: "Fix Bug",
        description: "Worked On description",
        tasks: [
          {
            id: 1,
            title: "Fix Task 1",
            description: "Task 1 description",
            status: "Done",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
          {
            id: 2,
            title: "Fix Task 2",
            description: "Task 2 description",
            status: "Done",
            created_at: "2021-09-14T09:00:00Z",
            updated_at: "2024-12-15T09:00:00Z",
          },
        ],
      },
    ],
  };

  const [isCreateTaskModal, setIsCreateTaskModal] = useState(false);

  const [isCreateTopicModal, setIsCreateTopicModal] = useState(false);

  const showCreateTaskModal = () => {
    setIsCreateTaskModal(true);
  };

  const [fileList, setFileList] = useState([]);

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

  const items = projectDetail.topic.map((topic) => {
    return {
      key: topic.id,
      label: topic.title,
      children: topic.tasks.map((task) => {
        return (
          <div className="flex justify-between items-center gap-[15%] mb-[3%]">
            <div>
              <p>{task.title}</p>
              <p>{task.status}</p>
              <div className="">
                <p>
                  {moment(task.created_at).format("DD/MM/YYYY")} -{" "}
                  {moment(task.updated_at).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <div className=" flex justify-between items-center gap-[10%]">
              <p className="w-[100px]">Created By</p>
              <Avatar size="large" icon={<UserOutlined />} />
            </div>
          </div>
        );
      }),
    };
  });
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Project {projectDetail.title} id: {id}
        </h1>

        <div className="flex justify-between items-center">
          <Button
            icon={<FaPlus />}
            className="!bg-[#1968db] !text-white mr-[5%]"
            onClick={() => showCreateTaskModal()}
          >
            New Task
          </Button>
          <Button icon={<FaPlus />}>New Topic</Button>
        </div>
      </div>

      <Tabs defaultActiveKey="1" items={items} />

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
    </div>
  );
}
