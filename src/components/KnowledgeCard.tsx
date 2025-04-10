import { Button, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/content");
  };
  // const contentStyle: React.CSSProperties = {
  //   height: "160px",
  //   color: "#fff",
  //   lineHeight: "160px",
  //   textAlign: "center",
  //   background: "#364d79",
  // };
  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2">
      {/* <Carousel>
        {image?.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`img ${index}`} style={contentStyle} />
          </div>
        ))}
      </Carousel> */}
      <div className="tw-p-4 tw-flex tw-flex-col tw-space-y-4">
        <div>
          <p className="tw-text-lg tw-font-bold">{title}</p>

          <Tag color="blue">{tags}</Tag>
        </div>
        <span className="tw-text-gray-400 tw-truncate-2 tw-line-clamp-2 tw-min-h-10 tw-text-sm tw-font-normal">
          {description}
        </span>
        <div className="tw-flex tw-justify-end">
          <Button color="primary" variant="filled" onClick={handleClick}>
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>
    </div>
  );
};
