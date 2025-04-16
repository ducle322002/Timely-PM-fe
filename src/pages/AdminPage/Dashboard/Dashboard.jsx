import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { Card, Spin } from "antd";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  UserOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDataDashboard();
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalProjects = data.totalProjects || 0;
  const completedProjects = data.totalProjectsCompleted || 0;
  const inProgressProjects = totalProjects - completedProjects;
  const totalUsers = data.totalUsers || 0;

  const doughnutData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        label: "Projects",
        data: [completedProjects, inProgressProjects],
        backgroundColor: ["#22c55e", "#facc15"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const cardData = [
    {
      title: "Total Projects",
      value: totalProjects,
      color: "text-blue-600",
      icon: <ProjectOutlined className="text-xl" />,
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      color: "text-green-600",
      icon: <CheckCircleOutlined className="text-xl" />,
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      color: "text-yellow-500",
      icon: <SyncOutlined className="text-xl" />,
    },
    {
      title: "Total Users",
      value: totalUsers,
      color: "text-purple-600",
      icon: <UserOutlined className="text-xl" />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Admin Dashboard
          </h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {cardData.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  hoverable
                  className="rounded-2xl shadow-md border border-gray-100 transition-transform transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-gray-500 text-sm mb-1">
                        {card.title}
                      </h2>
                      <p className={`text-3xl font-bold ${card.color}`}>
                        {card.value}
                      </p>
                    </div>
                    <div className="text-gray-400">{card.icon}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Doughnut Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Project Progress Overview
            </h2>
            <Doughnut data={doughnutData} />
          </motion.div>
        </>
      )}
    </div>
  );
}
