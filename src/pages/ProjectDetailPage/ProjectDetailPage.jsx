import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Modal, Select, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import toast from "react-hot-toast";
import axios from "axios";
import projectService from "../../services/projectService";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState({});

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await projectService.getProjectsById(id);
        console.log(response.data);
        setProjectDetail(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };
    fetchProjectDetail();
  }, [id]);

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

  // const items = projectDetail.topic.map((topic) => {
  //   return {
  //     key: topic.id,
  //     label: topic.name,
  //     children: topic.tasks.map((task) => {
  //       return (
  //         <div className="flex justify-between items-center gap-[15%] mb-[3%]">
  //           <div>
  //             <p>{task.title}</p>
  //             <p>{task.status}</p>
  //             <div className="">
  //               <p>
  //                 {moment(task.created_at).format("DD/MM/YYYY")} -{" "}
  //                 {moment(task.updated_at).format("DD/MM/YYYY")}
  //               </p>
  //             </div>
  //           </div>
  //           <div className=" flex justify-between items-center gap-[10%]">
  //             <p className="w-[100px]">Created By</p>
  //             <Avatar size="large" icon={<UserOutlined />} />
  //           </div>
  //         </div>
  //       );
  //     }),
  //   };
  // });
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">ID: {projectDetail.id}</h1>

          <h1 className="text-2xl font-bold">Project {projectDetail.name}</h1>
        </div>

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

      {/* <Tabs defaultActiveKey="1" items={items} /> */}

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
