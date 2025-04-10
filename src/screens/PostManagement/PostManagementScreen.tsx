import { Button, Card, Divider, Input, TreeSelect } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import TextEditor from "../../components/TextEditor";
import { Controller } from "react-hook-form";
import FileUpload from "../../components/FileUpload";
import {
  PostManagementFormProps,
  usePostManagementForm,
} from "../../forms/PostManagementForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const PostManagementScreen: React.FC = () => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = usePostManagementForm();

  const onSubmit = (data: PostManagementFormProps) => {
    console.log("Form submitted:", data);
  };

  const handleAddCategory = () => {
    navigate("/category");
  };

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          จัดการบทความ
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
          <div>
            <p className="tw-font-medium">บทความ</p>
            <Controller
              name="contents"
              control={control}
              render={({ field }) => <TextEditor {...field} />}
            />
            {errors.contents && (
              <div className="tw-text-red-500">{errors.contents.message}</div>
            )}
          </div>
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
        <div className="tw-w-full tw-flex tw-justify-end tw-mt-4">
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="tw-w-24 tw-bg-primary"
          >
            บันทึก
          </Button>
        </div>
      </Card>
    </>
  );
};
