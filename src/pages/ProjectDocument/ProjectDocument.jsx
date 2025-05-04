import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Table,
} from "antd";
import {
  InboxOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import Dragger from "antd/es/upload/Dragger";

export default function ProjectDocument() {
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [project, setProject] = useState({});
  const [projectDocument, setProjectDocument] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);
  const [isModalUploadFile, setIsModalUploadFile] = useState(false);
  const [formUploadFile] = Form.useForm();
  const user = useSelector(selectUser);
  const fetchProjectDocument = async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjectDocument(id);
      setProjectDocument(response.data);
      console.log("project Document", response.data);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await projectService.getProjectsById(id);
        setProject(response.data);
        console.log("project", response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchProjectDetails();
    fetchProjectDocument();
  }, []);

  const handleDeleteFile = async (fileId) => {
    Modal.confirm({
      title: "Delete File",
      content: "Are you sure you want to delete this file?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await projectService.deleteProjectDocument(fileId);
          console.log("Delete file response", response);
          fetchProjectDocument();
          toast.success("File deleted successfully");
        } catch (error) {
          toast.error(error.response.data.message || "Error deleting file");
          console.log(error.response.data);
        }
      },
    });
  };

  const handleUploadFile = async (values) => {
    setLoadingUploadFile(true);
    const formData = new FormData();
    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }
    try {
      const response = await projectService.uploadProjectDocument(id, formData);
      console.log("Upload file response", response);
      fetchProjectDocument();
      toast.success("Upload file successfully");
      setIsModalUploadFile(false);
      setFileList([]);
      formUploadFile.resetFields();
    } catch (error) {
      toast.error(error.response.data.message || "Error uploading file");
      console.log(error.response.data);
    } finally {
      setLoadingUploadFile(false);
    }
  };

  const columns = [
    {
      title: "File's Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Download File",
      dataIndex: "downloadUrl",
      key: "downloadUrl",
      render: (text, record) => (
        <a
          href={record.downloadUrl}
          rel="noopener noreferrer"
          download={record.downloadUrl}
        >
          Download
        </a>
      ),
    },

    {
      title: "View File",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (text, record) => (
        <a href={record.fileUrl} target="_blank">
          View File
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {project.userId === user.id && (
            <Button
              color="danger"
              variant="solid"
              type="primary"
              onClick={() => handleDeleteFile(record.id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];
  const filteredData = searchText
    ? projectDocument.filter((item) =>
        (item.fileName?.toLowerCase() || "").includes(searchText.toLowerCase())
      )
    : projectDocument;
  const handleFileChange = (info) => {
    setFileList(info.fileList);
    toast.success(info.fileList[0].name + " uploaded successfully!");
    console.log(info);
  };
  return (
    <div className="p-6">
      <Card className="">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold m-0">Project Document</h1>
          <Space size="middle">
            <Button
              icon={<UploadOutlined />}
              type="primary"
              onClick={() => setIsModalUploadFile(true)}
            >
              Upload File
            </Button>
            <Input
              placeholder="Search documents"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Space>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading Documents" />
          </div>
        ) : filteredData.length === 0 ? (
          <Empty description="No Document Found" className="py-16" />
        ) : (
          <Table
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            columns={columns}
            dataSource={filteredData}
            scroll={{ x: 1000 }}
            rowKey="key"
          />
        )}
      </Card>

      <Modal
        visible={isModalUploadFile}
        onCancel={() => {
          setIsModalUploadFile(false);
          setFileList([]);
        }}
        title="Upload File"
        footer={
          <>
            <Button
              type="primary"
              onClick={() => formUploadFile.submit()}
              loading={loadingUploadFile}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setIsModalUploadFile(false);
                setFileList([]);
                formUploadFile.resetFields(); // Reset the form fields
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Form
          form={formUploadFile}
          layout="vertical"
          className="max-h-[50vh] overflow-y-auto"
          onFinish={handleUploadFile}
          requiredMark={false}
        >
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
        </Form>
      </Modal>
    </div>
  );
}
