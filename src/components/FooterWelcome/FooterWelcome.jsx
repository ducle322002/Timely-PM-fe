import React from "react";
import { Link } from "react-router-dom";

export default function FooterWelcome() {
  return (
    <footer className="w-full bg-[#f4f5f7] flex justify-start px-[5%] gap-[5%] items-center py-[2%] font-bold text-[#a8a8a9] border border-[#e4e5e7]">
      <Link to="/">Privacy and Policy</Link>
      <Link to="/">Term</Link>
      <p>&copy; 2025 Timely Project Management</p>
    </footer>
  );
}
