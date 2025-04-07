import React from "react";
import { Button, Input } from "antd";
import { LoginFormProps, useLoginForm } from "../../forms/LoginForm";
import { Controller } from "react-hook-form";

export const LoginScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useLoginForm();

  const onSubmit = async (data: LoginFormProps) => {
    const res = await fetch("http://localhost/api_km/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
      }),
    });
    const dataKM = await res.json();
    console.log("res :>> ", res);
    console.log("dataKM :>> ", dataKM);
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-background">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg tw-max-w-sm tw-w-full">
        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">
          Login
        </h2>
        <form className="tw-space-y-4">
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your username"
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
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};
