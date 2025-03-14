import React from "react";
import { motion } from "framer-motion";
export default function Homepage() {
  return (
    <motion.div className="text-3xl font-bold text-center">
      <motion.span whileHover={{ scale: 1.5, color: "red" }}>
        Homepage
      </motion.span>
    </motion.div>
  );
}
