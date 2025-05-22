import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message } from "antd";
import * as XLSX from "xlsx";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_COMPANY_REQUEST,
  FETCH_COMPANY_SUCCESS,
} from "../redux/reducer/userReducer";
import { fetchCompany } from "../services/userService";

interface ExcelImportPreviewProps {
  onConfirm: (data: any[]) => Promise<void>;
}

const ExcelImportPreview: React.FC<ExcelImportPreviewProps> = ({
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const { company } = useSelector((state: RootState) => state.users);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCompany = async () => {
    dispatch(FETCH_COMPANY_REQUEST());
    const res = await fetchCompany();
    dispatch(FETCH_COMPANY_SUCCESS(res));
  };

  useEffect(() => {
    getCompany();
  }, []);

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        });

        if (jsonData.length === 0) return;

        const user = jsonData[0];
        const permissionMap: Record<string, string[]> = {
          HL: ["2"],
          CNS: ["2", "3"],
          PRO: ["2", "4"],
          AS: ["2", "36"],
          CIC: ["2", "37"],
        };

        const permissions = permissionMap[user.company] || [];
        let userData = jsonData.map((user) => ({
          ...user,
          role:'user',
          status: "0",
          permission: permissions,
        }));

        setPreviewData(userData);
        setIsModalVisible(true);
      } catch (error) {
        console.error("Excel import error:", error);
        message.error("เกิดข้อผิดพลาดในการนำเข้าไฟล์ Excel");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleConfirmImport = async () => {
    try {
      setLoading(true);
      await onConfirm(previewData);
      // message.success("นำเข้าข้อมูลเรียบร้อยแล้ว");
      setIsModalVisible(false);
      setPreviewData([]);
    } catch (error) {
      console.error(error);
      message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    { title: "รหัสพนักงาน", dataIndex: "employeeID", key: "employeeID" },
    { title: "ชื่อ", dataIndex: "firstName", key: "firstName" },
    { title: "นามสกุล", dataIndex: "lastName", key: "lastName" },
    { title: "ตำแหน่ง", dataIndex: "position", key: "position" },
    { title: "แผนก", dataIndex: "department", key: "department" },
    { title: "ฝ่าย", dataIndex: "sub_department", key: "sub_department" },
    {
      title: "บริษัท",
      dataIndex: "company",
      key: "company",
      render: (text: string) =>
        company.find((c) => c.com_code === text)?.com_name,
    },
  ];

  return (
    <>
      <Button
        variant="filled"
        color="cyan"
        onClick={() => document.getElementById("excelUploadInput")?.click()}
      >
        Import Excel
      </Button>
      <input
        id="excelUploadInput"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleImportExcel}
        style={{ display: "none" }}
      />

      <Modal
        title="ตรวจสอบข้อมูลก่อนนำเข้า"
        open={isModalVisible}
        onOk={handleConfirmImport}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={"90%"}
        height={"80vh"}
      >
        <Table
          dataSource={previewData}
          columns={userColumns}
          rowKey={(row) => row.employeeID || row.id || JSON.stringify(row)}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Modal>
    </>
  );
};

export default ExcelImportPreview;
