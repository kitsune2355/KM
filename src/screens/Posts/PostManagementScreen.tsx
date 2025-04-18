import { Button, Card, Divider, Input, message, TreeSelect } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import FileUpload from "../../components/FileUpload";
import {
  PostManagementFormProps,
  usePostManagementForm,
} from "../../forms/PostManagementForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addPost } from "../../services/postService";
import { fetchPosts } from "../../redux/actions/postActions";
import useIsAdmin from "../../hook/useIsAdmin";

export const PostManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const posts = useSelector((state: RootState) => state.posts.posts);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [searchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = usePostManagementForm();

  const postId = useMemo(() => searchParams.get("id"), [searchParams]);

  const transformedFiles = (files: any) => {
    return files.map((file: any) => ({
      ...file,
      url: `/uploads/${file.file_name.replace(/\\/g, "/")}`,
      name: file.file_file_name,
    }));
  };

  const onStart = useCallback(() => {
    const postById = posts.find((post: any) => post.id === postId);
    if (postById) {
      const atrFile = transformedFiles(postById.files && postById.files);
      setValue("title", postById.post_title);
      setValue("category", postById.post_ctg_id);
      setValue("description", postById.post_desc);
      setValue("files", atrFile);
    }
  }, [postId, posts, setValue]);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts]);

  useEffect(() => {
    onStart();
  }, [onStart, postId, posts]);

  const onSubmit = async (data: PostManagementFormProps) => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const post = {
      id: postId,
      post_title: data.title,
      post_ctg_id: data.category,
      post_desc: data.description,
      post_create_by: user[0].id,
      files: data.files,
    };

    try {
      const response = await addPost(post);
      message.success("บทความถูกเพิ่มเรียบร้อยแล้ว");
      reset();
      navigate("/management");
      return response;
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มบทความ");
      console.error(error);
    }
  };

  const handleAddCategory = () => {
    navigate("/category");
  };

  const handleBack = () => {
    if (isAdmin) {
      navigate("/management");
    }
    navigate("/");
  };

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          {postId ? "แก้ไขบทความ" : "เพิ่มบทความ"}
        </Divider>
      </div>
      <Card>
        <div className="tw-flex tw-justify-end tw-mb-6">
          <Button
            type="default"
            className="tw-border-primary"
            onClick={handleAddCategory}
          >
            เพิ่มหมวดหมู่
          </Button>
        </div>
        <form className="tw-flex tw-flex-col tw-space-y-6">
          <div>
            <p className="tw-font-medium">หัวข้อ</p>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} placeholder="หัวข้อ" />}
            />
            {errors.title && (
              <div className="tw-text-red-500">{errors.title.message}</div>
            )}
          </div>
          <div>
            <p className="tw-font-medium">เลือกหมวดหมู่</p>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TreeSelect
                  {...field}
                  className="tw-w-full"
                  treeData={categories}
                  fieldNames={{
                    label: "title",
                    value: "key",
                    children: "children",
                  }}
                  placeholder="เลือกหมวดหมู่"
                  allowClear
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                />
              )}
            />
            {errors.category && (
              <div className="tw-text-red-500">{errors.category.message}</div>
            )}
          </div>
          <div>
            <p className="tw-font-medium">รายละเอียด</p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea {...field} rows={4} placeholder="รายละเอียด" />
              )}
            />
            {errors.description && (
              <div className="tw-text-red-500">
                {errors.description.message}
              </div>
            )}
          </div>
          {/* <div>
            <p className="tw-font-medium">บทความ</p>
            <Controller
              name="contents"
              control={control}
              render={({ field }) => <TextEditor {...field} />}
            />
            {errors.contents && (
              <div className="tw-text-red-500">{errors.contents.message}</div>
            )}
          </div> */}
          <div>
            <p className="tw-font-medium">อัปโหลดไฟล์</p>
            <Controller
              name="files"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUpload onChange={onChange} value={value} />
              )}
            />
            {errors.files && (
              <div className="tw-text-red-500">{errors.files.message}</div>
            )}
          </div>
        </form>
        <div className="tw-w-full tw-flex tw-justify-end tw-mt-4 tw-space-x-2">
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="tw-w-24 tw-bg-primary"
          >
            บันทึก
          </Button>
          {postId && (
            <Button
              variant="outlined"
              onClick={handleBack}
              className="tw-w-24 tw-border-primary"
            >
              ยกเลิก
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};
