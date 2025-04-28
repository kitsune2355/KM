import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface AddUserFormProps {
  employeeID: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  sub_department: string;
  company: string;
  role: string;
  status: string;
}

const schema: yup.ObjectSchema<AddUserFormProps> = yup.object().shape({
  employeeID: yup.string().required("จำเป็นต้องกรอกรหัสพนักงาน").default(""),
  firstName: yup.string().required("จำเป็นต้องกรอกชื่อ").default(""),
  lastName: yup.string().required("จำเป็นต้องกรอกนามสกุล").default(""),
  position: yup.string().required("จำเป็นต้องกรอกตำแหน่ง").default(""),
  department: yup.string().required("จำเป็นต้องกรอกแผนก").default(""),
  sub_department: yup.string().required("จำเป็นต้องกรอกฝ่าย").default(""),
  company: yup.string().required("จำเป็นต้องกรอกบริษัท").default(""),
  role: yup.string().required("จำเป็นต้องกรอกสิทธิ์"),
  status: yup.string().required("จำเป็นต้องกรอกสถานะ"),
});

export const useAddUserForm = () => {
  return useForm<AddUserFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
