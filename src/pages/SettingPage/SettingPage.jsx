import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Card,
  Typography,
  Switch,
  Divider,
  Avatar,
  Badge,
  Tabs,
  List,
  Radio,
  Tooltip,
  Select,
} from "antd";
import { motion } from "framer-motion";
import {
  BulbOutlined,
  BulbFilled,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  ToolOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function SettingPage() {
  const { darkMode, toggleDisplayMode } = useContext(ThemeContext);
  const user = useSelector(selectUser);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`min-h-screen py-12 px-4 ${darkMode ? "dark" : ""}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants}>
          <Title
            level={2}
            className={`mb-6 ${darkMode ? "text-gray-100" : ""}`}
          >
            Settings
          </Title>
        </motion.div>

        <Tabs
          defaultActiveKey="appearance"
          className={darkMode ? "dark-tabs" : ""}
          items={[
            {
              key: "appearance",
              label: (
                <span>
                  <BulbOutlined /> Appearance
                </span>
              ),
              children: (
                <motion.div variants={itemVariants}>
                  <Card
                    className={`shadow-md rounded-lg ${
                      darkMode ? "bg-gray-800 text-gray-100" : ""
                    }`}
                    bordered={!darkMode}
                  >
                    <div className="mb-8">
                      <Title
                        level={4}
                        className={darkMode ? "text-gray-100" : ""}
                      >
                        Theme
                      </Title>
                      <Paragraph
                        className={`mb-6 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Choose between light and dark mode for your workspace
                      </Paragraph>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            !darkMode ? "border-blue-500" : "border-gray-600"
                          }`}
                          onClick={() => darkMode && toggleDisplayMode()}
                        >
                          <div className="bg-white p-4">
                            <div className="h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                              <div className="w-3/4 bg-blue-100 h-6 rounded"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="p-3 bg-gray-50 flex justify-between items-center">
                            <Text strong>Light Mode</Text>
                            <Radio checked={!darkMode} />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            darkMode ? "border-blue-500" : "border-gray-600"
                          }`}
                          onClick={() => !darkMode && toggleDisplayMode()}
                        >
                          <div className="bg-gray-900 p-4">
                            <div className="h-32 bg-gray-800 rounded mb-2 flex items-center justify-center">
                              <div className="w-3/4 bg-gray-700 h-6 rounded"></div>
                            </div>
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          </div>
                          <div className="p-3 bg-gray-800 flex justify-between items-center">
                            <Text strong className="text-gray-200">
                              Dark Mode
                            </Text>
                            <Radio checked={darkMode} />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <Divider className={darkMode ? "border-gray-700" : ""} />
                  </Card>
                </motion.div>
              ),
            },

            {
              key: "help",
              label: (
                <span>
                  <QuestionCircleOutlined /> Help & Support
                </span>
              ),
              children: (
                <motion.div variants={itemVariants}>
                  <Card
                    className={`shadow-md rounded-lg ${
                      darkMode ? "bg-gray-800 text-gray-100" : ""
                    }`}
                    bordered={!darkMode}
                  >
                    <Title
                      level={4}
                      className={darkMode ? "text-gray-100" : ""}
                    >
                      Need Help?
                    </Title>
                    <Paragraph
                      className={`mb-6 ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Get assistance with your account or learn how to use our
                      platform effectively
                    </Paragraph>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <QuestionCircleOutlined
                          className={`text-2xl mb-4 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <Title
                          level={5}
                          className={darkMode ? "text-gray-100" : ""}
                        >
                          Help Center
                        </Title>
                        <Text
                          className={
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }
                        >
                          Browse our documentation and FAQ
                        </Text>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <ToolOutlined
                          className={`text-2xl mb-4 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <Title
                          level={5}
                          className={darkMode ? "text-gray-100" : ""}
                        >
                          Contact Support
                        </Title>
                        <Text
                          className={
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }
                        >
                          Reach our team for personalized help
                        </Text>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ),
            },
          ]}
        />
      </div>

      <style jsx>{`
        .dark .ant-tabs-tab {
          color: #a0aec0;
        }

        .dark .ant-tabs-tab.ant-tabs-tab-active {
          color: #63b3ed;
        }

        .dark .ant-tabs-ink-bar {
          background: #63b3ed;
        }

        .dark-list .ant-list-item {
          border-color: #2d3748;
        }

        .dark .ant-select-selector {
          background-color: #2d3748 !important;
          border-color: #4a5568 !important;
        }

        .dark .ant-card {
          background-color: #1a202c;
          color: #e2e8f0;
          border: none;
        }
      `}</style>
    </motion.div>
  );
}
