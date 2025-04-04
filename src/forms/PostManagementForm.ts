import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface PostManagementFormProps {
  title: string;
  category: string;
  description: string;
  contents?: string;
  files?: string[];
}

const schema: yup.ObjectSchema<PostManagementFormProps> = yup.object().shape({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  contents: yup.string().default(""),
  files: yup.array().of(yup.string().required()),
});

export const usePostManagementForm = () => {
  return useForm<PostManagementFormProps>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      contents: "",
      files: [],
    },
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
