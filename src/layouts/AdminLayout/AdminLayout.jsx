import React from "react";
import { Breadcrumb, Layout } from "antd";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
const { Sider, Content } = Layout;

import SidebarAdmin from "../../components/SidebarAdmin/SidebarAdmin";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
export default function AdminLayout() {
  const location = useLocation(); // To get the current URL path

  return (
    <>
      <Layout className="!min-h-screen">
        <SidebarAdmin />
        <Layout className="!bg-[#ffffff] layoutAdmin">
          <HeaderAdmin />

          {/* <Outlet /> */}

          <Content className="!p-4 flex flex-col">
            <Breadcrumb className="mb-6 text-sm">
              {location.pathname.split("/").map((path, index, array) => (
                <Breadcrumb.Item key={path}>
                  {index === 0 ? (
                    path
                  ) : (
                    <Link
                      className="text-blue-600 hover:text-blue-800"
                      to={`/${path}`}
                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Link>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>

            <div className="!p-8 !bg-[#ffffff] flex-1">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
