import React from "react";
import HeaderWelcome from "../../components/HeaderWelcome/HeaderWelcome";
import { Outlet } from "react-router-dom";
import FooterWelcome from "../../components/FooterWelcome/FooterWelcome";

export default function GuestLayout() {
  return (
    <>
      <HeaderWelcome />
      <Outlet />
      <FooterWelcome />
    </>
  );
}
