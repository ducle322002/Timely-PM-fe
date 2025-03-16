import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { motion } from "framer-motion";
import { Button, Card, Collapse, Menu } from "antd";

export default function IntroWorkspacePage() {
  const user = useSelector(selectUser);

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "This is panel header 1",
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: <p>{text}</p>,
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <Card
              title={<div className="text-center">Workspace</div>}
              className="w-[55%] mt-[5%]"
              style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
            >
              <div className="flex flex-col items-start justify-center gap-[5%]">
                <Menu theme="light" mode="vertical" className="w-full">
                  <Menu.Item>Create new Workspace</Menu.Item>
                  <Menu.Item>Join an existing Workspace</Menu.Item>
                </Menu>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-center mt-[5%]">
            <Card
              title={<div className="text-center">Recent Workspace</div>}
              className="w-[55%] mt-[5%]"
              style={{ boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)" }}
            >
              {items.length > 0 ? (
                <Collapse
                  accordion
                  items={items}
                  bordered={false}
                  ghost={true}
                />
              ) : (
                <div className="text-center text-2xl">
                  You haven't created or joined any workspace yet
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
