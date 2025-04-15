import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Timeline, Spin } from "antd";
import { Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import projectService from "../../services/projectService";

export default function ProjectLogHistory() {
  const { id } = useParams();
  const [projectLog, setProjectLog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectLog = async () => {
    try {
      const response = await projectService.getProjectLog(id);
      console.log(response.data);
      setProjectLog(response.data);
    } catch (error) {
      console.error("Error fetching project logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectLog();
  }, []);

  const timelineItems = projectLog
    .sort((a, b) => new Date(a.updateTime) - new Date(b.updateTime))
    .map((log, idx) => ({
      color: idx === projectLog.length - 1 ? "green" : "blue",
      children: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{moment(log.updateTime).format("DD MMM YYYY, HH:mm")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Activity className="w-4 h-4 text-blue-500" />
            {log.activityType}
          </div>
        </motion.div>
      ),
    }));

  return (
    <motion.div
      className="w-full max-w-8xl mx-auto p-6 rounded-xl shadow-lg px-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        📜 Project Log History
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin tip="Loading logs..." />
        </div>
      ) : projectLog.length === 0 ? (
        <p className="text-gray-500 italic text-center">No logs available.</p>
      ) : (
        <Timeline
          items={timelineItems}
          mode="left"
          className="overflow-y-auto max-h-[60vh] overflow-x-hidden"
        />
      )}
    </motion.div>
  );
}
