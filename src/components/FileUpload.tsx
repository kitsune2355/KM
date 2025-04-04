import React from "react";
import { useDropzone } from "react-dropzone";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value: any;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, value }) => {
  console.log("file upload :>> ", value);

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
      console.log(acceptedFiles);
      onChange(acceptedFiles);
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

  return (
    <div
      {...getRootProps()}
      className="tw-border tw-border-dashed tw-border-gray-300 tw-p-4 tw-cursor-pointer"
    >
      <input {...getInputProps()} />
      {value && value.length > 0 ? (
        <ul>
          {value.map((file: File, index: React.Key | null | undefined) => (
            <li key={index}>
              {renderFileIcon(file)} {file.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="tw-text-gray-500">
          ลากและวางไฟล์ .docx, .pdf, หรือ .xlsx ที่นี่ หรือคลิกเพื่อเลือกไฟล์
        </p>
      )}
    </div>
  );
};

export default FileUpload;
