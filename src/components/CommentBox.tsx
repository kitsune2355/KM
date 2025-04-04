import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space } from "antd";
import React from "react";

export const CommentBox: React.FC = () => {
  return (
    <Card className="!tw-p-0">
      <Space.Compact style={{ width: "100%" }}>
        <Input placeholder="Type your comment ..." />
        <Button
          type="primary"
          className="tw-bg-primary"
          style={{width: 50}}
          icon={<SendOutlined />}
        />
      </Space.Compact>
    </Card>
  );
};
