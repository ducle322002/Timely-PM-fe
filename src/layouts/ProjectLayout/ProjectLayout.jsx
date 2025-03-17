import React from "react";
import { Breadcrumb, Layout } from "antd";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";

import HeaderProject from "../../components/HeaderProject/HeaderProject";
import SidebarProject from "../../components/SidebarProject/SidebarProject";

const { Sider, Content } = Layout;

export default function ProjectLayout() {
  const location = useLocation(); // To get the current URL path

  return (
    <>
      <Layout className="!min-h-screen">
        <HeaderProject />

        <Layout className="!bg-[#ffffff]">
          <SidebarProject />

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
