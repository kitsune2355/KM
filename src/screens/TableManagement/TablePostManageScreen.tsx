import { Card, Table, Button, Space, Popconfirm } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../services/postService";
import { FETCH_POSTS } from "../../redux/reducer/postReducer";
import { RootState } from "../../redux/reducer/postReducer";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

const mockPosts = [
  {
    id: 1,
    post_title: "React Tips and Tricks",
    post_ctg_id: "Frontend",
    post_desc: "Useful techniques to improve your React apps.",
    post_create_by: "Admin",
    status: "draft",
  },
  {
    id: 2,
    post_title: "Understanding Redux Toolkit",
    post_ctg_id: "Frontend",
    post_desc: "A guide to managing state in React apps.",
    post_create_by: "Editor",
    status: "published",
  },
  {
    id: 3,
    post_title: "Node.js Performance Tuning",
    post_ctg_id: "Backend",
    post_desc: "Improve the performance of your Node.js server.",
    post_create_by: "Admin",
    status: "draft",
  },
  {
    id: 4,
    post_title: "Database Indexing 101",
    post_ctg_id: "Database",
    post_desc: "Learn the basics of indexing in SQL databases.",
    post_create_by: "User123",
    status: "published",
  },
];

export const TablePostManageScreen: React.FC = () => {
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

  console.log("posts", posts);

  const handleEdit = (record: any) => {
    console.log("Edit post:", record);
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
      dataIndex: "post_ctg_id",
      key: "post_title",
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
    <Card title="Manage Posts">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={posts}
        bordered
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10, position: ["bottomCenter"] }}
      />
    </Card>
  );
};
