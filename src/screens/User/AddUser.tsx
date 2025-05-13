import { Button, Input, message, Select, Tree } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useAddUserForm } from "../../forms/AddUserForm";
import { addUser, fetchCompany, usrCompany } from "../../services/userService";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../../store";
import { selectCategoryState } from "../../redux/reducer/categoryReducer";

interface AddUserProps {
  setActiveTab: (key: string) => void;
  activeTab: string;
}

export const getAllKeys = (data: any[]) => {
  let keys: string[] = [];
  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      keys.push(node.path);
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  traverse(data);
  return keys;
};

const AddUser: React.FC<AddUserProps> = ({ setActiveTab, activeTab }) => {
  const navigate = useNavigate();
  const allUsers = useSelector((state: RootState) => state.users.allUsers);
  const { categories } = useSelector(selectCategoryState);
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useAddUserForm({
    defaultValues: {
      permission: getAllKeys(categories),
    },
  });
  const [searchParams] = useSearchParams();
  const userId = useMemo(() => searchParams.get("id"), [searchParams]);
  const [company, setCompany] = useState<usrCompany[]>([]);

  const onStart = () => {
    if (userId) {
      const user = allUsers.find((user) => user.employeeID === userId);
      if (user) {
        setValue("employeeID", user.employeeID);
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("position", user.position);
        setValue("department", user.department);
        setValue("sub_department", user.sub_department);
        setValue("company", user.company);
        setValue("role", user.role);
        setValue("status", user.status);
        setValue("permission", user.permission);
      }
    }
  };

  const onSubmit = async (data: any) => {
    const user = {
      employeeID: data.employeeID,
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      department: data.department,
      sub_department: data.sub_department,
      company: data.company,
      role: data.role,
      status: data.status,
      permission: data.permission,
    };

    try {
      const res = await addUser(user, navigate);
      if (res.status === "success") {
        message.success("เพิ่มผู้ใช้สำเร็จ");
        reset();
        setActiveTab("1");
      } else {
        message.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
    }
  };

  const getCompany = async () => {
    const res = await fetchCompany();
    setCompany(res);
  };

  useEffect(() => {
    getCompany();
  }, []);

  useEffect(() => {
    onStart();
  }, [onStart]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tw-min-h-[65vh] tw-space-y-4">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>รหัสพนักงาน</p>
            <Controller
              control={control}
              name="employeeID"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="รหัสพนักงาน"
                  disabled={userId ? true : false}
                />
              )}
            />
            {errors.employeeID && (
              <div className="tw-text-red-500">{errors.employeeID.message}</div>
            )}
          </div>

          <div className="tw-col-span-12 tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <p>ชื่อ</p>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => <Input {...field} placeholder="ชื่อ" />}
              />
              {errors.firstName && (
                <div className="tw-text-red-500">
                  {errors.firstName.message}
                </div>
              )}
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <p>นามสกุล</p>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input {...field} placeholder="นามสกุล" />
                )}
              />
              {errors.lastName && (
                <div className="tw-text-red-500">{errors.lastName.message}</div>
              )}
            </div>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>ตำแหน่ง</p>
            <Controller
              control={control}
              name="position"
              render={({ field }) => <Input {...field} placeholder="ตำแหน่ง" />}
            />
            {errors.position && (
              <div className="tw-text-red-500">{errors.position.message}</div>
            )}
          </div>

          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>แผนก</p>
            <Controller
              control={control}
              name="department"
              render={({ field }) => <Input {...field} placeholder="แผนก" />}
            />
            {errors.department && (
              <div className="tw-text-red-500">{errors.department.message}</div>
            )}
          </div>

          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>ฝ่าย</p>
            <Controller
              control={control}
              name="sub_department"
              render={({ field }) => <Input {...field} placeholder="ฝ่าย" />}
            />
            {errors.sub_department && (
              <div className="tw-text-red-500">
                {errors.sub_department.message}
              </div>
            )}
          </div>

          <div className="tw-col-span-12">
            <p>บริษัท</p>
            <Controller
              control={control}
              name="company"
              render={({ field }) => (
                <Select
                  {...field}
                  className="tw-w-full"
                  placeholder="บริษัท"
                  options={company.map((item) => ({
                    value: item.com_name,
                    label: item.com_name,
                  }))}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.company && (
              <div className="tw-text-red-500">{errors.company.message}</div>
            )}
          </div>

          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>ระดับการใช้งาน</p>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  {...field}
                  className="tw-w-full"
                  placeholder="สิทธิ์การใช้งาน"
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ]}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.role && (
              <div className="tw-text-red-500">{errors.role.message}</div>
            )}
          </div>

          <div className="tw-col-span-12 md:tw-col-span-4">
            <p>สถานะการใช้งาน</p>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  {...field}
                  className="tw-w-full"
                  placeholder="สถานะการใช้งาน"
                  options={[
                    { value: "1", label: "เปิดการใช้งาน" },
                    { value: "0", label: "ปิดการใช้งาน" },
                  ]}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.status && (
              <div className="tw-text-red-500">{errors.status.message}</div>
            )}
          </div>

          <div className="tw-col-span-12">
            <p>สิทธิ์การเข้าถึงเอกสาร</p>
            <div className="tw-p-4 tw-rounded-md tw-border tw-border-tertiary">
              <Controller
                name="permission"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="tw-flex tw-flex-col">
                    <Tree
                      checkable
                      // checkStrictly={true}
                      treeData={categories.map(({ children, ...rest }) => ({
                        ...rest,
                        children: [],
                      }))}
                      fieldNames={{
                        title: "title",
                        key: "path",
                      }}
                      checkedKeys={value}
                      onCheck={(checkedKeys) => {
                        const checkedArray = Array.isArray(checkedKeys)
                          ? checkedKeys
                          : checkedKeys.checked;
                        onChange(checkedArray);
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="tw-flex tw-flex-row tw-justify-end tw-items-center">
          <Button
            type="primary"
            htmlType="submit"
            className="tw-w-24 tw-bg-primary"
          >
            บันทึก
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddUser;
