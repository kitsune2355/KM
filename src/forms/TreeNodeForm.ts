import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface TreeNodeFormProps {
  title: string;
  key?: string;
  children?: TreeNodeFormProps[];
}

const schema: yup.ObjectSchema<TreeNodeFormProps> = yup.object().shape({
  title: yup.string().required("Title is required").default(""),
  key: yup.string().default(""),
  children: yup
    .array()
    .of(yup.lazy(() => schema))
    .default([]),
});

export const useTreeNodeForm = () => {
  return useForm<TreeNodeFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
