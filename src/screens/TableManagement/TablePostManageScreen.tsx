import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  Divider,
  message,
  Tag,
  InputRef,
  Input,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, Post } from "../../services/postService";
import { DELETE_POST, selectPostState } from "../../redux/reducer/postReducer";
import {
  DeleteFilled,
  EditFilled,
  FileOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../redux/actions/postActions";
import { ColumnsType } from "antd/es/table";
import { typeKM, typeKnowledge } from "../../config/constant";
import { ColumnSearch as getColumnSearchProps, getSorter } from "../../components/ColumnSearch";

export const TablePostManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isFetchingPosts } = useSelector(selectPostState);
  const [count, setCount] = useState<number>(posts.length);

  const fetchData = useCallback(async () => {
    try {
      await dispatch(fetchPosts());
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
      await deletePost(record.id);
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
      await addPost(updatedPost);
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
          scroll={{ x: "max-content", y: 500 }}
          tableLayout="fixed"
          onChange={(pagination, filters, sorter, extra) => {
            const count = extra.currentDataSource.length;
            setCount(count);
          }}
          loading={isFetchingPosts}
        />
        <p>แสดงทั้งหมด {count} รายการ</p>
      </Card>
    </>
  );
};
