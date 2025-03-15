import React from "react";
import { Card, Form, Input, Button } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { route } from "../../routes";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await authService.login(values);
      //   Cookies.set("token", response.token);
      //   Cookies.set("user", JSON.stringify(response.user));
      //   navigate(route.home);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response.data);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center bg-white rounded-lg"
        style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
      >
        <img
          src="https://img.freepik.com/premium-vector/checklist-complete-project-task-accomplish-work-checkmark_980117-4411.jpg"
          alt=""
          className="w-[50%]"
        />
        <Card
          title={
            <div className="text-center text-[#1968db] !border-none  font-bold">
              Sign In to Continue
            </div>
          }
          className=" bg-white !border-none w-[50%]"
        >
          <Form
            requiredMark={false}
            form={form}
            layout="vertical"
            name="Sign In"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                placeholder="Username"
                prefix={<UserOutlined className="site-form-item-icon" />}
                className="!w-full !p-3 !border !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                className="!w-full !p-3 !border !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>
            <div className="!text-end mb-[5%] !text-sm">
              <Link>Forgot Password ?</Link>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !rounded-2xl !py-[5%] !hover:bg-blue-600 !transition !duration-200"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <div className="!text-center !text-sm mt-[5%]">
            Don't have an account ? <Link to="/register">Sign Up</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
