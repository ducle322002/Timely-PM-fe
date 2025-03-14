import React from "react";
import { Breadcrumb, Layout } from "antd";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import HeaderUser from "../../components/HeaderUser/HeaderUser";

const { Sider, Content } = Layout;

export default function UserLayout() {
  const location = useLocation(); // To get the current URL path

  return (
    <>
      <Layout className="!min-h-screen">
        <HeaderUser />

        <Layout className="!bg-[#ffffff]">
          <Sidebar />

          {/* <Outlet /> */}

          <Content className="!p-4 flex flex-col">
            <Breadcrumb>
              {location.pathname.split("/").map((path, index, array) => (
                <Breadcrumb.Item key={path}>
                  {index === 0 ? path : <Link to={`/${path}`}>{path}</Link>}
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
