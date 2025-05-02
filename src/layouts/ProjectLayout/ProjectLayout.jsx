import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout } from "antd";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

import HeaderProject from "../../components/HeaderProject/HeaderProject";
import SidebarProject from "../../components/SidebarProject/SidebarProject";
import projectService from "../../services/projectService";

const { Sider, Content } = Layout;

export default function ProjectLayout() {
  const location = useLocation();
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectsById(id);
        console.log(response.data);
        setProjectName(response.data.name);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);
  return (
    <>
      <Layout className="!min-h-screen">
        <HeaderProject />

        <Layout className="!bg-[#ffffff]">
          <SidebarProject />

          {/* <Outlet /> */}

          <Content className="!p-4 flex flex-col overflow-x-auto">
            <Breadcrumb>
              {/* {location.pathname.split("/").map((path, index, array) => {
                if (index === 0) {
                  return <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>;
                } else if (path === id) {
                  return (
                    <Breadcrumb.Item key={path}>
                      <Link to={`${path}`}>{projectName}</Link>
                    </Breadcrumb.Item>
                  );
                } else {
                  return (
                    <Breadcrumb.Item key={path}>
                      <Link to={`/${path}`}>{path}</Link>
                    </Breadcrumb.Item>
                  );
                }
              })} */}
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
