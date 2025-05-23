import { Button, Divider, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { typeKnowledge } from "../config/constant";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { postView } from "../services/postService";

interface KnowledgeCardProps {
  title: string;
  description: string;
  tags: string[];
  postId: string | null;
  createdAt: string;
  postType: string;
  fName: string;
  lName: string;
  postFormat?: string;
  view?: number;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  tags,
  postId,
  createdAt,
  postType,
  fName,
  lName,
  postFormat,
  view,
}) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    navigate("/content/" + postId);
    await postView(postId);
  };

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2 tw-w-full tw-h-full hover:tw-shadow-tertiary tw-border-primary tw-border-[1px] hover:tw-bg-slide-gradient tw-bg-[length:200%_100%] tw-bg-left hover:tw-animate-slide-colors">
      <div className="tw-p-4 tw-flex tw-flex-col tw-space-y-1 tw-w-full tw-h-full">
        <p className="tw-text-end tw-text-xs tw-text-gray-400">
          เลขที่ : {postFormat}
        </p>
        <p
          className="tw-text-md tw-font-semibold tw-truncate"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div>
          {typeKnowledge
            .filter((type) => type.value === postType)
            .map((item, key) => (
              <Tag
                color={item.value === "1" ? "green" : "orange"}
                key={key}
                className="tw-truncate"
              >
                {item.label}
              </Tag>
            ))}
          {tags &&
            tags.map((tag, index) => (
              <Tag color="blue" key={index} className="tw-truncate">
                {tag}
              </Tag>
            ))}
        </div>
        <span
          className="tw-text-gray-400 tw-truncate-2 tw-line-clamp-2 tw-min-h-10 tw-text-sm tw-font-normal"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="tw-flex tw-flex-col tw-justify-end tw-flex-1">
          {fName && lName && (
            <div className="tw-text-end tw-text-xs tw-text-primary tw-space-x-1">
              <UserOutlined />
              <span dangerouslySetInnerHTML={{ __html: fName }} />
              <span dangerouslySetInnerHTML={{ __html: lName }} />
            </div>
          )}
          <p className="tw-text-xs tw-text-primary tw-text-end">
            <EyeOutlined /> {view} ครั้ง
          </p>
          <Divider
            orientation="left"
            orientationMargin="0"
            className="!tw-text-xs !tw-text-primary"
          >
            <p dangerouslySetInnerHTML={{ __html: createdAt }} />
          </Divider>
          <Button
            className="!tw-text-primary hover:!tw-bg-primary hover:!tw-text-white"
            onClick={handleClick}
          >
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>
    </div>
  );
};
