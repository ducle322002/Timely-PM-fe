import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { Card, Spin } from "antd";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Dashboard Title */}
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Admin Dashboard
          </h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-500 text-sm mb-1">Total Projects</h2>
              <p className="text-3xl font-bold text-blue-600">
                {totalProjects}
              </p>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-500 text-sm mb-1">Completed Projects</h2>
              <p className="text-3xl font-bold text-green-600">
                {completedProjects}
              </p>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-500 text-sm mb-1">In Progress</h2>
              <p className="text-3xl font-bold text-yellow-500">
                {inProgressProjects}
              </p>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-500 text-sm mb-1">Total Users</h2>
              <p className="text-3xl font-bold text-purple-600">{totalUsers}</p>
            </Card>
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Project Progress Overview
            </h2>
            <Doughnut data={doughnutData} />
          </div>
        </>
      )}
    </div>
  );
}
