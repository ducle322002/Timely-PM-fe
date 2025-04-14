import React, { useState } from "react";
import { Input, Button, Typography, message } from "antd";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { route } from "../../routes";

const { Title, Text } = Typography;

export default function OTPLoginPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(90); // 90 seconds
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value exists
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    console.log("OTP Code:", code);
    if (code.length === 6 && !otp.includes("")) {
      try {
        const params = {
          email: email,
          otp: Number(code),
        };
        console.log(params.email);
        const response = await authService.verifyOTP(params);
        console.log(response);
        toast.success("OTP Verified Successfully");

        navigate(route.login, {
          state: { email: email },
        });
      } catch (error) {
        console.error("Verification Error:", error.response.data.message);
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please enter the complete 6-digit OTP.");
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    try {
      const params = {
        email: email,
      };
      const response = await authService.resendOTP(params);
      console.log(response);
      toast.success("OTP Resent Successfully");

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
    }
  };

  const onChange = (text) => {
    console.log("onChange:", text);
  };
  const onInput = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps = {
    onChange,
    onInput,
  };
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl mx-auto">
        <Title level={4} className="text-center mb-1 text-gray-700">
          OTP Verification
        </Title>
        <Text className="block text-center mb-6 text-gray-500">
          Enter the 6-digit code we sent to your phone/email.
        </Text>

        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <React.Fragment key={index}>
              <Input
                id={`otp-input-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 sm:w-20 h-16 text-center text-2xl font-bold border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
                autoFocus={index === 0}
              />
              {index !== otp.length - 1 && (
                <div className="text-2xl text-gray-400 font-semibold select-none">
                  –
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <Text type="secondary">Didn't receive the code?</Text>
          <Button
            type="link"
            onClick={handleResendOTP}
            disabled={isResendDisabled}
            className={
              isResendDisabled ? "text-gray-400 cursor-not-allowed" : ""
            }
          >
            {isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </Button>
        </div>

        <Button
          type="primary"
          block
          size="large"
          className="rounded-xl font-medium"
          onClick={handleVerify}
        >
          Verify
        </Button>
      </div>
    </motion.div>
  );
}
