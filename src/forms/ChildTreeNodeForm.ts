import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface ChildTreeNodeFormProps {
  title: string;
  key?: string;
  children?: ChildTreeNodeFormProps[];
}

const schema: yup.ObjectSchema<ChildTreeNodeFormProps> = yup.object().shape({
  title: yup.string().required("จำเป็นต้องกรอกชื่อหมวดหมู่ย่อย").default(""),
  key: yup.string().default(""),
  children: yup
    .array()
    .of(yup.lazy(() => schema))
    .default([]),
});

export const useChildTreeNodeForm = () => {
  return useForm<ChildTreeNodeFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
