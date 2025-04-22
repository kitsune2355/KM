import { Card, Divider } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useParams } from "react-router-dom";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { fetchPosts } from "../../redux/actions/postActions";

export const FilePreviewScreen: React.FC = () => {
  const postId = useParams().id;
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const files = useMemo(() => {
    return posts.find((post: any) => post.id === postId)?.files;
  }, [postId, posts]);

  const handleDownload = (file: any) => {
    const link = document.createElement("a");
    link.href = `https://km.happylandgroup.biz/${file.file_name}`;
    link.setAttribute("target", "_blank");
    link.setAttribute("download", file.file_file_name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <React.Fragment>
      {postId && files && files.length > 0 && (
        <>
          <div className="tw-mb-4">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="!tw-text-xl !tw-text-primary !tw-font-bold"
            >
              เอกสาร / ไฟล์แนบ
            </Divider>
          </div>
          <div className="tw-space-y-2">
            {files?.map((file: any, key) => (
              <Card key={key}>
                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-2">
                  <p className="tw-text-gray-500">{file.file_file_name}</p>
                  <CloudDownloadOutlined onClick={() => handleDownload(file)} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </React.Fragment>
  );
};
