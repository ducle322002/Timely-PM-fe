import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Typography, Spin } from "antd";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { route } from "../../routes";
import { CheckCircleFilled, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function OTPLoginPage() {
  const { email } = useParams();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const location = useLocation();
  // const email = location.state?.email || "your email";
  const maskedEmail = maskEmail(email);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(90);

  // Initialize refs for the input fields
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Function to mask email for privacy
  function maskEmail(email) {
    if (!email || email === "your email") return "your email";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.substring(0, 2) +
      "*".repeat(Math.max(username.length - 4, 1)) +
      username.substring(username.length - 2);
    return `${maskedUsername}@${domain}`;
  }

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to next input if value exists
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is numeric and has appropriate length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split("");
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });

      setOtp(newOtp);

      // Focus on the appropriate input after paste
      if (digits.length < 6) {
        inputRefs.current[digits.length].focus();
      } else {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length === 6 && !otp.includes("")) {
      setIsLoading(true);
      try {
        const params = {
          email: email,
          otp: Number(code),
        };

        const response = await authService.verifyOTP(params);
        console.log(response.data);

        // Show success animation before redirecting
        if (response.data === true) {
          setVerificationSuccess(true);
          setTimeout(() => {
            navigate(route.login, {
              state: { email: email },
            });
          }, 1200);
          toast.success("OTP Verified Successfully");
        } else {
          setVerificationSuccess(false);
          toast.error("Invalid OTP. Please try again.");
        }
      } catch (error) {
        console.error(
          "Verification Error:",
          error.response?.data?.message || error.message
        );
        toast.error(
          error.response?.data?.message || "Invalid OTP. Please try again."
        );

        // Clear OTP fields on error
        setOtp(Array(6).fill(""));
        inputRefs.current[0].focus();
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter the complete 6-digit OTP.");
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    try {
      setIsLoading(true);
      const params = { email: email };
      await authService.resendOTP(params);
      toast.success("A new OTP has been sent to your email");

      // Disable the button and start the timer
      setIsResendDisabled(true);
      const timerInterval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsResendDisabled(false);
            setResendTimer(90); // Reset timer
            return 90;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(
        "Resend OTP Error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we should enable the Verify button
  const isVerifyEnabled = otp.every((digit) => digit !== "") && !isLoading;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {verificationSuccess ? (
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircleFilled className="text-green-500 text-6xl mb-4" />
            <Title level={3} className="mb-2 text-gray-800">
              Verification Successful
            </Title>
            <Text className="text-gray-500">Redirecting you to login...</Text>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <MailOutlined className="text-blue-600 text-2xl" />
              </div>
            </div>

            <Title level={3} className="text-center mb-2 text-gray-800">
              OTP Verification
            </Title>

            <Text className="block text-center mb-6 text-gray-500">
              Enter the 6-digit code we sent to <br />
              <span className="font-medium text-gray-700">{maskedEmail}</span>
            </Text>

            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : null}
                  className="w-12 sm:w-14 h-14 text-center text-xl font-semibold border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="primary"
              block
              size="large"
              onClick={handleVerify}
              disabled={!isVerifyEnabled}
              loading={isLoading}
              className={`rounded-lg font-medium h-12 ${
                isVerifyEnabled
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="flex justify-center items-center mt-6">
              <Text type="secondary" className="text-gray-500">
                Didn't receive the code?
              </Text>
              <Button
                type="link"
                onClick={handleResendOTP}
                disabled={isResendDisabled || isLoading}
                className={
                  isResendDisabled || isLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                }
              >
                {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </Button>
            </div>
          </>
        )}
      </motion.div>

      <Text className="mt-6 text-gray-500 text-xs">
        Having trouble? Contact our support team for assistance.
      </Text>
    </motion.div>
  );
}
