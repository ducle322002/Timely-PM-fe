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
  const [loading, setLoading] = useState(false);
  const [loadingGG, setLoadingGG] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleGoogleLogin = async () => {
    setLoadingGG(true);
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
    } finally {
      setLoadingGG(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-md"
      >
        <div className="w-full hidden md:block">
          <img
            src="https://img.freepik.com/premium-vector/checklist-complete-project-task-accomplish-work-checkmark_980117-4411.jpg"
            alt="Illustration"
            className="w-full h-full object-fill"
          />
        </div>

        <div className=" w-full p-8 md:p-12">
          <h2 className="text-center text-3xl font-bold text-blue-600 mb-6">
            Welcome Back
          </h2>

          <Form
            form={form}
            layout="vertical"
            name="Sign In"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                className="!p-3 !rounded-xl border-gray-300"
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
                prefix={<LockOutlined />}
                placeholder="Password"
                className="!p-3 !rounded-xl border-gray-300"
              />
            </Form.Item>

            <div className="text-right text-sm mb-4">
              <Link className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !py-3 !rounded-xl bg-blue-500 hover:bg-blue-600 transition"
                loading={loading}
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center text-gray-500 my-4">or</div>

            <Form.Item>
              <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                loading={loadingGG}
              >
                <img
                  src="https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo-thumbnail.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="font-medium text-gray-700">
                  Sign in with Google
                </span>
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                disabled
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub"
                  className="w-5 h-5"
                />
                <span className="font-medium">
                  Sign in with GitHub (Coming soon)
                </span>
              </Button>
            </Form.Item>

            <div className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </div>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
