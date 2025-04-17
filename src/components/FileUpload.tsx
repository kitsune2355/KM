import React from "react";
import { useDropzone } from "react-dropzone";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value: any;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, value }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop: (acceptedFiles) => {
      const existingFiles = value || [];
      const mergedFiles = [
        ...existingFiles,
        ...acceptedFiles.filter(
          (file) =>
            !existingFiles.some(
              (f: File) => f.name === file.name && f.size === file.size
            )
        ),
      ];
      onChange(mergedFiles);
    },
  });

  const renderFileIcon = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return <FilePdfOutlined className="tw-text-red-500" />;
      case "doc":
      case "docx":
        return <FileWordOutlined className="tw-text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined className="tw-text-green-500" />;
      default:
        return <FileTextOutlined />;
    }
  };

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    file: File
  ) => {
    e.stopPropagation();
    const updatedFiles = value.filter((f: File) => f !== file);
    onChange(updatedFiles);
  };

  const handlePreview = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    file: any
  ) => {
    e.stopPropagation();
    const hostname = window.location.hostname;
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } else if (file.file_name) {
      if (hostname === "localhost") {
        window.open(`http://km.happylandgroup.biz/${file.file_name}`, "_blank");
      }
      window.open(`/${file.file_name}`, "_blank");
    }
  };

  return (
    <div
      {...getRootProps()}
      className="tw-border tw-border-dashed tw-border-gray-300 tw-p-4 tw-cursor-pointer tw-min-h-[200px]"
    >
      {value && value.length > 0 ? (
        <ul>
          {value.map((file: File, index: React.Key | null | undefined) => (
            <Card
              key={index}
              className="tw-mb-2"
              onClick={(e) => {
                handlePreview(e, file);
              }}
            >
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-between">
                <div className="tw-flex tw-flex-row tw-items-center tw-space-x-2">
                  {renderFileIcon(file)}
                  <p>{file.name}</p>
                </div>
                <div className="tw-space-x-2">
                  <CloseOutlined
                    className="hover:tw-text-red-500 tw-cursor-pointer"
                    onClick={(e) => {
                      handleRemoveFile(e, file);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
          <Card className="hover:tw-bg-gray-100">
            <p className="tw-text-gray-500 tw-text-center">
              ลากและวางไฟล์ .docx, .pdf, หรือ .xlsx ที่นี่
              หรือคลิกเพื่อเลือกไฟล์
            </p>
            <input {...getInputProps()} />
          </Card>
        </ul>
      ) : (
        <>
          <input {...getInputProps()} />
          <p className="tw-text-gray-500 tw-flex tw-justify-center tw-items-center tw-min-h-[200px]">
            ลากและวางไฟล์ .docx, .pdf, หรือ .xlsx ที่นี่ หรือคลิกเพื่อเลือกไฟล์
          </p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
