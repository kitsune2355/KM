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
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = usePostManagementForm();

  console.log("errors :>> ", errors, watch("title"));

  const onSubmit = (data: PostManagementFormProps) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="tw-container">
      <Card>
        <form className="tw-flex tw-flex-col tw-space-y-4">
          <div>
            <p>Title</p>
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
            <p>Category Tags</p>
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
            <p>Description</p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea {...field} rows={4} placeholder="Description" />
              )}
            />
            {errors.description && (
              <div className="tw-text-red-500">
                {errors.description.message}
              </div>
            )}
          </div>
          <div>
            <p>Content</p>
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
            <p>Files</p>
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
    </div>
  );
};
