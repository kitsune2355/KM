import { Divider, Tag } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { typeKnowledge } from "../config/constant";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Post, postView } from "../services/postService";
import { formatThaiDate } from "../screens/Posts/PostContentScreen";

interface KnowledgeCardProps {
  tags: string[];
  postId: string | null;
  postsData: Post;
  query: string;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  postId,
  postsData,
  tags,
  query,
}) => {
  const navigate = useNavigate();

  const handleReadmore = async () => {
    navigate("/content/" + postId);
    await postView(postId);
  };

  const highlightText = (text: string) =>
    !query
      ? text
      : text.replace(new RegExp(`(${query})`, "gi"), "<mark>$1</mark>");

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-flex tw-flex-col tw-gap-2 tw-w-full tw-h-full hover:tw-shadow-tertiary tw-border-primary tw-border-[1px] hover:tw-bg-slide-gradient tw-bg-[length:200%_100%] tw-bg-left hover:tw-animate-slide-colors" onClick={handleReadmore}>
      <div className="tw-p-4 tw-flex tw-flex-col tw-space-y-1 tw-w-full tw-h-full">
        <p className="tw-text-end tw-text-xs tw-text-gray-400">
          เลขที่ : {highlightText(postsData.post_format as string)}
        </p>
        <p
          className="tw-text-md tw-font-semibold tw-truncate"
          dangerouslySetInnerHTML={{
            __html: highlightText(postsData.post_title),
          }}
        />
        <div>
          {typeKnowledge
            .filter((type) => type.value === postsData.post_type)
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
          dangerouslySetInnerHTML={{ __html: postsData.post_desc }}
        />
        <div className="tw-flex tw-flex-col tw-justify-end tw-flex-1">
          {postsData.post_fname && postsData.post_lname && (
            <div className="tw-text-end tw-text-xs tw-text-primary tw-space-x-1">
              <UserOutlined />
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightText(postsData.post_fname),
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightText(postsData.post_lname),
                }}
              />
            </div>
          )}
          <p className="tw-text-xs tw-text-primary tw-text-end">
            <EyeOutlined /> {postsData.post_count} ครั้ง
          </p>
          <Divider
            orientation="left"
            orientationMargin="0"
            className="!tw-text-xs !tw-text-primary"
          >
            <p
              dangerouslySetInnerHTML={{
                __html: formatThaiDate(postsData.post_date),
              }}
            />
          </Divider>
        </div>
      </div>
    </div>
  );
};
