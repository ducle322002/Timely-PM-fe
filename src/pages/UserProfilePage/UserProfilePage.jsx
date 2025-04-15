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
} from "antd";
import { motion } from "framer-motion";
import userService from "../../services/userService";
import { EditOutlined, UserOutlined } from "@ant-design/icons";

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
    <div className="flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <Card className="text-center w-[400px]">
          <Badge.Ribbon text="Upload Avatar">
            <Upload
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
              accept="image/*"
            >
              <Avatar
                shape="square"
                size={120}
                src={loading ? "" : user.profile?.avatarUrl}
                icon={<UserOutlined />}
                style={{ marginBottom: 20 }}
                className="cursor-pointer"
              />
            </Upload>
          </Badge.Ribbon>

          <Title level={4}>{user.profile?.fullName}</Title>
          <Text type="secondary">{user.email}</Text>
          <Divider />

          {/* Profile Details */}
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12}>
              <Text strong>Fullname</Text>
              <br />
              <Text>{user.profile?.fullName}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>Gender</Text>
              <br />
              <Text>{user.profile?.gender}</Text>
            </Col>

            <Col xs={24} sm={12}>
              <Text strong>Phone</Text>
              <br />
              <Text>{user.profile?.phone}</Text>
            </Col>
          </Row>
          <Divider />

          {/* Action Buttons */}
          <Button
            onClick={() => {
              setIsModalUpdateOpen(true);
              formUpdate.setFieldsValue({
                fullName: user.profile?.fullName,
                phone: user.profile?.phone,
                gender: user.profile?.gender,
              });
            }}
            icon={<EditOutlined />}
          >
            Edit Profile
          </Button>
        </Card>
      </motion.div>

      <Modal
        title="Edit Profile"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
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
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select placeholder="Select Gender">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
