import { Button, Carousel, Tag } from "antd";
import React from "react";

interface KnowledgeCardProps {
  title: string;
  description: string;
  tags: string;
  image?: string[];
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  tags,
  image,
}) => {
  const contentStyle: React.CSSProperties = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2">
      {/* <Carousel>
        {image?.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`img ${index}`} style={contentStyle} />
          </div>
        ))}
      </Carousel> */}
      <div className="tw-p-4 tw-flex tw-flex-col tw-gap-2">
        <p className="tw-text-lg tw-font-bold">{title}</p>
        <div>
          <Tag color="blue">{tags}</Tag>
        </div>
        <span className="tw-text-gray-500 tw-truncate-2 tw-line-clamp-2 tw-min-h-12">
          {description}
        </span>
        <div className="tw-flex tw-justify-end">
          <Button type="text" color="primary">
            Read more
          </Button>
        </div>
      </div>
    </div>
  );
};
