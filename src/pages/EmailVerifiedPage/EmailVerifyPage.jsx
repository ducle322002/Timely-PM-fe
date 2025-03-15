import React from "react";
import { Button, Result } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";

export default function EmailVerifiedPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen"
    >
      <Result
        status="success"
        title="Your email has been verified!"
        subTitle="Thank you for verifying your email address. You can now access all the features."
        extra={[
          <Button
            className="!bg-[#1968db]  !font-bold !text-white !rounded-lg"
            key="dashboard"
            onClick={() => navigate(route.login)}
          >
            Sign In
          </Button>,
        ]}
      />
    </motion.div>
  );
}
