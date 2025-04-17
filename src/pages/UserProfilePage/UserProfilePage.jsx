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
  Upload,
  Tooltip,
  Spin,
  Skeleton,
  Tag,
} from "antd";
import { motion } from "framer-motion";
import userService from "../../services/userService";
import {
  EditOutlined,
  LoadingOutlined,
  PhoneOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  CloudUploadOutlined,
  LockOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FaGenderless, FaMale, FaFemale } from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
export default function UserProfilePage() {
  const [user, setUser] = useState({});
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formUpdate] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] =
    useState(false);

  const [formChangePassword] = Form.useForm();
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);
  const handleChangePassword = async (values) => {
    setIsChangePasswordLoading(true);
    const requestData = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    const loadingToast = toast.loading("Changing password...");
    try {
      const response = await userService.changePassword(requestData);
      console.log(response.data);
      toast.success("Password changed successfully!");
      toast.dismiss(loadingToast); // remove loading
      toast.success("You need to login again to see the changes.");
      // Logout the user after changing password
      dispatch(logout());
      // Clear the token from cookies or local storage
      Cookies.remove("token");
      Cookies.remove("user");
      setIsModalChangePasswordOpen(false);
      formChangePassword.resetFields();
    } catch (error) {
      toast.dismiss(loadingToast); // remove loading
      toast.error(error.response?.data?.message || "Change password failed");
      console.log(error);
    } finally {
      setIsChangePasswordLoading(false);
    }
  };
  // Create a function to fetch and update the user profile.
  const fetchUserProfile = async () => {
    setPageLoading(true);
    try {
      const response = await userService.getUserProfile();
      setUser(response.data);
      console.log("Profile refreshed", response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (values) => {
    const requestData = {
      fullName: values.fullName,
      gender: values.gender,
      phone: values.phone,
    };
    try {
      const response = await userService.updateProfile(requestData);
      toast.success("Profile updated successfully!");
      setIsModalUpdateOpen(false);
      formUpdate.resetFields();
      setUser(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      console.log(error);
    }
  };

  // Upload avatar and refresh profile upon success.
  const handleUploadAvatar = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await userService.uploadAvatar(formData);
      toast.success("Avatar updated successfully!");
      // Refresh the profile after successful upload
      await fetchUserProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Called when file selection changes.
  const handleFileChange = (info) => {
    setFileList(info.fileList);
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      handleUploadAvatar(file);
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case "MALE":
        return <FaMale className="text-blue-500" />;
      case "FEMALE":
        return <FaFemale className="text-pink-500" />;
      default:
        return <FaGenderless className="text-gray-500" />;
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      default:
        return "Not specified";
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {pageLoading ? (
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <div className="flex flex-col items-center pb-6">
              <Skeleton.Avatar
                active
                size={100}
                shape="circle"
                className="mb-4"
              />
              <Skeleton active paragraph={{ rows: 2 }} className="w-3/4" />
            </div>
            <Divider />
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="md:col-span-1"
            >
              <Card className="shadow-md rounded-lg overflow-hidden border-0">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar with Upload */}

                  <div className="relative group mb-6">
                    <Upload
                      maxCount={1}
                      fileList={fileList}
                      beforeUpload={() => false}
                      onChange={handleFileChange}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Tooltip title="Click to upload">
                        <div className="relative cursor-pointer">
                          <Avatar
                            size={120}
                            src={!loading ? user.profile?.avatarUrl : undefined}
                            icon={loading && <LoadingOutlined />}
                            className="bg-blue-100 border-4 border-white shadow-lg transition-all duration-300 group-hover:brightness-90"
                          />
                          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 text-white text-xs shadow-md opacity-80 group-hover:opacity-100 transition">
                            <EditOutlined />
                          </div>
                        </div>
                      </Tooltip>
                    </Upload>
                  </div>

                  {/* User Name & Status */}
                  <Title level={4} className="mb-0">
                    {user.profile?.fullName || "Your Name"}
                  </Title>
                  <Text type="secondary" className="mb-2">
                    {user.email}
                  </Text>

                  <Tag
                    color="green"
                    icon={<CheckCircleOutlined />}
                    className="w-3/4 !text-center !m-0"
                  >
                    Active Account
                  </Tag>
                </div>
              </Card>

              {/* Additional Card for Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="mt-6 shadow-md rounded-lg border-0">
                  <Title level={5} className="flex items-center mb-4">
                    <LockOutlined className="mr-2 text-blue-500" /> Account
                    Security
                  </Title>
                  <Button
                    className="w-full mb-3"
                    onClick={() => setIsModalChangePasswordOpen(true)}
                  >
                    Change Password
                  </Button>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Profile Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="md:col-span-2 "
            >
              <Card className="shadow-md rounded-lg border-0 h-[100%]">
                <div className="flex justify-between items-center mb-6">
                  <Title level={4} className="mb-0">
                    Profile Information
                  </Title>
                  <Button
                    type="text"
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
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  {/* Full Name */}
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <UserOutlined className="mr-2" />
                      Full Name
                    </Text>
                    <Text strong className="text-lg">
                      {user.profile?.fullName || "Not specified"}
                    </Text>
                  </div>

                  {/* Email */}
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <MailOutlined className="mr-2" />
                      Email Address
                    </Text>
                    <Text strong className="text-lg">
                      {user.email}
                    </Text>
                  </div>

                  {/* Phone */}
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <PhoneOutlined className="mr-2" />
                      Phone Number
                    </Text>
                    <Text strong className="text-lg">
                      {user.profile?.phone || "Not specified"}
                    </Text>
                  </div>

                  {/* Gender */}
                  <div>
                    <Text
                      type="secondary"
                      className="mb-1 flex justify-start items-center"
                    >
                      <span className="mr-2">
                        {getGenderIcon(user.profile?.gender)}
                      </span>
                      Gender
                    </Text>
                    <Text strong className="text-lg">
                      {getGenderText(user.profile?.gender)}
                    </Text>
                  </div>
                </div>

                <Divider />

                {/* Activity Section (Optional) */}
                <div>
                  <Title level={5} className="flex items-center mb-3">
                    <IdcardOutlined className="mr-2 text-blue-500" /> Account
                    Details
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary" className="block">
                        Member Since
                      </Text>
                      <Text>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" className="block">
                        Last Updated
                      </Text>
                      <Text>
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Col>
                  </Row>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Edit Profile Modal */}
        <Modal
          title={
            <div className="flex items-center text-lg font-medium">
              <EditOutlined className="mr-2 text-blue-500" />
              Edit Your Profile
            </div>
          }
          open={isModalUpdateOpen}
          onCancel={() => setIsModalUpdateOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalUpdateOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => formUpdate.submit()}
              icon={<CheckCircleOutlined />}
            >
              Save Changes
            </Button>,
          ]}
          width={600}
          destroyOnClose
        >
          <Form
            requiredMark={false}
            form={formUpdate}
            layout="vertical"
            onFinish={handleUpdateProfile}
            className="mt-4"
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter your full name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number!" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Enter your phone number"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Select
                placeholder="Select your gender"
                size="large"
                options={[
                  {
                    value: "MALE",
                    label: (
                      <div className="flex items-center">
                        <FaMale className="mr-2 text-blue-500" />
                        Male
                      </div>
                    ),
                  },
                  {
                    value: "FEMALE",
                    label: (
                      <div className="flex items-center">
                        <FaFemale className="mr-2 text-pink-500" /> Female
                      </div>
                    ),
                  },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={
            <div className="flex items-center text-lg font-medium">
              <LockOutlined className="mr-2 text-blue-500" />
              Change Your Password
            </div>
          }
          open={isModalChangePasswordOpen}
          onCancel={() => setIsModalChangePasswordOpen(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsModalChangePasswordOpen(false);
                formChangePassword.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              variant="solid"
              color="danger"
              onClick={() => formChangePassword.submit()}
              icon={<CheckCircleOutlined />}
            >
              Change
            </Button>,
          ]}
          width={600}
          destroyOnClose
        >
          <Form
            requiredMark={false}
            form={formChangePassword}
            layout="vertical"
            onFinish={handleChangePassword}
            className="mt-4"
          >
            <Form.Item
              name="oldPassword"
              label="Old Password"
              rules={[
                { required: true, message: "Please enter your old password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter old password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Old Password"
              name="confirmpassword"
              dependencies={["oldPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("oldPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined className="text-gray-400" />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter your new password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter new password"
                size="large"
              />
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
}
