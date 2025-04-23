import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface PostManagementFormProps {
  title: string;
  category: string;
  date: string;
  type: string;
  prefixName: string;
  fname: string;
  lname: string;
  position: string;
  department: string;
  sub_department: string;
  contents: string[];
  description: string;
  benefit: string;
  attachments: string;
  files: File[];
  comment: string;
}

const schema: yup.ObjectSchema<PostManagementFormProps> = yup.object().shape({
  title: yup.string().required("จำเป็นต้องกรอกหัวข้อ").default(""),
  category: yup.string().required("จำเป็นต้องเลือกหมวดหมู่").default(""),
  date: yup.string().required("จำเป็นต้องกรอกวันที่").default(""),
  type: yup
    .string()
    .required("จำเป็นต้องเลือกประเภทขององค์ความรู้")
    .default(""),
  prefixName: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกคำนำหน้า"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  fname: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกชื่อ"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  lname: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกนามสกุล"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  position: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกตำแหน่ง"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  department: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกแผนก"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  sub_department: yup
    .string()
    .when("type", {
      is: (val: string) => val !== "2",
      then: (schema) => schema.required("จำเป็นต้องกรอกฝ่าย"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  contents: yup.array().default([]),
  description: yup.string().default(""),
  benefit: yup.string().default(""),
  attachments: yup.string().required("จำเป็นต้องเลือก").default(""),
  files: yup.array().default([]),
  comment: yup.string().default(""),
});

export const usePostManagementForm = () => {
  return useForm<PostManagementFormProps>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
