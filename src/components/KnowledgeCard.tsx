import { Button, Divider, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { typeKnowledge } from "../config/constant";

interface KnowledgeCardProps {
  title: string;
  description: string;
  tags: string[];
  postId: string | null;
  createdAt: string;
  postType: string;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  tags,
  postId,
  createdAt,
  postType,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/content/" + postId);
  };

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2 tw-w-full tw-h-full hover:tw-shadow-tertiary tw-border-primary tw-border-[1px] tw-p-4">
      <div className="tw-p-4 tw-flex tw-flex-col tw-space-y-4 tw-w-full tw-h-full">
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
