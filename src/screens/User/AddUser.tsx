import { Button, Input, Select } from "antd";
import React from "react";

const AddUser: React.FC = () => {
  return (
    <div className="tw-min-h-[65vh] tw-space-y-4">
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        <div className="tw-col-span-12 md:tw-col-span-4">
          <p>รหัสพนักงาน</p>
          <Input placeholder="รหัสพนักงาน" />
        </div>
        <div className="tw-col-span-12">
          <p>ชื่อ-นามสกุล</p>
          <Input placeholder="ชื่อ-นามสกุล" />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-4">
          <p>ตำแหน่ง </p>
          <Input placeholder="ตำแหน่ง " />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-4">
          <p>แผนก </p>
          <Input placeholder="แผนก " />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-4">
          <p>ฝ่าย </p>
          <Input placeholder="ฝ่าย " />
        </div>
        <div className="tw-col-span-12">
          <p>บริษัท</p>
          <Input placeholder="บริษัท" />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-4 ">
          <p>สถานะการใช้งาน</p>
          <Select
            className="tw-w-full"
            placeholder="สถานะการใช้งาน"
            options={[
              { value: "1", label: "เปิดการใช้งาน" },
              { value: "2", label: "ปิดการใช้งาน" },
            ]}
          />
        </div>
      </div>

      <div className="tw-flex tw-flex-row tw-justify-end tw-items-center">
        <Button type="primary" className="tw-w-24 tw-bg-primary">
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default AddUser;
