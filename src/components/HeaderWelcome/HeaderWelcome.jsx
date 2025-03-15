import { SettingOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { route } from "../../routes";

export default function HeaderWelcome() {
  const navigate = useNavigate();

  return (
    <header className="w-full shadow-md bg-white flex justify-between items-center px-[5%]">
      <div className="flex justify-center items-center">
        <Link to={route.welcome} className="text-xl font-bold">
          Timely Project Management
        </Link>

        <div>
          <Menu
            theme="light"
            mode="horizontal"
            className=" flex items-center justify-start"
          >
            <Menu.SubMenu
              key={"1"}
              icon={""}
              title="About Us"
              className="!py-[15%]"
            >
              <Menu.Item key={2}>
                <Link to={""}>{"About Us"}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>

      <div className="flex justify-between items-center gap-[5%]">
        <Button
          onClick={() => navigate(route.login)}
          className="!bg-[#1968db]  !font-bold !text-white !rounded-lg"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate(route.register)}
          className="!bg-[#1968db]  !font-bold !text-white !rounded-lg"
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
