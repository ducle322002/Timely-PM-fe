import React from "react";
import HeaderWelcome from "../../components/HeaderWelcome/HeaderWelcome";
import FooterWelcome from "../../components/FooterWelcome/FooterWelcome";
import { motion } from "framer-motion";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
export default function WelcomePage() {
  const navigate = useNavigate();
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
            onClick={() => navigate("/register")}
            className="!bg-[#1968db] !px-[2%] !py-4 !font-bold !text-white !text-lg !rounded-lg"
          >
            Join Us
          </Button>
        </div>
        <div className="container mx-auto">
          <motion.div className="flex justify-between items-center gap-[10%] mt-[1%]">
            <div>
              <p className="text-xl font-bold mt-3 text-end max-w-2xl opacity-90">
                Organize tasks, boost productivity, and collaborate with ease.
              </p>
              <div className="mt-[5%] text-end">
                <Link className="text-xl font-bold text-[#1968db]  hover:underline">
                  Learn How to use our System
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
    </>
  );
}
