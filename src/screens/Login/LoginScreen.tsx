import React from "react";
import { Button, Divider, Input } from "antd";
import { LoginFormProps, useLoginForm } from "../../forms/LoginForm";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { images } from "../../utils/imageUtils";

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
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-bg-gradient-linear tw-p-8 tw-space-y-4">
      <div className="tw-bg-white tw-px-6 tw-pb-6 tw-rounded-lg tw-shadow-lg tw-max-w-sm tw-w-full tw-space-y-6">
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-1">
          <img src={images.logo} alt="logo" className="tw-h-32" />
          <Divider
            orientation="center"
            orientationMargin="0"
            className="!tw-text-primary !tw-border-primary"
          >
            Knowledge Management
          </Divider>
        </div>
        <form className="tw-space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="">
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
            htmlType="submit"
            className="tw-w-full tw-py-2 !tw-bg-primary"
          >
            เข้าสู่ระบบ
          </Button>
        </form>
      </div>
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-text-sm">
        <a
          target="_blank"
          href="http://happylandgroup.net/ViewerJS/New_An.php?BS=บริษัท แฮปปี้แลนด์ กรุ๊ป จำกัด&amp;folder_0=HL&amp;folder_1=043-2568&amp;name=043-&amp;page=1"
        >
          ประกาศที่ 043-2568 - นโยบายการบันทึกความรู้องค์ความรู้ภายในองค์กร Ver
          23-04-68
        </a>
        <a
          target="_blank"
          href="https://www.happylandgroup.net/ViewerJS/An/HL/042-2568/HR-CENTER-62 แบบฟอร์มบันทึกองค์ความรู้องค์กร Ver.00 23-4-68.pdf"
        >
          แบบฟอร์ม HR-CENTER-62 แบบฟอร์มบันทึกองค์ความรู้องค์กร Ver.00 23-04-68
        </a>
      </div>
    </div>
  );
};
