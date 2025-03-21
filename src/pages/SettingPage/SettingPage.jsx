import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Button } from "antd";

export default function SettingPage() {
  const { darkMode, toggleDisplayMode } = useContext(ThemeContext);

  return (
    <div>
      <div className="">
        <Button onClick={toggleDisplayMode}>
          {darkMode ? "Set to Light" : "set to Dark"}
        </Button>
      </div>
    </div>
  );
}
