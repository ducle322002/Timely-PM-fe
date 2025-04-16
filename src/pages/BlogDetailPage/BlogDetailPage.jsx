import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { Card, Skeleton } from "antd";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchBlogDetail = async () => {
    try {
      const response = await adminService.getBlogDetail(id);
      setBlog(response.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error(error?.response?.message || "Failed to fetch blog detail.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000); // Simulate a delay for loading effect
    }
  };

  useEffect(() => {
    fetchBlogDetail();
  }, []);

  return (
    <motion.div
      className="p-6 md:p-10  min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              title={
                <h1 className="text-3xl font-bold text-gray-800">
                  {blog?.title}
                </h1>
              }
              className="rounded-2xl shadow-lg"
              bodyStyle={{ padding: "1.5rem" }}
            >
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.content }}
              />
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
