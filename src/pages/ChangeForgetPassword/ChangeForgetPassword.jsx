import React, { useState, useRef } from "react";
import { Input, Button, Typography, Form } from "antd";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { route } from "../../routes";
import {
  CheckCircleFilled,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import authService from "../../services/authService";

const { Title, Text } = Typography;

export default function ChangeForgetPassword() {
  const { email } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Function to mask email for privacy
  function maskEmail(email) {
    if (!email) return "your email";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.substring(0, 2) +
      "*".repeat(Math.max(username.length - 4, 1)) +
      username.substring(username.length - 2);
    return `${maskedUsername}@${domain}`;
  }

  const maskedEmail = maskEmail(email);

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        email: email,
        password: values.newPassword,
      };

      const response = await authService.changeForgotPassword(params);
      console.log(response.data);
      setResetSuccess(true);

      // Show success animation before redirecting
      setTimeout(() => {
        navigate(route.login, {
          state: { email: email },
        });
      }, 1500);

      toast.success("Password changed successfully!");
    } catch (error) {
      console.error(
        "Password Reset Error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {resetSuccess ? (
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircleFilled className="text-green-500 text-6xl mb-4" />
            <Title level={3} className="mb-2 text-gray-800">
              Password Reset Successful
            </Title>
            <Text className="text-gray-500">Redirecting you to login...</Text>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <LockOutlined className="text-blue-600 text-2xl" />
              </div>
            </div>

            <Title level={3} className="text-center mb-2 text-gray-800">
              Create New Password
            </Title>

            <Text className="block text-center mb-6 text-gray-500">
              Please set a new password for your account
              <br />
              <span className="font-medium text-gray-700">{maskedEmail}</span>
            </Text>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter your new password" },
                ]}
              >
                <Input.Password
                  ref={newPasswordRef}
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="New Password"
                  size="large"
                  className="rounded-lg h-12"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
                className="mt-4"
              >
                <Input.Password
                  ref={confirmPasswordRef}
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Confirm Password"
                  size="large"
                  className="rounded-lg h-12"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                className="rounded-lg font-medium h-12 mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Processing..." : "Reset Password"}
              </Button>
            </Form>
          </>
        )}
      </motion.div>

      <Text className="mt-6 text-gray-500 text-xs">
        Having trouble? Contact our support team for assistance.
      </Text>
    </motion.div>
  );
}
