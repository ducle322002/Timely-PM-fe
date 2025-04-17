import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Card, Avatar, Skeleton, Empty, Tag } from "antd";
import { UserOutlined, CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllNews();
      setBlogs(response.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error(error?.response?.message || "Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <motion.div
      className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Blog</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with our latest news, insights, and announcements
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="rounded-2xl shadow-md">
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {blogs.map((post, index) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/blog/${post.id}`} className="block h-full">
                  <Card
                    hoverable
                    className="rounded-2xl shadow-md h-full flex flex-col"
                    cover={
                      post.imageUrl ? (
                        <div className="overflow-hidden rounded-t-2xl h-48">
                          <img
                            alt={post.title}
                            src={post.imageUrl}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ) : null
                    }
                  >
                    <div className="flex items-center mb-3">
                      <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                      <div className="ml-2">
                        <span className="text-sm text-gray-500">
                          {post.author || "Admin"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {post.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.description.substring(0, 120)}
                        {post.description.length > 120 ? "..." : ""}
                      </p>
                    )}

                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center text-gray-500 text-sm">
                        <CalendarOutlined className="mr-1" />
                        {post.date || "Recent"}
                      </div>

                      <Tag color="blue" className="flex items-center">
                        <EyeOutlined className="mr-1" />
                        Read More
                      </Tag>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Empty
            description="No blog posts found"
            className="py-16 bg-white rounded-lg shadow-sm"
          />
        )}
      </div>
    </motion.div>
  );
}
