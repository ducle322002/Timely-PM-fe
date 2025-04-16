import React, { useState } from "react";
import HeaderWelcome from "../../components/HeaderWelcome/HeaderWelcome";
import FooterWelcome from "../../components/FooterWelcome/FooterWelcome";
import { motion } from "framer-motion";
import { Button, Form, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import userService from "./../../services/userService";
import { Input } from "antd";
import Cookies from "js-cookie"; // Import js-cookie

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

  // Simulate user login status (replace with actual logic)
  const isLoggedIn = !!Cookies.get("token"); // Check if the token exists in cookies
  const user = useSelector(selectUser); // Get the user role from cookies
  const handleOpenModalFeedback = () => {
    if (isLoggedIn) {
      setIsModalFeedbackVisible(true);
    } else {
      setIsModalLoginRequiredVisible(true);
    }
  };

  const handleCloseModalFeedback = () => {
    setIsModalFeedbackVisible(false);
    form.resetFields(); // Reset form fields when closing the modal
  };

  const handleCloseModalLoginRequired = () => {
    setIsModalLoginRequiredVisible(false);
  };

  const handleSendFeedback = async (values) => {
    try {
      // Call your API to send feedback here
      const response = await userService.sendFeedback(values);
      toast.success("Feedback submitted successfully!");
      console.log("Feedback submitted:", values);
      console.log("API response:", response);
      form.resetFields();
      handleCloseModalFeedback();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting feedback");
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center justify-center flex-grow px-[1%] h-full "
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-center mt-[5%] drop-shadow-sm text-[#1968db]">
            Welcome to Timely Project Management
          </h1>
          <motion.div className="flex justify-between items-center gap-[10%] mt-[1%]">
            <img
              src="https://www.prosoftly.com/wp-content/uploads/2020/01/task.png"
              alt=""
              className="h-100 w-100"
            />
            <div>
              <p className="text-xl font-bold mt-3 text-start max-w-2xl opacity-90">
                Found an issue in one of our products? Check if we already know
                about it so you can watch for updates, vote for it, and make use
                of any workaround
              </p>
              <div className="mt-[5%]">
                <Link className="text-xl font-bold text-[#1968db] hover:underline">
                  Find out more about Our System
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-gradient-to-b from-[#ddeafe] to-[#ddeafe] p-[3%] rounded-lg w-full flex flex-col justify-center items-center">
          <p className="text-xl font-bold mt-3 text-start max-w-2xl mb-[1%] text-black">
            Become a part of our community and start managing your projects
          </p>
          <Button
            onClick={() =>
              isLoggedIn && user.role === "ADMIN"
                ? navigate(`${route.admin}/${route.dashboard}`)
                : isLoggedIn
                ? navigate(`${route.home}/${route.introWorkspace}`)
                : navigate(route.register)
            }
            className="!bg-[#1968db] !px-[2%] !py-4 !font-bold !text-white !text-lg !rounded-lg"
          >
            {isLoggedIn && user.role === "ADMIN"
              ? "Go To Admin Panel"
              : isLoggedIn
              ? "Go to Your Workspace"
              : "Join Us Now"}
          </Button>
        </div>
        <div className="container mx-auto">
          <motion.div className="flex justify-between items-center gap-[10%] mt-[1%]">
            <div>
              <p className="text-xl font-bold mt-3 text-end max-w-2xl opacity-90">
                Organize tasks, boost productivity, and collaborate with ease.
              </p>
              <div className="mt-[5%] text-end">
                <Link
                  className="text-xl font-bold text-[#1968db]  hover:underline"
                  onClick={() => handleOpenModalFeedback()}
                >
                  Give Us A Feedback
                </Link>
              </div>
            </div>
            <img
              src="https://www.prosoftly.com/wp-content/uploads/2019/12/small-business.png"
              alt=""
              className="h-100 w-140"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Feedback Modal */}
      <Modal
        open={isModalFeedbackVisible}
        footer={
          <div className="flex justify-end items-center gap-5 ">
            <Button onClick={handleCloseModalFeedback}>Close</Button>
            <Button onClick={() => form.submit()} type="primary" color="blue">
              Send
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSendFeedback}>
          <h1 className="text-2xl font-bold text-center mb-4">Feedback Form</h1>
          <p className="text-center mb-4">
            We value your feedback! Please let us know your thoughts.
          </p>
          <Form.Item
            name="feedback"
            rules={[
              { required: true, message: "Please provide your feedback!" }, // Validation rule
            ]}
          >
            <TextArea rows={4} placeholder="Write your feedback here..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Login Required Modal */}
      <Modal
        open={isModalLoginRequiredVisible}
        footer={
          <div className="flex justify-end items-center gap-5 ">
            <Button onClick={handleCloseModalLoginRequired}>Close</Button>
            <Button
              type="primary"
              onClick={() => {
                handleCloseModalLoginRequired();
                navigate("/login");
              }}
            >
              Login
            </Button>
          </div>
        }
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login Required</h1>
        <p className="text-center mb-4">
          You need to be logged in to provide feedback. Please log in to
          continue.
        </p>
      </Modal>
    </>
  );
}
