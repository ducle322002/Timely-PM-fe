import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Card } from "antd";
const { Meta } = Card;
import { UserOutlined } from "@ant-design/icons";

import { Avatar } from "antd";
import { Link } from "react-router-dom";
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      const response = await adminService.getAllNews();
      console.log(response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error(error.response.message.data);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <motion.div
      className="p-6 md:p-10 min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Latest Blog Posts
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((post, index) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card hoverable className="rounded-2xl shadow-md">
              <Link to={`/blog/${post.id}`}>
                <Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={post.title}
                  // description={`${post.description.substring(0, 80)}...`}
                />
                {/* <p className="mt-2 text-sm text-gray-500">By {post.author}</p> */}
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
