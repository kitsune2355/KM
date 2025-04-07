import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface LoginFormProps {
  username: string;
}

const schema: yup.ObjectSchema<LoginFormProps> = yup.object().shape({
  username: yup.string().required("Username is required").default(""),
});

export const useLoginForm = () => {
  return useForm<LoginFormProps>({
    defaultValues: schema.getDefault(),
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
};
