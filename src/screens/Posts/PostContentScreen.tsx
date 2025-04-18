import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";
import { FilePreviewScreen } from "../FilePreview/FilePreviewScreen";

export const PostContentScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postId = useParams().id;
  const posts = useSelector((state: RootState) => state.posts.posts);

  const postData = useMemo(() => {
    return posts.find((post: any) => post.id === postId);
  }, [postId, posts]);

  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchPosts());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="tw-flex tw-flex-col tw-space-y-4">
      <Card>
        <div className="tw-flex tw-flex-row tw-items-center">
          <Avatar size={48} icon={<UserOutlined />} />
          <div className="tw-flex tw-flex-col tw-ml-4">
            <p>{postData?.post_create_by}</p>
            <p>
              position <span>{postData?.post_create_at}</span>
            </p>
          </div>
        </div>
        <div className="tw-mt-4 tw-flex tw-flex-col tw-space-y-4">
          <h1 className="tw-text-xl tw-text-black tw-font-bold">
            {postData?.post_title}
          </h1>
          <p>{postData?.post_desc}</p>
        </div>
      </Card>

      <FilePreviewScreen />
    </div>
  );
};
