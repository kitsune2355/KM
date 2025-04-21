import { Card, Divider } from "antd";
import React from "react";

export const UserManagementScreen: React.FC = () => {
  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          ระบบจัดการผู้ใช้
        </Divider>
      </div>
      <Card></Card>
    </>
  );
};
