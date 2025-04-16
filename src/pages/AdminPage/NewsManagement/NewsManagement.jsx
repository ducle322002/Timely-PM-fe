import { Button, Form, Input, Modal, Table, Spin } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import adminService from "./../../../services/adminService";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formCreateNews] = Form.useForm();
  const [isModalCreateNewsOpen, setIsModalCreateNewsOpen] = useState(false);
  const [isModalViewDetailOpen, setIsModalViewDetailOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const quillRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllNews();
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      key: "content",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setIsModalViewDetailOpen(true);
            setSelectedNews(record);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteNews(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await adminService.imageNews(formData);
          const imageUrl = response.data;
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", imageUrl);
        } catch (error) {
          console.error("Image upload failed", error);
        }
      }
    };
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "image",
    "code-block",
  ];
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );

  const handleCreateNews = async (values) => {
    try {
      await adminService.createNews(values);
      fetchNews();
      setIsModalCreateNewsOpen(false);
      formCreateNews.resetFields();
      toast.success("News created successfully.");
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error(error?.response?.data?.message || "Create failed.");
    }
  };

  const handleDeleteNews = async (record) => {
    Modal.confirm({
      title: "Delete this news?",
      content: `Title: ${record.title}`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await adminService.deleteNews(record.id);
          toast.success("News deleted successfully.");
          fetchNews();
        } catch (error) {
          console.error("Error deleting news:", error);
          toast.error(error?.response?.data?.message || "Delete failed.");
        }
      },
    });
  };

  const parseImageAlts = (html) => {
    return html.replace(
      /<img(?![^>]*\balt=)([^>]*)>/g,
      '<img alt="news image"$1>'
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">News Management</h1>
        <Button type="primary" onClick={() => setIsModalCreateNewsOpen(true)}>
          Create News
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={news}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Create Modal */}
      <Modal
        open={isModalCreateNewsOpen}
        onCancel={() => {
          setIsModalCreateNewsOpen(false);
          formCreateNews.resetFields();
        }}
        onOk={() => formCreateNews.submit()}
        title="Create News"
        width={1000}
        okText="Create"
      >
        <Form
          form={formCreateNews}
          layout="vertical"
          requiredMark={false}
          onFinish={handleCreateNews}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Enter news title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true }]}
          >
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={formCreateNews.getFieldValue("content")}
              onChange={(value) =>
                formCreateNews.setFieldsValue({ content: value })
              }
              className="h-[300px] mb-4"
              modules={modules}
              formats={formats}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        open={isModalViewDetailOpen}
        onCancel={() => {
          setIsModalViewDetailOpen(false);
          setSelectedNews(null);
        }}
        title={`News Detail: ${selectedNews?.title}`}
        width={1000}
        footer={null}
      >
        {selectedNews && (
          <div
            className="p-4 bg-gray-100 rounded-lg"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                parseImageAlts(
                  selectedNews.content || "<p>No Content Available</p>"
                )
              ),
            }}
          />
        )}
      </Modal>
    </div>
  );
}
