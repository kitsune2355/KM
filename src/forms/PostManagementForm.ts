import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface PostManagementFormProps {
  title: string;
  category: string;
  description: string;
  contents:  string;
  files: string[];
}

const schema: yup.ObjectSchema<PostManagementFormProps> = yup.object().shape({
  title: yup.string().required("Title is required").default(""),
  category: yup.string().required("Category is required").default(""),
  description: yup.string().required("Description is required").default(""),
  contents: yup.string().required("Contents is required").default(""),
  files: yup.array().of(yup.string().required()).default([]),
});

export const usePostManagementForm = () => {
  return useForm<PostManagementFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
