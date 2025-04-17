import React, { useState } from "react";
import HeaderWelcome from "../../components/HeaderWelcome/HeaderWelcome";
import FooterWelcome from "../../components/FooterWelcome/FooterWelcome";
import { motion } from "framer-motion";
import { Button, Form, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import userService from "./../../services/userService";
import { Input } from "antd";
import Cookies from "js-cookie";

const { TextArea } = Input;

import toast from "react-hot-toast";
import { route } from "../../routes";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalFeedbackVisible, setIsModalFeedbackVisible] = useState(false);
  const [isModalLoginRequiredVisible, setIsModalLoginRequiredVisible] =
    useState(false);

  // Check user login status
  const isLoggedIn = !!Cookies.get("token");
  const user = useSelector(selectUser);

  const handleOpenModalFeedback = () => {
    if (isLoggedIn) {
      setIsModalFeedbackVisible(true);
    } else {
      setIsModalLoginRequiredVisible(true);
    }
  };

  const handleCloseModalFeedback = () => {
    setIsModalFeedbackVisible(false);
    form.resetFields();
  };

  const handleCloseModalLoginRequired = () => {
    setIsModalLoginRequiredVisible(false);
  };

  const handleSendFeedback = async (values) => {
    try {
      const response = await userService.sendFeedback(values);
      toast.success("Feedback submitted successfully!");
      form.resetFields();
      handleCloseModalFeedback();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
      console.error("Error submitting feedback:", error);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Hero Section */}
      <motion.div
        className="container mx-auto px-4 py-12 md:py-20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-indigo-700 mb-6"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Welcome to Timely Project Management
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Organize tasks, boost productivity, and collaborate with ease.
          </motion.p>
        </div>

        {/* First Feature Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Streamline Your Workflow
              </h2>
              <p className="text-gray-700 mb-6">
                Found an issue in one of our products? Check if we already know
                about it so you can watch for updates, vote for it, and make use
                of any workaround.
              </p>
              <Link className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                Find out more about Our System
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <img
              src="https://www.prosoftly.com/wp-content/uploads/2020/01/task.png"
              alt="Task Management"
              className="rounded-xl  object-cover w-full"
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-10 text-center shadow-xl mb-20"
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Our Community Today
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Become a part of our community and start managing your projects with
            ease and efficiency.
          </p>
          <Button
            onClick={() =>
              isLoggedIn && user.role === "ADMIN"
                ? navigate(`${route.admin}/${route.dashboard}`)
                : isLoggedIn
                ? navigate(`${route.home}/${route.introWorkspace}`)
                : navigate(route.register)
            }
            className="!bg-white !text-indigo-700 !border-0 !px-8 !py-6 !h-auto !text-lg !font-bold !rounded-full !shadow-lg hover:!bg-indigo-50"
          >
            {isLoggedIn && user.role === "ADMIN"
              ? "Go To Admin Panel"
              : isLoggedIn
              ? "Go to Your Workspace"
              : "Join Us Now"}
          </Button>
        </motion.div>

        {/* Second Feature Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <div className="w-full md:w-1/2">
            <img
              src="https://www.prosoftly.com/wp-content/uploads/2019/12/small-business.png"
              alt="Team Collaboration"
              className="rounded-xl  object-cover w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Collaborate Effectively
              </h2>
              <p className="text-gray-700 mb-6">
                Our platform makes team collaboration seamless. Share tasks,
                communicate in real-time, and achieve your project goals
                together.
              </p>
              <Button
                onClick={handleOpenModalFeedback}
                className="!inline-flex !items-center !text-indigo-600 !font-semibold !hover:text-indigo-800 !transition-colors"
              >
                Give Us Feedback
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Feedback Modal */}
      <Modal
        open={isModalFeedbackVisible}
        onCancel={handleCloseModalFeedback}
        title={
          <h3 className="text-2xl font-bold text-center text-indigo-700">
            Share Your Feedback
          </h3>
        }
        footer={
          <div className="flex justify-end items-center gap-3">
            <Button
              onClick={handleCloseModalFeedback}
              className="!border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              className="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700"
            >
              Send Feedback
            </Button>
          </div>
        }
        className="rounded-lg"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendFeedback}
          className="mt-6"
        >
          <p className="text-gray-600 mb-6 text-center">
            We value your input! Please share your thoughts to help us improve.
          </p>
          <Form.Item
            name="feedback"
            rules={[
              { required: true, message: "Please provide your feedback!" },
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Write your feedback here..."
              className="rounded-lg border-gray-300 focus:border-indigo-500"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Login Required Modal */}
      <Modal
        open={isModalLoginRequiredVisible}
        onCancel={handleCloseModalLoginRequired}
        title={
          <h3 className="text-2xl font-bold text-center text-indigo-700">
            Login Required
          </h3>
        }
        footer={
          <div className="flex justify-end items-center gap-3">
            <Button
              onClick={handleCloseModalLoginRequired}
              className="!border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleCloseModalLoginRequired();
                navigate("/login");
              }}
              className="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700"
            >
              Log In
            </Button>
          </div>
        }
        className="rounded-lg"
        width={400}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="bg-blue-50 p-3 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-center">
            You need to be logged in to provide feedback. Please log in to
            continue.
          </p>
        </div>
      </Modal>
    </div>
  );
}
