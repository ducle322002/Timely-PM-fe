import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { route } from "../../routes";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Form, Input, Button, Select, Divider } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import "./RegisterPage.scss";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    const requestData = {
      user: {
        username: values.username,
        password: values.password,
        email: values.email,
      },
      userInfo: {
        avatarUrl: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
        gender: values.gender,
        phone: values.phone,
        fullName: values.fullName,
      },
    };

    try {
      toast.dismiss(loadingToast);
      const response = await authService.register(requestData);
      navigate(`${route.otpPage}/${values.email}`, {
        state: { email: values.email },
      });
      toast.success(
        response.message || "Registration successful! Please verify your email."
      );
    } catch (error) {
      console.error("Register Error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden w-full max-w-7xl shadow-xl"
      >
        {/* Left Side - Illustration */}
        <div className="w-full md:w-1/2 md:block  items-center flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/illustration-multitasking-person_23-2148405070.jpg?semt=ais_hybrid"
            alt="Multi-tasking illustration"
            className="w-full h-full py-[10%]"
          />
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 py-8 px-6 md:px-12 overflow-y-auto max-h-screen">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-indigo-700">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in your details to get started
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form
              form={form}
              layout="vertical"
              name="register"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              requiredMark={false}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label={
                    <span className="text-gray-700 font-medium">Full Name</span>
                  }
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Enter your full name"
                    className="!py-2 !px-4 !rounded-lg !border-gray-300"
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label={
                    <span className="text-gray-700 font-medium">Gender</span>
                  }
                  rules={[
                    { required: true, message: "Please select your gender" },
                  ]}
                >
                  <Select
                    placeholder="Select gender"
                    className="!rounded-lg !border-gray-300"
                  >
                    <Select.Option value="MALE">Male</Select.Option>
                    <Select.Option value="FEMALE">Female</Select.Option>
                    <Select.Option value="OTHER">Other</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={
                  <span className="text-gray-700 font-medium">
                    Email Address
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email address"
                  type="email"
                  className="!py-2 !px-4 !rounded-lg !border-gray-300"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={
                  <span className="text-gray-700 font-medium">
                    Phone Number
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Enter your phone number"
                  className="!py-2 !px-4 !rounded-lg !border-gray-300"
                />
              </Form.Item>

              <Divider className="!my-6">
                <span className="text-gray-500 text-sm">
                  Account Information
                </span>
              </Divider>

              <Form.Item
                name="username"
                label={
                  <span className="text-gray-700 font-medium">Username</span>
                }
                rules={[
                  { required: true, message: "Please enter a username" },
                  { min: 3, message: "Username must be at least 3 characters" },
                ]}
              >
                <Input
                  prefix={<UserAddOutlined className="text-gray-400" />}
                  placeholder="Choose a username"
                  className="!py-2 !px-4 !rounded-lg !border-gray-300"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="password"
                  label={
                    <span className="text-gray-700 font-medium">Password</span>
                  }
                  rules={[
                    { required: true, message: "Please enter a password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Create a password"
                    className="!py-2 !px-4 !rounded-lg !border-gray-300"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm_password"
                  label={
                    <span className="text-gray-700 font-medium">
                      Confirm Password
                    </span>
                  }
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm your password"
                    className="!py-2 !px-4 !rounded-lg !border-gray-300"
                  />
                </Form.Item>
              </div>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full !h-12 !bg-indigo-600 hover:!bg-indigo-700 !border-0 !rounded-lg !font-medium !text-base !shadow-lg"
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
