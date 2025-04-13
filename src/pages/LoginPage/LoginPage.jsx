import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { route } from "../../routes";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./LoginPage.scss";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { auth } from "../../config/firebase";
export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await authService.login(values);
      Cookies.set("token", response.data.token);

      const user = {
        username: response.data.username,
        id: response.data.id,
        role: response.data.role,
      };
      Cookies.set("user", JSON.stringify(user));
      if (response.data.role === "ADMIN") {
        navigate(`${route.admin}/${route.adminUser}`);
      } else {
        navigate(`${route.home}/${route.introWorkspace}`);
      }
      dispatch(login(user));
      console.log(response);
      console.log(response.data);
      toast.success(response.message);
    } catch (error) {
      console.error("Login Error:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const accessToken = await response.user.getIdToken(true);
      console.log(accessToken);
      const params = {
        accessToken: accessToken,
      };
      const responseLogin = await authService.loginWithGoogle(params);
      console.log("Google login response:", responseLogin);
      Cookies.set("token", responseLogin.data.token);
      const user = {
        username: responseLogin.data.username,
        id: responseLogin.data.id,
        role: responseLogin.data.role,
      };
      Cookies.set("user", JSON.stringify(user));
      dispatch(login(user));
      console.log(responseLogin);
      navigate(`${route.home}/${route.introWorkspace}`);
      toast.success("Logged in with Google!");
      navigate(`${route.home}/${route.introWorkspace}`);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center bg-white rounded-lg w-[70%]"
        style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
      >
        <div className="w-[50%]">
          <img
            src="https://img.freepik.com/premium-vector/checklist-complete-project-task-accomplish-work-checkmark_980117-4411.jpg"
            alt=""
            className="w-[100%] object-cover"
          />
        </div>
        <Card
          title={
            <div className="text-center text-[#1968db] !border-none text-2xl  font-bold">
              Sign In
            </div>
          }
          className=" bg-white !border-none w-[50%] card-antd-login"
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
                className="w-full !rounded-2xl !py-[4%] !hover:bg-blue-600 !transition !duration-200"
              >
                Sign In
              </Button>
            </Form.Item>
            <Form.Item className="!text-center flex justify-center items-center !w-full">
              <GoogleButton type="dark" onClick={handleGoogleLogin} />
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
