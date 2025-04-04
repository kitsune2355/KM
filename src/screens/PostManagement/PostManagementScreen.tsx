import { Button, Card, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import TextEditor from "../../components/TextEditor";
import {
  PostManagementFormProps,
  usePostManagementForm,
} from "../../forms/PostManagementForm";
import { Controller } from "react-hook-form";
import FileUpload from "../../components/FileUpload";

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
  const { control, handleSubmit } = usePostManagementForm();

  const onSubmit = (data: PostManagementFormProps) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="tw-container">
      <Card>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tw-flex tw-flex-col tw-space-y-4"
        >
          <div>
            <p>Title</p>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Title" />}
            />
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
          </div>
          <div>
            <p>Content</p>
            <Controller
              name="contents"
              control={control}
              render={({ field }) => <TextEditor {...field} />}
            />
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
          </div>
        </form>
        <div className="tw-w-full tw-flex tw-justify-end tw-mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="tw-w-24 tw-bg-primary"
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};
