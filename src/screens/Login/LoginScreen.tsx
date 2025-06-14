import React from "react";
import { Button, Divider, Input } from "antd";
import { LoginFormProps, useLoginForm } from "../../forms/LoginForm";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { images } from "../../utils/imageUtils";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../redux/reducer/userReducer";
import { BookOutlined } from "@ant-design/icons";

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useLoginForm();

  const onSubmit = async (data: LoginFormProps) => {
    const res = await login(data);
    dispatch(LOGIN_SUCCESS(res[0]));
    if (res[0].status === "success") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          employeeID: res[0].employeeID,
          firstName: res[0].firstName,
          lastName: res[0].lastName,
          position: res[0].position,
          role: res[0].role,
        })
      );
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: res[0].token,
        })
      );
      navigate("/");
    } else {
      setError("username", {
        type: "manual",
        message: res[0].message,
      });
    }
  };

  return (
    <>
      <a
        href="https://km.happylandgroup.biz/API/file/คู่มือการใช้งาน.pdf"
        target="_blank"
        className="tw-fixed tw-top-4 tw-right-4 tw-z-10 tw-text-sm tw-text-white tw-flex tw-items-center tw-space-x-1 tw-cursor-pointer hover:tw-text-gray-300"
      >
        <BookOutlined />
        <span>คู่มือ</span>
      </a>
      <div className=" tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-bg-gradient-linear tw-p-8 tw-space-y-4">
        <div className="tw-bg-white tw-px-6 tw-pb-6 tw-rounded-lg tw-shadow-lg tw-max-w-sm tw-w-full tw-space-y-6">
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-1">
            <img src={images.logo} alt="logo" className="tw-h-32" />
            <Divider
              orientation="center"
              orientationMargin="0"
              className="!tw-text-primary !tw-border-primary"
            >
              <div className="">
                <p>องค์ความรู้องค์กร</p>
                <p>Knowledge Management</p>
              </div>
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
                    autoComplete="off"
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
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-text-white tw-text-sm">
          <a
            target="_blank"
            href="http://happylandgroup.net/ViewerJS/New_An.php?BS=บริษัท แฮปปี้แลนด์ กรุ๊ป จำกัด&amp;folder_0=HL&amp;folder_1=043-2568&amp;name=043-&amp;page=1"
          >
            นโยบาย
          </a>
          <Divider type="vertical" className="tw-mx-2 tw-bg-white" />
          <a
            target="_blank"
            href="https://www.happylandgroup.net/ViewerJS/An/HL/042-2568/HR-CENTER-62 แบบฟอร์มบันทึกองค์ความรู้องค์กร Ver.00 23-4-68.pdf"
          >
            แบบฟอร์มบันทึกองค์ความรู้องค์กร
          </a>
        </div>
      </div>
    </>
  );
};
