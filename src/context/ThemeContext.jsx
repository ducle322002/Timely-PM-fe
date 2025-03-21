import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("displayMode");
    if (savedMode) {
      setDarkMode(savedMode === "dark");
    }
  }, []);

  const toggleDisplayMode = () => {
    const newMode = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("displayMode", newMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDisplayMode }}>
      <div className={`${darkMode ? "dark" : ""}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
