import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Switch,
  Button,
  Modal,
  Input,
  Tabs,
  List,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Select,
  Pagination,
  Empty,
} from "antd";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import projectService from "../../services/projectService";
import toast from "react-hot-toast";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const { Search } = Input;
const { Option } = Select;

export default function SettingProjectPage() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [projectDetail, setProjectDetail] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedProjectName, setUpdatedProjectName] = useState("");

  // Topic related states
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [deleteTopicModalOpen, setDeleteTopicModalOpen] = useState(false);

  // Filtering and pagination states
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchProjectDetail = async () => {
    try {
      const response = await projectService.getProjectsById(id);
      setProjectDetail(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  // Filter and paginate topics
  const filteredTopics = useMemo(() => {
    if (!projectDetail.topics) return [];

    let filtered = projectDetail.topics;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (topic) =>
          topic.description.toLowerCase().includes(searchText.toLowerCase()) ||
          topic.labels.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((topic) => topic.type === selectedType);
    }

    return filtered;
  }, [projectDetail.topics, searchText, selectedType]);

  // Get paginated topics
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTopics.slice(startIndex, startIndex + pageSize);
  }, [filteredTopics, currentPage, pageSize]);

  const handleCloseProject = () => {
    setModalOpen(true);
  };

  const confirmCloseProject = async () => {
    try {
      const response = await projectService.closeProject(id);
      console.log(response);
      toast.success(response.message);
      fetchProjectDetail(); // Refresh project details after closing
      setModalOpen(false);
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setUpdatedProjectName(projectDetail.name); // Set the current name as the initial value
  };

  const handleSaveName = async () => {
    const requestData = {
      name: updatedProjectName.trim(),
      status: projectDetail.status,
      image: projectDetail.image,
    };
    if (!updatedProjectName) {
      toast.error("Project name cannot be empty.");
      return;
    }
    try {
      const response = await projectService.updateProject(id, requestData);
      console.log(response);
      toast.success("Project name updated successfully!");
      setIsEditingName(false);
      fetchProjectDetail(); // Refresh project details after updating
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to update project name.");
    }
  };

  // Topic deletion handlers
  const handleDeleteTopic = (topic) => {
    setTopicToDelete(topic);
    setDeleteTopicModalOpen(true);
  };

  const confirmDeleteTopic = async () => {
    const params = {
      projectId: id,
    };
    try {
      // Replace with your actual API endpoint
      const response = await projectService.deleteTopic(
        topicToDelete.id,
        params
      );
      console.log(response);
      toast.success("Topic deleted successfully!");
      fetchProjectDetail(); // Refresh project details to get updated topics
      setDeleteTopicModalOpen(false);
      setTopicToDelete(null);
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Failed to delete topic");
    }
  };

  // Get color and icon for topic type
  const getTopicTypeInfo = (type) => {
    switch (type) {
      case "TASK":
        return { color: "blue", icon: "📋" };
      case "ISSUE":
        return { color: "red", icon: "⚠️" };
      case "QUESTION":
        return { color: "green", icon: "❓" };
      default:
        return { color: "default", icon: "📝" };
    }
  };

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const user = useSelector(selectUser);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs>
          <Tabs.TabPane
            tab="Project Settings"
            key="1"
            className="p-6 max-w-2xl mx-auto"
          >
            <Card title="Project Settings" className="shadow-md rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">
                  Enable Notifications
                </span>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Project Code</span>
                <Input.Password
                  value={projectDetail.code}
                  readOnly
                  bordered={false}
                  style={{ width: "100px", backgroundColor: "transparent" }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Project Status</span>
                <span
                  className={
                    projectDetail.status ? "text-red-500" : "text-green-500"
                  }
                >
                  {projectDetail.status}
                </span>
              </div>

              {projectDetail.userId === user.id && (
                <Button
                  danger
                  className="mt-4 w-full"
                  onClick={() => handleCloseProject()}
                  disabled={projectDetail.status === "DONE"}
                >
                  Close Project
                </Button>
              )}
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Project Details"
            key="2"
            className="p-6 max-w-2xl mx-auto"
          >
            <Card title="Project Details" className="shadow-md rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Project Name</span>
                <Input
                  value={
                    isEditingName ? updatedProjectName : projectDetail.name
                  }
                  onChange={(e) => setUpdatedProjectName(e.target.value)}
                  readOnly={!isEditingName}
                  bordered={isEditingName}
                  style={{
                    width: "50%",
                    backgroundColor: isEditingName ? "white" : "transparent",
                  }}
                />
              </div>
              {projectDetail.userId === user.id && (
                <Button
                  type={isEditingName ? "primary" : "default"}
                  onClick={isEditingName ? handleSaveName : handleEditName}
                  className="w-full rounded-lg"
                >
                  {isEditingName ? "Save" : "Edit"}
                </Button>
              )}
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab="Topic Setting"
            key="3"
            className="p-6 max-w-2xl mx-auto"
          >
            <Card title="Topic Management" className="shadow-md rounded-2xl">
              {/* Search and Filter Section */}
              <div className="mb-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={16}>
                    <Search
                      placeholder="Search topics by description or labels"
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className="w-full"
                    />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Select
                      size="large"
                      value={selectedType}
                      onChange={(value) => {
                        setSelectedType(value);
                        setCurrentPage(1); // Reset to first page on filter change
                      }}
                      className="w-full"
                      prefix={<FilterOutlined />}
                    >
                      <Option value="ALL">All Types</Option>
                      <Option value="TASK">Tasks</Option>
                      <Option value="ISSUE">Issues</Option>
                      <Option value="QUESTION">Questions</Option>
                    </Select>
                  </Col>
                </Row>
              </div>

              {/* Topics List */}
              {filteredTopics.length > 0 ? (
                <>
                  <List
                    itemLayout="vertical"
                    dataSource={paginatedTopics}
                    renderItem={(topic) => {
                      const typeInfo = getTopicTypeInfo(topic.type);
                      return (
                        <List.Item
                          key={topic.id}
                          className=" !pb-4 !mb-4 !hover:bg-gray-50 !transition-colors !duration-200 !rounded-lg !px-4"
                          actions={[
                            projectDetail.userId === user.id && (
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteTopic(topic)}
                                type="default"
                                className="hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            ),
                          ]}
                        >
                          <Row gutter={[16, 8]}>
                            <Col xs={24} md={16}>
                              <Space direction="vertical" size="small">
                                <Space>
                                  <span className="text-lg font-medium">
                                    {topic.labels}
                                  </span>
                                  <Tag color={typeInfo.color} className="ml-2">
                                    {typeInfo.icon} {topic.type}
                                  </Tag>
                                </Space>
                              </Space>
                            </Col>
                            <Col xs={24} md={8} className="text-right">
                              <Space
                                direction="vertical"
                                size="small"
                                className="text-gray-600"
                              >
                                <Space>
                                  <CalendarOutlined />
                                  <span>
                                    {dayjs(topic.startDate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </Space>
                                <Space>
                                  <ClockCircleOutlined />
                                  <span>
                                    {dayjs(topic.dueDate).format("DD-MM-YYYY")}
                                  </span>
                                </Space>
                              </Space>
                            </Col>
                          </Row>
                        </List.Item>
                      );
                    }}
                  />

                  {/* Pagination */}
                  {filteredTopics.length > pageSize && (
                    <div className="flex justify-end mt-4">
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredTopics.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={["5", "10", "20", "50"]}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} topics`
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <Empty
                  description={
                    <span className="text-gray-500">
                      {searchText || selectedType !== "ALL"
                        ? "No topics match your search criteria"
                        : "No topics available for this project"}
                    </span>
                  }
                  className="py-12"
                />
              )}
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </motion.div>

      {/* Project Close Modal */}
      <Modal
        title="Confirm Close Project"
        open={modalOpen}
        onOk={confirmCloseProject}
        onCancel={() => setModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to close this project? This action is
          irreversible.
        </p>
      </Modal>

      {/* Topic Delete Modal */}
      <Modal
        title="Confirm Delete Topic"
        open={deleteTopicModalOpen}
        onOk={confirmDeleteTopic}
        onCancel={() => {
          setDeleteTopicModalOpen(false);
          setTopicToDelete(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the topic "{topicToDelete?.labels}"?
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
