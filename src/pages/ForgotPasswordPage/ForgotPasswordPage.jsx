import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (values) => {
    setLoading(true);
    console.log("Email submitted:", values.email);
    const params = {
      email: values.email,
    };
    try {
      // Simulate API call
      const response = authService.forgotPassword(params);
      console.log("API response:", response.data);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error(error.response.data.message);
      message.error("Failed to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className="shadow-lg rounded-lg p-8 dark:bg-gray-800 dark:text-white"
        style={{
          maxWidth: "400px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={3} className="dark:text-white">
            Forgot Password
          </Title>
          <Text className="text-gray-600 dark:text-gray-300 block mb-6">
            Enter your email address to receive a password reset link.
          </Text>
          <Form
            layout="vertical"
            onFinish={handleForgotPassword}
            className="text-left"
            requiredMark={false}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full !rounded-lg"
            >
              Send Reset Link
            </Button>
          </Form>
        </motion.div>
      </Card>
    </motion.div>
  );
}
