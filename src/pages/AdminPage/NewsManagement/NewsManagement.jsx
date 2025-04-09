import { Button, Form, Input, Modal, Table } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import adminService from "./../../../services/adminService";
import toast from "react-hot-toast";
import TextArea from "antd/es/input/TextArea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formCreateNews] = Form.useForm();
  const [isModalCreateNewsOpen, setIsModalCreateNewsOpen] = useState(false);
  const [isModalViewDetailOpen, setIsModalViewDetailOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(false);
  const quillRef = useRef(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllNews();
      setNews(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching news:", error);
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
      dataIndex: "content",
      key: "content",
      render: (text, record) => {
        return (
          <Button
            onClick={() => {
              setIsModalViewDetailOpen(true);
              setSelectedNews(record);
            }}
          >
            View Detail
          </Button>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <Button
            color="danger"
            variant="solid"
            onClick={() => {
              handleDeleteNews(record);
            }}
          >
            Delete
          </Button>
        );
      },
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
          console.log(response.data);
          const imageUrl = response.data;
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", imageUrl);
        } catch (error) {
          console.error("Error uploading image: ", error);
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
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );
  const handleCreateNews = async (values) => {
    try {
      const response = await adminService.createNews(values);
      console.log(response);
      fetchNews(); // Refresh the news list after creating a new one
      setIsModalCreateNewsOpen(false); // Close the modal after creating news
      formCreateNews.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error(error.response.data.message);
    }
  };

  // useEffect(() => {
  //   // Override the default image handler of ReactQuill's toolbar
  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();
  //     const toolbar = quill.getModule("toolbar");

  //     // Add custom image handler
  //     toolbar.addHandler("image", imageHandler);
  //   }
  // }, []);
  const parseImageAlts = (html) => {
    // Convert Google Drive image URLs to direct image links

    // Add alt="news image" to any <img> tag that doesn't have an alt attribute
    const withAltText = html.replace(
      /<img(?![^>]*\balt=)([^>]*)>/g,
      '<img alt="news image"$1>'
    );

    return withAltText;
  };

  const handleDeleteNews = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this news?",
      content: `Title: ${record.title}`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await adminService.deleteNews(record.id);
          console.log(response.data);
          toast.success("News deleted successfully");
          fetchNews(); // Refresh the news list after deleting
        } catch (error) {
          console.error("Error deleting news:", error);
          toast.error(error.response.data.message);
        }
      },
    });
  };

  return (
    <div>
      <Button
        color="primary"
        variant="solid"
        onClick={() => setIsModalCreateNewsOpen(true)}
      >
        Create News
      </Button>

      <Table dataSource={news} columns={columns} />

      <Modal
        open={isModalCreateNewsOpen}
        onCancel={() => {
          setIsModalCreateNewsOpen(false);
          formCreateNews.resetFields();
        }}
        onOk={() => {
          formCreateNews.submit();
        }}
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
            <Input type="text"></Input>
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true }]}
          >
            <ReactQuill
              theme="snow"
              ref={quillRef}
              value={formCreateNews.getFieldValue("content")}
              onChange={(value) =>
                formCreateNews.setFieldsValue({ content: value })
              }
              className="mb-10 h-[300px]"
              modules={modules}
              formats={formats}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isModalViewDetailOpen}
        onCancel={() => {
          setIsModalViewDetailOpen(false);
          setSelectedNews(false);
        }}
        title={`News Detail of ${selectedNews?.title}`}
        width={1000}
        footer={null}
      >
        {selectedNews && (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                parseImageAlts(
                  selectedNews.content || "<p>No Content Available</p>"
                )
              ),
            }}
            style={{
              padding: "1rem",
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
            }}
          />
        )}
      </Modal>
    </div>
  );
}
