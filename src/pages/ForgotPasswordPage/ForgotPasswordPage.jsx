import React, { useState } from "react";
import { Form, Input, Button, Typography, Spin } from "antd";
import { motion } from "framer-motion";
import {
  MailOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { route } from "../../routes";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    setLoading(true);
    setEmail(values.email);
    const params = {
      email: values.email,
    };

    try {
      const response = await authService.forgotPassword(params);
      console.log(response);
      setIsSubmitted(true);
      navigate(`${route.otpForgetPassword}/${values.email}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send password reset link"
      );
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
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
        {isSubmitted ? (
          <motion.div
            className="text-center py-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <MailOutlined className="text-green-600 text-2xl" />
            </div>

            <Title level={3} className="mb-3">
              Check Your Email
            </Title>

            <Text className="text-gray-600 block mb-6">
              We've sent a password reset link to
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </Text>

            <Button
              onClick={() => navigate(route.login)}
              type="primary"
              className="w-full rounded-lg h-12"
              size="large"
            >
              Back to Login
            </Button>

            <Button
              type="link"
              className="mt-4 text-gray-600"
              onClick={() => setIsSubmitted(false)}
            >
              Didn't receive the email? Try again
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <KeyOutlined className="text-blue-600 text-2xl" />
              </div>
            </div>

            <Title level={3} className="text-center mb-2">
              Forgot Password
            </Title>

            <Text className="block text-center mb-6 text-gray-500">
              Enter your email address and we'll send you a link to reset your
              password
            </Text>

            <Form
              layout="vertical"
              onFinish={handleForgotPassword}
              className="mb-4"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email address"
                  size="large"
                  className="rounded-lg h-12"
                />
              </Form.Item>

              <Form.Item className="mb-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full rounded-lg h-12"
                  size="large"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-6">
              <Link
                to={route.login}
                className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
              >
                <ArrowLeftOutlined className="mr-1" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>

      <Text className="mt-6 text-gray-500 text-xs">
        Contact support if you're having trouble with your account
      </Text>
    </motion.div>
  );
}
