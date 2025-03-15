import { SettingOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderWelcome() {
  const navigate = useNavigate();

  return (
    <header className="w-full shadow-md bg-white flex justify-between items-center px-[5%]">
      <div className="flex justify-center items-center">
        <h1 className="text-xl font-bold">Timely Project Management</h1>

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
              className="!py-[5%]"
            >
              <Menu.Item key={2}>
                <Link to={""}>{"About Us"}</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>

      <div>
        <Button
          onClick={() => navigate("/login")}
          color="primary"
          variant="text"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/register")}
          color="primary"
          variant="text"
        >
          Sign Up
        </Button>
      </div>
    </header>
  );
}
