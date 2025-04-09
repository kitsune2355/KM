import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface EditCategoryFormProps {
  title: string;
}

const schema: yup.ObjectSchema<EditCategoryFormProps> = yup.object().shape({
    title: yup.string().default(""),
});

export const useEditCategoryForm = () => {
  return useForm<EditCategoryFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
