import React from 'react'
import { Button, Input } from 'antd';
import { LoginFormProps, useLoginForm } from '../../forms/LoginForm';
import { Controller } from 'react-hook-form';

export const LoginScreen:React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useLoginForm();

  const onSubmit = (data: LoginFormProps) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-background">
      <div className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-lg tw-max-w-sm tw-w-full">
        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-4">
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Username</label>
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
              <div className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.username.message}</div>
            )}
          </div>

          <div className="tw-mb-6">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter your password"
                  className="tw-mt-2 tw-p-2 tw-w-full tw-border tw-border-gray-300 tw-rounded-md"
                />
              )}
            />
            {errors.password && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1">{errors.password.message}</div>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="tw-w-full tw-py-2 !tw-bg-primary"
          >
            Log In
          </Button>
        </form>

        <div className="tw-text-center tw-mt-4 tw-text-sm">
          <a href="#" className="tw-text-blue-600 tw-hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  )
}
