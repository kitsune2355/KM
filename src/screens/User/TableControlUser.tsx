import { Button, message, Modal, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect } from "react";
import { AddUserFormProps, useAddUserForm } from "../../forms/AddUserForm";
import {
  addUser,
  deleteUser,
  fetchAllUsers,
  fetchCompany,
} from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  DELETE_USER,
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_COMPANY_REQUEST,
  FETCH_COMPANY_SUCCESS,
  UPDATE_USER,
  User,
} from "../../redux/reducer/userReducer";
import { DeleteFilled, EditFilled, FileExcelFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  ColumnSearch as getColumnSearchProps,
  getSorter,
} from "../../components/ColumnSearch";
import ExcelImportUserPreview from "../../components/ExcelImportUserPreview";

interface TableControlUserProps {
  setActiveTab: (key: string) => void;
  activeTab: string;
}

const TableControlUser: React.FC<TableControlUserProps> = ({
  setActiveTab,
  activeTab,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { company, allUsers, isFetchingUsers } = useSelector(
    (state: RootState) => state.users
  );

  const fetchData = async () => {
    dispatch(FETCH_ALL_USERS_REQUEST());
    dispatch(FETCH_COMPANY_REQUEST());
    const res = await fetchAllUsers(navigate);
    const usrCompay = await await fetchCompany();
    dispatch(FETCH_ALL_USERS_SUCCESS(res));
    dispatch(FETCH_COMPANY_SUCCESS(usrCompay));
    return res;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "1") {
      navigate("/user-management", { replace: true });
    }
  }, [activeTab, navigate]);

  const handleDelete = async (record: User) => {
    try {
      await deleteUser(record.employeeID, navigate);
      dispatch(DELETE_USER(record.employeeID));
      fetchData();
      message.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error(error);
      message.error("มีข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleEdit = async (record: User) => {
    setActiveTab("2");
    navigate(`/user-management?id=${record.employeeID}`);
  };

  const handleStatus = async (record: User) => {
    const updatedStatus = {
      ...record,
      status: record.status === "0" ? "1" : "0",
    };
    try {
      await addUser(updatedStatus, navigate);
      dispatch(UPDATE_USER(updatedStatus));
      fetchData();
      message.success(
        updatedStatus.status === "1"
          ? " เปิดการใช้งานแล้ว"
          : "ยกเลิกการใช้งานแล้ว"
      );
    } catch (error) {
      console.error(error);
      message.error("ไม่สามารถอัปเดตสถานะการเผยแพร่ได้");
    }
  };

  const handleConfirmImport = async (data: any[]) => {
    try {
      for (const user of data) {
        const response = await addUser(user);

        if (response.status !== "success") {
          message.error("นำเข้าข้อมูลไม่สำเร็จ");
          console.error(response.message);
          return;
        }
      }

      message.success("นำเข้าข้อมูลสำเร็จทั้งหมด");

      dispatch(FETCH_ALL_USERS_REQUEST());
      const res = await fetchAllUsers();
      dispatch(FETCH_ALL_USERS_SUCCESS(res));
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
    }
  };

  const columns: ColumnsType<AddUserFormProps> = [
    {
      title: "รหัสพนักงาน",
      dataIndex: "employeeID",
      key: "employeeID",
      width: 150,
      sorter: getSorter("employeeID"),
      ...getColumnSearchProps("employeeID"),
    },
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      key: "firstName",
      width: 150,
      sorter: getSorter("firstName"),
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "นามสกุล",
      dataIndex: "lastName",
      key: "lastName",
      width: 150,
      sorter: getSorter("lastName"),
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "ตำแหน่ง",
      dataIndex: "position",
      key: "position",
      width: 150,
      sorter: getSorter("position"),
      ...getColumnSearchProps("position"),
    },
    {
      title: "แผนก",
      dataIndex: "department",
      key: "department",
      width: 150,
      sorter: getSorter("department"),
      ...getColumnSearchProps("department"),
    },
    {
      title: "ฝ่าย",
      dataIndex: "sub_department",
      key: "sub_department",
      width: 150,
      sorter: getSorter("sub_department"),
      ...getColumnSearchProps("sub_department"),
    },
    {
      title: "บริษัท",
      dataIndex: "company",
      key: "company",
      width: 150,
      sorter: getSorter("company"),
      ...getColumnSearchProps("company"),
      render: (_: any, record: any) => {
        const comp = company.find((c: any) => c.com_code === record.company);
        return comp ? comp.com_name : "";
      },
    },
    {
      title: "ระดับการใช้งาน",
      dataIndex: "role",
      key: "role",
      width: 150,
      sorter: getSorter("role"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            icon={<EditFilled />}
            shape="circle"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="คุณต้องการลบข้อมูลนี้ใช่หรือไม่?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteFilled />}
              shape="circle"
            />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: "สถานะ",
      key: "status",
      fixed: "right",
      sorter: getSorter("status"),
      render: (_: any, record: any) => (
        <Button
          size="small"
          variant="filled"
          color={record.status === "0" ? "default" : "cyan"}
          onClick={() => handleStatus(record)}
        >
          {record.status === "0" ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
        </Button>
      ),
    },
  ];

  return (
    <div className="tw-min-h-[65vh] tw-space-y-4">
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-end tw-space-y-2">
        <ExcelImportUserPreview onConfirm={handleConfirmImport} />
        <a
          href="https://km.happylandgroup.biz/API/file/ไฟล์ตั้งต้นข้อมูลนำเข้าโปรแกรมKM.xlsx"
          download
          className="tw-text-gray-400 hover:tw-text-info tw-cursor-pointer tw-text-xs"
        >
          ตัวอย่างไฟล์นำเข้า <FileExcelFilled />
        </a>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={allUsers}
        bordered
        scroll={{ x: "max-content", y: "max-content" }}
        loading={isFetchingUsers}
      />
    </div>
  );
};

export default TableControlUser;
