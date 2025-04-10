import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { route } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/userSlice";
import Cookies from "js-cookie";
import logoNoBg from "../../assets/logoNoBG.png";

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

      {user && user.username && (
        <div className="flex justify-between items-center w-[800px]">
          <div className="hover:color-[#1968db] hover:!underline">
            <Link to={`${route.home}/${route.introWorkspace}`}>
              Go To Your Workspace
            </Link>
          </div>
          <div className="hover:color-[#1968db] hover:underline">
            <Link to={`${route.home}/${route.introWorkspace}`}>
              News & Update
            </Link>
          </div>
          <div className="hover:color-[#1968db] hover:underline">
            <Link to={`${route.home}/${route.introWorkspace}`}>
              Go To Your Workspace
            </Link>
          </div>
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
