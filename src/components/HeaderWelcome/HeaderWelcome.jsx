import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { route } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/userSlice";
import Cookies from "js-cookie";
import logoNoBg from "../../assets/logoNoBG.png";
import { FaRegNewspaper } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";

export default function HeaderWelcome() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Do something to log out
    dispatch(logout());
    navigate(route.login);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return (
    <header className="w-full shadow-md bg-white flex justify-between items-center px-[3%]">
      <div className="flex justify-between items-center gap-[20%]">
        <Link
          to={route.welcome}
          className="text-xl font-bold flex items-center justify-between gap-[5%] text-nowrap"
        >
          <img src={logoNoBg} alt="" className="h-[50px]" />
          Timely PM
        </Link>
      </div>

      {user && user?.username && (
        <div className="flex justify-between items-center">
          <Menu
            mode="horizontal"
            className="!bg-none !border-none w-[800px] flex justify-center items-center "
          >
            {user?.role !== "ADMIN" && (
              <Menu.Item key="setting" icon={<BsPersonWorkspace />}>
                <Link to={`${route.home}/${route.introWorkspace}`}>
                  Go To Your Workspace
                </Link>
              </Menu.Item>
            )}
            {user?.role === "ADMIN" && (
              <Menu.Item key="Admin" icon={<MdAdminPanelSettings />}>
                <Link to={`${route.admin}/${route.dashboard}`}>
                  Go To Your Admin
                </Link>
              </Menu.Item>
            )}

            <Menu.Item key="News" icon={<FaRegNewspaper />}>
              <Link to={`${route.blog}`}>News & Update</Link>
            </Menu.Item>
          </Menu>
        </div>
      )}

      <div className="flex justify-between items-center gap-[10%]">
        {user ? (
          <>
            <p className="text-nowrap">
              {" "}
              <UserOutlined /> {user.username}
            </p>
            <Button
              onClick={() => handleLogout()}
              className="!bg-[#1968db]  !font-bold !text-white !rounded-lg"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            {" "}
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
          </>
        )}
      </div>
    </header>
  );
}
