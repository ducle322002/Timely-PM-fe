import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Button } from "antd";

export default function SettingPage() {
  const { darkMode, toggleDisplayMode } = useContext(ThemeContext);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 dark:text-white">
        <div>
          <Button onClick={toggleDisplayMode}>
            {darkMode ? "Set to Light" : "set to Dark"}
          </Button>
        </div>
      </div>
    </div>
  );
}
