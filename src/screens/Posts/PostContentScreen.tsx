import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";
import { FilePreviewScreen } from "../FilePreview/FilePreviewScreen";
import { typeKM } from "./PostManagementScreen";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.extend(buddhistEra);
dayjs.locale("th");

export const formatThaiDate = (dateString: string) => {
  if (!dateString) return "";
  return dayjs(dateString).format("D MMM BBBB");
};

export const PostContentScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const postId = useParams().id;
  const posts = useSelector((state: RootState) => state.posts.posts);

  const postData = useMemo(() => {
    return posts.find((post: any) => post.id === postId);
  }, [postId, posts]);

  console.log("postData", postData);

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
      {postData ? (
        <>
          <Card>
            <div className="tw-flex tw-flex-row tw-items-center">
              <Avatar size={48} icon={<UserOutlined />} />
              <div className="tw-flex tw-flex-col tw-ml-4">
                <p className="tw-text-primary tw-font-bold">
                  {postData?.post_fname} {postData.post_lname}
                </p>
                <p className="tw-text-xs">
                  ตำแหน่ง{" "}
                  <span className="tw-text-gray-500">
                    {postData?.post_position}
                  </span>{" "}
                  แผนก{" "}
                  <span className="tw-text-gray-500">
                    {postData?.post_depm}
                  </span>{" "}
                  ฝ่าย{" "}
                  <span className="tw-text-gray-500">
                    {postData?.post_sub_depm}
                  </span>
                </p>
                <p className="tw-text-gray-500 tw-text-xs">
                  บันทึกวันที่ {postData?.post_create_at}
                </p>
              </div>
            </div>
            <div className="tw-flex tw-justify-end tw-text-gray-500 tw-text-xs">
              วันที่ทำเอกสาร {formatThaiDate(postData.post_date)}
            </div>
            <div className="tw-mt-4 tw-flex tw-flex-col tw-space-y-4">
              <h1 className="tw-text-xl tw-text-black tw-font-bold">
                {postData?.post_title}
              </h1>
              <div>
                <div className="tw-flex tw-flex-row tw-items-center tw-space-x-1">
                  <p className="tw-text-primary tw-font-bold">
                    ประเภทขององค์ความรู้ :
                  </p>
                  <span>{postData.post_type}</span>
                </div>
                {typeKM
                  .filter((item) =>
                    JSON.parse(postData!.post_contents).includes(item.value)
                  )
                  .map((item, key) => (
                    <div key={key}>
                      <span>- {item.label}</span>
                    </div>
                  ))}
              </div>
              {postData?.post_desc && (
                <div>
                  <p className="tw-text-primary tw-font-bold">
                    รายละเอียดขององค์ความรู้ :
                  </p>
                  <p>{postData?.post_desc}</p>
                </div>
              )}
              {postData.post_benefit && (
                <div>
                  <p className="tw-text-primary tw-font-bold">
                    ประโยชน์ขององค์ความรู้ :
                  </p>
                  <p>{postData.post_benefit}</p>
                </div>
              )}
            </div>
          </Card>

          {postData.post_comment && (
            <Card>
              <p className="tw-text-primary tw-font-bold">
                เสนอความเห็นโดยหัวหน้างาน / ผู้จัดการฝ่ายต้นสังกัด
              </p>
              <div
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: postData.post_comment }}
              />
            </Card>
          )}

          <FilePreviewScreen />
        </>
      ) : (
        <Card className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen">
          <p className="tw-text-gray-500">No post found</p>
        </Card>
      )}
    </div>
  );
};
