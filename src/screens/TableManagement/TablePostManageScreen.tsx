import { Card, Table, Button, Space, Popconfirm, Divider, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, Post } from "../../services/postService";
import { DELETE_POST } from "../../redux/reducer/postReducer";
import { DeleteFilled, EditFilled, FileOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../redux/actions/postActions";
import { ColumnsType } from "antd/es/table";
import { typeKM } from "../Posts/PostManagementScreen";

export const TablePostManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchPosts());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          title: "ชื่อเรื่ององค์ความรู้",
          dataIndex: "post_title",
          key: "post_title",
        },
        {
          title: "หมวดหมู่",
          dataIndex: "categories_title",
          key: "categories_title",
        },
        {
          title: "ประเภทขององค์ความรู้",
          dataIndex: "post_type",
          key: "post_type",
        },
        {
          title: "ผู้สร้าง",
          children: [
            {
              title: "ชื่อ",
              dataIndex: "post_fname",
              key: "post_fname",
            },
            {
              title: "นามสกุล",
              dataIndex: "post_lname",
              key: "post_lname",
            },
            {
              title: "ตำแหน่ง",
              dataIndex: "post_position",
              key: "post_position",
            },
            {
              title: "แผนก",
              dataIndex: "post_depm",
              key: "post_depm",
            },
            {
              title: "ฝ่าย",
              dataIndex: "post_sub_depm",
              key: "post_sub_depm",
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
          render: (_: any, record: any) => (
            <p className="">
              {typeKM
                .filter((item) =>
                  JSON.parse(record.post_contents).includes(item.value)
                )
                .map((item, key) => (
                  <div key={key}>
                    <span>- {item.label}</span>
                  </div>
                ))}
            </p>
          ),
        },
        {
          title: "รายละเอียดขององค์ความรู้",
          key: "post_desc",
          width: 350,
          render: (_: any, record: any) => (
            <p className="tw-text-ellipsis tw-line-clamp-2">
              {record.post_desc}
            </p>
          ),
        },
        {
          title: "ประโยชน์ขององค์ความรู้",
          key: "post_benefit",
          width: 350,
          render: (_: any, record: any) => (
            <p className="tw-text-ellipsis tw-line-clamp-2">
              {record.post_benefit}
            </p>
          ),
        },
        {
          title: "เอกสาร/ไฟล์แนบ",
          key: "files",
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
      key: "post_publish",
      fixed: "right",
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
          การจัดการบทความ
        </Divider>
      </div>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={posts}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{ current: 1, pageSize: 10, position: ["bottomRight"] }}
        />
      </Card>
    </>
  );
};
