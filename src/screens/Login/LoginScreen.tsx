import React from "react";
import { Button, Input } from "antd";
import { LoginFormProps, useLoginForm } from "../../forms/LoginForm";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useLoginForm();

  const onSubmit = async (data: LoginFormProps) => {
    const res = await login(data);
    if (res[0].status === "success") {
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/");
    } else {
      setError("username", {
        type: "manual",
        message: "Login failed. Please check your username.",
      });
    }
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gradient-linear tw-p-8">
      <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-lg tw-max-w-sm tw-w-full">
        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">KM</h2>
        <form className="tw-space-y-4">
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              รหัสพนักงาน
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="รหัสพนักงาน"
                  className="tw-mt-2 tw-p-2 tw-w-full tw-border tw-border-gray-300 tw-rounded-md"
                />
              )}
            />
            {errors.username && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1">
                {errors.username.message}
              </div>
            )}
          </div>

          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="tw-w-full tw-py-2 !tw-bg-primary"
          >
            เข้าสู่ระบบ
          </Button>
        </form>
      </div>
    </div>
  );
};
