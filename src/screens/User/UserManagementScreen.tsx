import { Card, Divider, Tabs, TabsProps } from "antd";
import React from "react";
import AddUser from "./AddUser";
import TableControlUser from "./TableControlUser";

export const UserManagementScreen: React.FC = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "เพิ่มผู้ใช้",
      children: <AddUser />,
    },
    {
      key: "2",
      label: "กำหนดสิทธิ์การใช้งาน",
      children: <TableControlUser />,
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
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Card>
    </>
  );
};
