import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { Card, Skeleton, Avatar, Divider, Tag, Button } from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
} from "@ant-design/icons";

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { id } = useParams();

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await adminService.getBlogDetail(id);
      setBlog(response.data);
      console.log(response.data);
      // Optionally fetch related posts if your API supports it
      // const relatedResponse = await adminService.getRelatedPosts(id);
      // setRelatedPosts(relatedResponse.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error(error?.response?.message || "Failed to fetch blog detail.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Reduced the delay for better UX
    }
  };

  useEffect(() => {
    fetchBlogDetail();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <motion.div
      className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            to="/blog"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftOutlined className="mr-2" />
            <span>Back to all blogs</span>
          </Link>
        </motion.div>

        {loading ? (
          <Card className="rounded-2xl shadow-lg">
            <Skeleton active avatar paragraph={{ rows: 1 }} className="mb-4" />
            <Skeleton.Image className="w-full h-64 mb-6" />
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="rounded-2xl shadow-lg overflow-hidden"
              bodyStyle={{ padding: 0 }}
              cover={
                blog?.coverImage && (
                  <div className="relative w-full h-64 md:h-96">
                    <img
                      src={blog.coverImage}
                      alt={blog?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              }
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      className="bg-blue-500"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">
                        {blog?.author || "Admin"}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <CalendarOutlined className="mr-1" />
                        <span>{blog?.date || "Recent"}</span>
                        {blog?.readTime && (
                          <>
                            <span className="mx-2">•</span>
                            <ClockCircleOutlined className="mr-1" />
                            <span>{blog.readTime} read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {blog?.title}
                </h1>

                {blog?.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map((tag, index) => (
                      <Tag key={index} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}

                <Divider className="my-6" />

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog?.content }}
                />

                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <Divider>
                      <span className="text-lg font-semibold">
                        Related Posts
                      </span>
                    </Divider>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {relatedPosts.map((post) => (
                        <Link key={post.id} to={`/blog/${post.id}`}>
                          <Card
                            hoverable
                            size="small"
                            className="flex flex-row items-center"
                          >
                            {post.imageUrl && (
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-16 h-16 object-cover mr-3"
                              />
                            )}
                            <div>
                              <h4 className="font-medium">{post.title}</h4>
                              <p className="text-sm text-gray-500">
                                {post.date}
                              </p>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
