import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface PostManagementFormProps {
  title: string;
  category: string;
  description: string;
  contents?: string;
  files?: File[];
}

const schema: yup.ObjectSchema<PostManagementFormProps> = yup.object().shape({
  title: yup.string().required("จำเป็นต้องกรอกหัวข้อ").default(""),
  category: yup.string().required("จำเป็นต้องเลือกหมวดหมู่"),
  description: yup.string().default(""),
  contents: yup.string().default(""),
  files: yup.array().default([]),
});

export const usePostManagementForm = () => {
  return useForm<PostManagementFormProps>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
