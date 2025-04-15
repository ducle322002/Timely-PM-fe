import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Button, Card, Typography, Switch } from "antd";
import { motion } from "framer-motion";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SettingPage() {
  const { darkMode, toggleDisplayMode } = useContext(ThemeContext);

  return (
    <motion.div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "dark" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className="shadow-lg rounded-lg p-6 dark:bg-gray-800 dark:text-white min-w-[700px]"
        style={{
          textAlign: "center",
          backgroundColor: darkMode ? "#1a202c" : "#ffffff",
          color: darkMode ? "#e2e8f0" : "#000000",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={3} className="dark:text-white">
            Settings
          </Title>
          <Text className="text-lg mb-4 block">
            Toggle between Light and Dark Mode
          </Text>
          <div className="flex justify-center items-center gap-[5%]">
            <Switch
              checked={darkMode}
              onChange={toggleDisplayMode}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
              className="mb-4"
            />
            <Button
              type="primary"
              onClick={toggleDisplayMode}
              className="!rounded-lg"
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
