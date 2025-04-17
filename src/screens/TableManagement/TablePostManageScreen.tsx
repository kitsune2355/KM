import { Card, Table, Button, Space, Popconfirm, Divider } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../services/postService";
import { FETCH_POSTS } from "../../redux/reducer/postReducer";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const TablePostManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchData = async () => {
    try {
      const response = await getPosts();
      dispatch(FETCH_POSTS(response));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (record: any) => {
    console.log("Edit post:", record);
    navigate(`/new-post?id=${record.id}`);
  };

  const handleDelete = (record: any) => {
    console.log("Deleted post:", record);
  };

  const handlePublish = (record: any) => {
    console.log("Published post:", record);
  };

  const columns = [
    {
      title: "หัวข้อ",
      dataIndex: "post_title",
      key: "post_title",
    },
    {
      title: "หมวดหมู่",
      dataIndex: "categories_title",
      key: "categories_title",
    },
    {
      title: "รายละเอียด",
      dataIndex: "post_desc",
      key: "post_desc",
    },
    {
      title: "ผู้สร้าง",
      dataIndex: "post_create_by",
      key: "post_create_by",
    },
    {
      title: "Actions",
      key: "actions",
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
            title="Are you sure to delete this post?"
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
      render: (_: any, record: any) => (
        <Button
          size="small"
          variant="filled"
          color={record.status === "published" ? "default" : "cyan"}
          onClick={() => handlePublish(record)}
        >
          {record.status === "published" ? "ยกเลิก" : "เผยแพร่"}
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
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
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
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        />
      </Card>
    </>
  );
};
