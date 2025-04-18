import { Button, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

interface KnowledgeCardProps {
  title: string;
  description: string;
  tags: string[];
  postId: string | null;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  tags,
  postId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/content/" + postId);
  };

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2 tw-w-full tw-h-full">
      <div className="tw-p-4 tw-flex tw-flex-col tw-space-y-4 tw-w-full tw-h-full">
        <div>
          <p className="tw-text-lg tw-font-bold">{title}</p>
          {tags &&
            tags.map((tag, index) => (
              <Tag color="blue" key={index} className="tw-truncate">
                {tag}
              </Tag>
            ))}
        </div>
        <span className="tw-text-gray-400 tw-truncate-2 tw-line-clamp-2 tw-min-h-10 tw-text-sm tw-font-normal">
          {description}
        </span>
        <div className="tw-flex tw-justify-end tw-items-end tw-flex-1">
          <Button onClick={handleClick}>อ่านเพิ่มเติม</Button>
        </div>
      </div>
    </div>
  );
};
