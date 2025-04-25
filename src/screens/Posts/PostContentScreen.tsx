import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Tag } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";
import { FilePreviewScreen } from "../FilePreview/FilePreviewScreen";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import { findCategory } from "../Dashboard/DashboardScreen";
import { typeKM, typeKnowledge } from "../../config/constant";

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
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [tags, setTags] = useState<string[] | null>([]);

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
    if (postData) {
      const tag = findCategory(categories, postData.post_ctg_id);
      setTags(tag);
    }
  }, [fetchData]);

  return (
    <div className="tw-flex tw-flex-col tw-space-y-4">
      {postData ? (
        <>
          <Card>
            <div className="tw-flex tw-flex-row tw-justify-between">
              <div className="tw-flex tw-flex-row tw-items-center">
                <Avatar size={48} icon={<UserOutlined />} />
                <div className="tw-flex tw-flex-col tw-ml-4">
                  <p className="tw-text-primary tw-font-bold">
                    {postData?.post_fname} {postData.post_lname}
                  </p>
                  {postData.post_type === "1" ? (
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
                  ) : (
                    <p className="tw-text-primary tw-font-bold">
                      องค์ความรู้องค์กร
                    </p>
                  )}
                  <p className="tw-text-gray-500 tw-text-xs">
                    บันทึกวันที่ {postData?.post_create_at}
                  </p>
                </div>
              </div>

              <div className="tw-text-gray-500 tw-text-xs">
                วันที่ทำเอกสาร {formatThaiDate(postData.post_date)}
              </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-flex-col tw-space-y-4">
              <div>
                {typeKnowledge
                  .filter((type) => type.value === postData.post_type)
                  .map((item, key) => (
                    <Tag
                      color={item.value === "1" ? "pink" : "purple"}
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

              <h1 className="tw-text-xl tw-text-black tw-font-bold">
                {postData?.post_title}
              </h1>
              <div>
                <p className="tw-text-primary tw-font-bold">
                  ประเภทขององค์ความรู้ :
                </p>
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
                  <p
                    dangerouslySetInnerHTML={{ __html: postData?.post_desc }}
                  />
                </div>
              )}
              {postData.post_benefit && (
                <div>
                  <p className="tw-text-primary tw-font-bold">
                    ประโยชน์ขององค์ความรู้ :
                  </p>
                  <p
                    dangerouslySetInnerHTML={{ __html: postData?.post_benefit }}
                  />
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
