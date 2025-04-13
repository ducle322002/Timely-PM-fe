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
  Upload,
  Select,
} from "antd";
import { motion } from "framer-motion";
import userService from "../../services/userService";
import { EditOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
const { Title, Text } = Typography;

export default function UserProfilePage() {
  const [user, setUser] = useState({});
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const dispatch = useDispatch();
  const [formUpdate] = Form.useForm();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getUserProfile();
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    console.log("Update Profile");
    try {
      const response = await userService.updateProfile();
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
          <Avatar
            size={120}
            src={
              user.profile?.avatarUrl || "https://joeschmoe.io/api/v1/random"
            }
            // icon={<UserOutlined />}
            style={{ marginBottom: 20 }}
          />
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
                email: user.email,
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
          <Form.Item name="user_avatar" label="Avatar">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
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
