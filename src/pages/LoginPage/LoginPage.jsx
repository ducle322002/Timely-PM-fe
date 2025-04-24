import React, { useState } from "react";
import { Form, Input, Button, Divider } from "antd";
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
import {
  auth,
  provider,
  facebookProvider,
  signInWithPopup,
  githubProvider,
} from "../../config/firebase";
import { GithubAuthProvider } from "@firebase/auth";

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingGG, setLoadingGG] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [loadingGit, setLoadingGit] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("loading");
      const response = await authService.login(values);
      Cookies.set("token", response.data.token);
      console.log(response);
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
      toast.success(response.message || "Login successful!");
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Login failed");
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
      const response = await signInWithPopup(auth, provider);
      const accessToken = await response.user.getIdToken(true);
      console.log(response);
      const params = { accessToken };
      const responseLogin = await authService.loginWithGoogle(params);

      Cookies.set("token", responseLogin.data.token);
      const user = {
        username: responseLogin.data.username,
        id: responseLogin.data.id,
        role: responseLogin.data.role,
      };
      Cookies.set("user", JSON.stringify(user));
      dispatch(login(user));
      navigate(`${route.home}/${route.introWorkspace}`);
      toast.success("Logged in with Google!");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    } finally {
      setLoadingGG(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoadingFb(true);
    try {
      const response = await signInWithPopup(auth, facebookProvider);
      const accessToken = await response.user.getIdToken(true);
      console.log(response);
      const params = { accessToken };
      const responseLogin = await authService.loginWithFacebook(params);

      Cookies.set("token", responseLogin.data.token);
      const user = {
        username: responseLogin.data.username,
        id: responseLogin.data.id,
        role: responseLogin.data.role,
      };
      Cookies.set("user", JSON.stringify(user));
      dispatch(login(user));
      navigate(`${route.home}/${route.introWorkspace}`);
      toast.success("Logged in with Facebook!");
    } catch (error) {
      console.error("Facebook login failed:", error);
      toast.error("Facebook login failed");
    } finally {
      setLoadingFb(false);
    }
  };
  const handleGithubLogin = async () => {
    setLoadingGit(true);
    try {
      const response = await signInWithPopup(auth, githubProvider);
      const accessToken = await response.user.getIdToken(true);

      console.log(response);
      const params = { accessToken };
      const responseLogin = await authService.loginGithub(params);

      Cookies.set("token", responseLogin.data.token);
      const user = {
        username: responseLogin.data.username,
        id: responseLogin.data.id,
        role: responseLogin.data.role,
      };
      Cookies.set("user", JSON.stringify(user));
      dispatch(login(user));
      navigate(`${route.home}/${route.introWorkspace}`);
      toast.success("Logged in with Github!");
    } catch (error) {
      console.error("Github login failed:", error);
      toast.error("Github login failed");
    } finally {
      setLoadingGit(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-7xl shadow-2xl"
      >
        {/* Left side - Illustration */}
        <div className="w-full md:w-1/2 hidden md:block relative overflow-hidden">
          <div className="absolute inset-0 mix-blend-multiply z-10"></div>
          <img
            src="https://img.freepik.com/premium-vector/checklist-complete-project-task-accomplish-work-checkmark_980117-4411.jpg"
            alt="Illustration"
            className="w-full h-full"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">
                Sign in to continue to your account
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              requiredMark={false}
              className="space-y-4"
            >
              <Form.Item
                name="username"
                label={
                  <span className="text-gray-700 font-medium">Username</span>
                }
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your username"
                  className="!py-3 !px-4 !rounded-xl !border-gray-300"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-gray-700 font-medium">Password</span>
                }
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your password"
                  className="!py-3 !px-4 !rounded-xl !border-gray-300"
                  size="large"
                />
              </Form.Item>

              <div className="flex justify-end">
                <Link
                  to={route.forgotPassword}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Form.Item className="mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full !h-12 !text-base !font-medium !rounded-xl !bg-indigo-600 hover:!bg-indigo-700 !border-0 !shadow-lg"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Divider className="!my-6">
              <span className="text-gray-500">or continue with</span>
            </Divider>

            <div className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                loading={loadingGG}
                className="w-full !h-12 flex items-center justify-center gap-3 !rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                icon={
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                  />
                }
              >
                <span className="font-medium text-gray-700">
                  Sign in with Google
                </span>
              </Button>

              <Button
                className="w-full !h-12 flex items-center justify-center gap-3 !rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                icon={
                  <img
                    src="https://github.githubassets.com/favicons/favicon.png"
                    alt="GitHub"
                    className="w-5 h-5 "
                  />
                }
                onClick={handleGithubLogin}
                loading={loadingGit}
              >
                <span className="font-medium">Sign in with GitHub</span>
              </Button>

              <Button
                className="w-full !h-12 flex items-center justify-center gap-3 !rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                icon={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                }
                loading={loadingFb}
                onClick={handleFacebookLogin}
              >
                <span className="font-medium">Sign in with Facebook</span>
              </Button>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
