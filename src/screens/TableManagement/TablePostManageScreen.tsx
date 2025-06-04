import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  Divider,
  message,
  Tag,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, Post } from "../../services/postService";
import { DELETE_POST, selectPostState } from "../../redux/reducer/postReducer";
import {
  DeleteFilled,
  EditFilled,
  FileOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../redux/actions/postActions";
import { ColumnsType } from "antd/es/table";
import { typeKM, typeKnowledge } from "../../config/constant";
import {
  ColumnSearch as getColumnSearchProps,
  getSorter,
} from "../../components/ColumnSearch";
import { formatThaiDate } from "../Posts/PostContentScreen";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const TablePostManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isFetchingPosts } = useSelector(selectPostState);
  const [count, setCount] = useState<number>(posts.length);

  const fetchData = useCallback(async () => {
    try {
      await dispatch(fetchPosts(navigate));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCount(posts.length);
  }, [posts]);

  const handleEdit = (record: any) => {
    navigate(`/new-post?id=${record.id}`);
  };

  const handleDelete = async (record: any) => {
    try {
      await deletePost(record.id, navigate);
      dispatch(DELETE_POST(record.id));
      fetchData();
      message.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error(error);
      message.error("มีข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handlePreview = (record: any) => {
    navigate(`/file-preview/${record.id}`);
  };

  const handlePublish = async (record: any) => {
    const updatedPost = {
      ...record,
      post_publish: record.post_publish === "0" ? "1" : "0",
    };
    try {
      await addPost(updatedPost, navigate);
      dispatch({
        type: "UPDATE_POST",
        payload: updatedPost,
      });
      fetchData();
      message.success(
        updatedPost.post_publish === "1" ? "เผยแพร่แล้ว" : "ยกเลิกการเผยแพร่"
      );
    } catch (error) {
      console.error(error);
      message.error("ไม่สามารถอัปเดตสถานะการเผยแพร่ได้");
    }
  };

  const htmlToText = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const exportToExcel = () => {
    if (!posts.length) {
      message.warning("ไม่มีข้อมูลให้ส่งออก");
      return;
    }

    const exportData = posts.map((post) => ({
      เลขที่องค์ความรู้: post.post_format,
      ชื่อเรื่ององค์ความรู้: post.post_title,
      หมวดหมู่: post.categories_title,
      ประเภทขององค์ความรู้:
        typeKnowledge.find((t) => t.value === post.post_type)?.label || "",
      ชื่อ: post.post_fname,
      นามสกุล: post.post_lname,
      ตำแหน่ง: post.post_position,
      แผนก: post.post_depm,
      ฝ่าย: post.post_sub_depm,
      ประเภทเนื้อหา: typeKM
        .filter((item) => JSON.parse(post.post_contents).includes(item.value))
        .map((item) => item.label)
        .join(", "),
      รายละเอียด: htmlToText(post.post_desc),
      ประโยชน์ขององค์ความรู้: htmlToText(post.post_benefit),
      วันที่ทำเอกสาร: formatThaiDate(post.post_date),
      วันที่สร้าง: post.post_create_at as string,
      สถานะ: post.post_publish === "1" ? "เผยแพร่" : "ไม่เผยแพร่",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // ✅ ปรับขนาดคอลัมน์อัตโนมัติตามเนื้อหา ยกเว้นคอลัมน์ "รายละเอียด" และ "ประโยชน์ขององค์ความรู้"
    type ExportRow = (typeof exportData)[number];
    const keys = Object.keys(exportData[0]) as (keyof ExportRow)[];

    const colWidths = keys.map((key) => {
      if (key === "รายละเอียด" || key === "ประโยชน์ขององค์ความรู้") {
        return { wch: 30 };
      }
      const maxLength = Math.max(
        key.length,
        ...exportData.map((row) => row[key]?.toString().length ?? 0)
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "รายงาน_องค์ความรู้.xlsx");
  };

  const columns: ColumnsType<Post> = [
    {
      title: "ข้อมูลทั่วไป",
      children: [
        {
          title: "เลขที่องค์ความรู้",
          dataIndex: "post_format",
          key: "post_format",
          width: 200,
          sorter: getSorter("post_format"),
          ...getColumnSearchProps("post_format"),
        },
        {
          title: "ชื่อเรื่ององค์ความรู้",
          dataIndex: "post_title",
          key: "post_title",
          width: 350,
          sorter: getSorter("post_title"),
          ...getColumnSearchProps("post_title"),
        },
        {
          title: "หมวดหมู่",
          dataIndex: "categories_title",
          key: "categories_title",
          width: 300,
          sorter: getSorter("categories_title"),
          ...getColumnSearchProps("categories_title"),
        },
        {
          title: "ประเภทขององค์ความรู้",
          key: "post_type",
          width: 200,
          sorter: (a, b) => {
            const labelA =
              typeKnowledge.find((t) => t.value === a.post_type)?.label || "";
            const labelB =
              typeKnowledge.find((t) => t.value === b.post_type)?.label || "";
            return labelA.localeCompare(labelB);
          },
          filters: typeKnowledge.map((type) => ({
            text: type.label,
            value: type.value,
          })),
          onFilter: (value, record) => {
            return record.post_type === value;
          },
          render: (_, record) => (
            <div>
              {typeKnowledge
                .filter((type) => type.value === record.post_type)
                .map((item, key) => (
                  <Tag
                    color={item.value === "1" ? "green" : "orange"}
                    key={key}
                    className="tw-truncate"
                  >
                    {item.label}
                  </Tag>
                ))}
            </div>
          ),
        },
        {
          title: "ผู้สร้าง",
          children: [
            {
              title: "ชื่อ",
              dataIndex: "post_fname",
              key: "post_fname",
              width: 150,
              sorter: getSorter("post_fname"),
            },
            {
              title: "นามสกุล",
              dataIndex: "post_lname",
              key: "post_lname",
              width: 150,
              sorter: getSorter("post_lname"),
            },
            {
              title: "ตำแหน่ง",
              dataIndex: "post_position",
              key: "post_position",
              width: 150,
              sorter: getSorter("post_position"),
            },
            {
              title: "แผนก",
              dataIndex: "post_depm",
              key: "post_depm",
              width: 150,
              sorter: getSorter("post_depm"),
            },
            {
              title: "ฝ่าย",
              dataIndex: "post_sub_depm",
              key: "post_sub_depm",
              width: 150,
              sorter: getSorter("post_sub_depm"),
            },
          ],
        },
      ],
    },
    {
      title: "เนื้อหาขององค์ความรู้",
      children: [
        {
          title: "ประเภทขององค์ความรู้",
          key: "post_contents",
          width: 350,
          render: (_: any, record: any) => (
            <div className="">
              {typeKM
                .filter((item) =>
                  JSON.parse(record.post_contents).includes(item.value)
                )
                .map((item, key) => (
                  <div key={key}>
                    <span>- {item.label}</span>
                  </div>
                ))}
            </div>
          ),
        },
        {
          title: "รายละเอียดขององค์ความรู้",
          key: "post_desc",
          width: 350,
          render: (_: any, record: any) => (
            <p
              className="tw-text-ellipsis tw-line-clamp-2"
              dangerouslySetInnerHTML={{ __html: record.post_desc }}
            />
          ),
        },
        {
          title: "ประโยชน์ขององค์ความรู้",
          key: "post_benefit",
          width: 350,
          render: (_: any, record: any) => (
            <p
              className="tw-text-ellipsis tw-line-clamp-2"
              dangerouslySetInnerHTML={{ __html: record.post_benefit }}
            />
          ),
        },
        {
          title: "เอกสาร/ไฟล์แนบ",
          key: "files",
          width: 100,
          render: (_: any, record: any) => {
            return (
              <>
                {record.files.length > 0 && (
                  <div
                    className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-space-y-2 tw-cursor-pointer"
                    onClick={() => handlePreview(record)}
                  >
                    <FileOutlined />
                    <p className="tw-text-gray-500">
                      {record.files.length} ไฟล์
                    </p>
                  </div>
                )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "วันที่ทำเอกสาร",
      key: "post_date",
      width: 150,
      sorter: getSorter("post_date"),
      render: (_: any, record: any) => (
        <span>{formatThaiDate(record.post_date)}</span>
      ),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "post_create_at",
      key: "post_create_at",
      width: 150,
      sorter: getSorter("post_create_at"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
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
      key: "post_publish",
      fixed: "right",
      width: 100,
      sorter: getSorter("post_publish"),
      render: (_: any, record: any) => (
        <Button
          size="small"
          variant="filled"
          color={record.post_publish === "0" ? "default" : "cyan"}
          onClick={() => handlePublish(record)}
        >
          {record.post_publish === "0" ? "ไม่เผยแพร่" : "เผยแพร่"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
        >
          การจัดการองค์ความรู้องค์กร
        </Divider>
      </div>
      <Card className="tw-min-h-[65vh]">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-end tw-gap-1 tw-mb-2">
          <Button
            className="!tw-text-primary"
            onClick={() => navigate("/category")}
          >
            สร้างหมวดหมู่
          </Button>
          <Button
            type="primary"
            className="!tw-bg-primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/new-post")}
          >
            ยื่นแบบฟอร์มบันทึกองค์ความรู้
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={posts}
          bordered
          scroll={{ x: "max-content", y: "max-content" }}
          tableLayout="fixed"
          onChange={(pagination, filters, sorter, extra) => {
            const count = extra.currentDataSource.length;
            setCount(count);
          }}
          loading={isFetchingPosts}
        />
        <div className="tw-flex tw-justify-between tw-items-center">
          <p>แสดงทั้งหมด {count} รายการ</p>
          <Button variant="outlined" color="primary" onClick={exportToExcel}>
            Export Excel
          </Button>
        </div>
      </Card>
    </>
  );
};
