import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { route } from "../../routes";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Card, Form, Input, Button, Select } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import "./RegisterPage.scss";
export default function RegisterPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await authService.register(values);
      //   Cookies.set("token", response.token);
      //   Cookies.set("user", JSON.stringify(response.user));
      //   navigate(route.home);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Register Error:", error);
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
        className="flex justify-center items-center bg-white rounded-lg w-[70%] my-[5%]"
        style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
      >
        <div className="w-[50%]">
          <img
            src="https://img.freepik.com/free-vector/illustration-multitasking-person_23-2148405070.jpg?semt=ais_hybrid"
            alt=""
            className="w-[100%] object-cover"
          />
        </div>
        <Card
          title={
            <div className="text-center text-[#1968db] !border-none text-2xl font-bold">
              Sign Up
            </div>
          }
          className="bg-white !border-none w-[50%] card-antd-register"
        >
          <Form
            requiredMark={false}
            form={form}
            layout="vertical"
            name="Register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input
                placeholder="Full Name"
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
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
                placeholder="Select Gender"
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              >
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                placeholder="Email"
                prefix={<MailOutlined className="site-form-item-icon" />}
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input
                placeholder="Phone"
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>

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
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
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
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm_password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                className="!w-full !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !rounded-2xl !py-[4%] !hover:bg-blue-600 !transition !duration-200"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div className="!text-center !text-sm mt-[5%]">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
