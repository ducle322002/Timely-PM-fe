import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Input,
  Select,
  Badge,
  Upload,
  Tooltip,
} from "antd";
import { motion } from "framer-motion";
import userService from "../../services/userService";
import {
  EditOutlined,
  LoadingOutlined,
  ManOutlined,
  PhoneOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { FaGenderless } from "react-icons/fa";

const { Title, Text } = Typography;

export default function UserProfilePage() {
  const [user, setUser] = useState({});
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formUpdate] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Create a function to fetch and update the user profile.
  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUserProfile();
      setUser(response.data);
      console.log("Profile refreshed", response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (values) => {
    console.log("Update Profile");
    const requestData = {
      fullName: values.fullName,
      gender: values.gender,
      phone: values.phone,
    };
    try {
      const response = await userService.updateProfile(requestData);
      toast.success("Update profile successfully!");
      setIsModalUpdateOpen(false);
      formUpdate.resetFields();
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  // Upload avatar and refresh profile upon success.
  const handleUploadAvatar = async (file) => {
    setLoading(true);
    console.log("Upload Avatar");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await userService.uploadAvatar(formData);
      toast.success("Upload avatar successfully!");
      console.log(response.data);
      // Refresh the profile after successful upload
      await fetchUserProfile();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Called when file selection changes.
  const handleFileChange = (info) => {
    // Set the file list to only the current file.
    setFileList(info.fileList);
    // Automatically call the upload function if a file is selected.
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      toast.success(`${file.name} selected for upload!`);
      handleUploadAvatar(file);
    }
    console.log(info);
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=" border-gray-200 shadow-2xl rounded-3xl p-6 w-full max-w-md items-center justify-center flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Title level={3} className="!mb-1">
            User Profile
          </Title>
          <Text type="secondary">
            Manage your profile and personal information
          </Text>
        </div>

        {/* Avatar Upload */}
        <Upload
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleFileChange}
          showUploadList={false}
          accept="image/*"
        >
          <div className="relative group cursor-pointer mb-4">
            <Avatar
              shape="square"
              size={120}
              src={!loading ? user.profile?.avatarUrl : undefined}
              icon={loading && <LoadingOutlined />}
              className="avatar-shadow ease-in-out hover:scale-105 mx-auto border-2 border-gray-300 group-hover:opacity-75 transition-all duration-300"
            />
            <Tooltip title="Click to upload">
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 text-white text-xs shadow-md opacity-80 group-hover:opacity-100 transition">
                <EditOutlined />
              </div>
            </Tooltip>
          </div>
        </Upload>

        {/* Name + Email */}
        <div className="text-center">
          <Title level={4} className="!mb-0">
            {user.profile?.fullName}
          </Title>
          <Text type="secondary">{user.email}</Text>
        </div>

        {/* Divider */}
        <Divider className="my-4" />

        {/* Info Section */}
        <Row gutter={[16, 16]}>
          <Col span={12} className="text-center">
            <Text strong>
              <UserOutlined className="mr-1" />
              Full Name
            </Text>
            <br />
            <Text>{user.profile?.fullName || "-"}</Text>
          </Col>

          {user.profile?.gender === "MALE" ? (
            <Col span={12} className="text-center">
              <ManOutlined className="mr-1" />
              <Text strong>Gender</Text>
              <br />
              <Text>Male</Text>
            </Col>
          ) : (
            <Col span={12} className="text-center">
              <WomanOutlined className="mr-1" />
              <Text strong>Gender</Text>
              <br />
              <Text>Female</Text>
            </Col>
          )}

          <Col span={24} className="text-center">
            <Text strong>
              <PhoneOutlined className="mr-1" />
              Phone
            </Text>
            <br />
            <Text>{user.profile?.phone || "-"}</Text>
          </Col>
        </Row>

        {/* Optional: Description or bio block */}
        <Divider />

        {/* Button */}
        <div className="text-center">
          <Button
            type="primary"
            shape="round"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalUpdateOpen(true);
              formUpdate.setFieldsValue({
                fullName: user.profile?.fullName,
                phone: user.profile?.phone,
                gender: user.profile?.gender,
              });
            }}
          >
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <Modal
        title={
          <span className="flex items-center gap-2">
            <UserOutlined /> Edit Profile
          </span>
        }
        open={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <Form
          requiredMark={false}
          form={formUpdate}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
