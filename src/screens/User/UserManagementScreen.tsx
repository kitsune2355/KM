import { Card, Divider, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import AddUser from "./AddUser";
import TableControlUser from "./TableControlUser";

export const UserManagementScreen: React.FC = () => {
  const [activeKey, setActiveKey] = useState("1");

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ข้อมูลผู้ใช้",
      children: <TableControlUser setActiveTab={setActiveKey} activeTab={activeKey} />,
    },
    {
      key: "2",
      label: "เพิ่มผู้ใช้",
      children: <AddUser />,
    },
  ];

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
        >
          ระบบจัดการผู้ใช้
        </Divider>
      </div>
      <Card>
        <Tabs
          className="tw-tabs"
          activeKey={activeKey}
          items={items}
          onChange={onChange}
          destroyInactiveTabPane
        />
      </Card>
    </>
  );
};
