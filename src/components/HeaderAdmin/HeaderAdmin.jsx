import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { Layout } from "antd";
const { Content, Footer, Header } = Layout;

export default function HeaderAdmin() {
  const user = useSelector(selectUser);
  return (
    <Header className="!bg-[#FFFFFF] !text-black flex items-center justify-end shadow-md gap-5">
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt=""
        className="h-[50px] rounded-[100%] border border-black"
      />
      <div className="flex flex-col justify-start items-start">
        <p className="font-bold text-xl">{user.username}</p>
        <p className="text-sm">{user.role}</p>
      </div>
    </Header>
  );
}
