import { Button, Card, Input, Select } from "antd";
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

const selectOptions = [
  {
    value: "1",
    label: "Option 1",
  },
  {
    value: "2",
    label: "Option 2",
  },
  {
    value: "3",
    label: "Option 3",
  },
];

export const PostManagementScreen: React.FC = () => {
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
    navigate("/add-category");
  };

  return (
    <Card>
      <div className="tw-flex tw-justify-end tw-mb-6">
        <Button type="default" className="tw-border-primary" onClick={handleAddCategory}>
          Add Category
        </Button>
      </div>
      <form className="tw-flex tw-flex-col tw-space-y-6">
        <div>
          <p className="tw-font-medium">Title</p>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Title" />}
          />
          {errors.title && (
            <div className="tw-text-red-500">{errors.title.message}</div>
          )}
        </div>
        <div>
          <p className="tw-font-medium">Category Tags</p>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="tw-w-full"
                showSearch
                placeholder="Choose a category"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={selectOptions}
              />
            )}
          />
          {errors.category && (
            <div className="tw-text-red-500">{errors.category.message}</div>
          )}
        </div>
        <div>
          <p className="tw-font-medium">Description</p>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder="Description" />
            )}
          />
          {errors.description && (
            <div className="tw-text-red-500">{errors.description.message}</div>
          )}
        </div>
        <div>
          <p className="tw-font-medium">Content</p>
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
          <p className="tw-font-medium">Files</p>
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
          Submit
        </Button>
      </div>
    </Card>
  );
};
