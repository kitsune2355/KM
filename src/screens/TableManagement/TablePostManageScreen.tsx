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
import { DELETE_POST } from "../../redux/reducer/postReducer";
import {
  DeleteFilled,
  EditFilled,
  FileOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../../redux/actions/postActions";
import { ColumnsType } from "antd/es/table";
import { typeKM, typeKnowledge } from "../../config/constant";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

export const TablePostManageScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

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

  const getSorter = (
    field: string,
    type: "string" | "number" | "date" = "string"
  ) => {
    return (a: any, b: any) => {
      const valA = a[field];
      const valB = b[field];

      if (type === "number") {
        return (valA || 0) - (valB || 0);
      }

      if (type === "date") {
        return new Date(valA).getTime() - new Date(valB).getTime();
      }

      return (valA || "").toString().localeCompare((valB || "").toString());
    };
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex: keyof Post): ColumnType<Post> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "cyan" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) ?? false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<Post> = [
    {
      title: "ข้อมูลทั่วไป",
      children: [
        {
          title: "ชื่อเรื่ององค์ความรู้",
          dataIndex: "post_title",
          key: "post_title",
          sorter: getSorter("post_title"),
          ...getColumnSearchProps("post_title"),
        },
        {
          title: "หมวดหมู่",
          dataIndex: "categories_title",
          key: "categories_title",
          sorter: getSorter("categories_title"),
        },
        {
          title: "ประเภทขององค์ความรู้",
          key: "post_type",
          sorter: (a, b) => {
            const labelA =
              typeKnowledge.find((t) => t.value === a.post_type)?.label || "";
            const labelB =
              typeKnowledge.find((t) => t.value === b.post_type)?.label || "";
            return labelA.localeCompare(labelB);
          },
          render: (_, record) => (
            <div>
              {typeKnowledge
                .filter((type) => type.value === record.post_type)
                .map((item, key) => (
                  <Tag
                    color={item.value === "1" ? "pink" : "purple"}
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
              sorter: getSorter("post_fname"),
            },
            {
              title: "นามสกุล",
              dataIndex: "post_lname",
              key: "post_lname",
              sorter: getSorter("post_lname"),
            },
            {
              title: "ตำแหน่ง",
              dataIndex: "post_position",
              key: "post_position",
              sorter: getSorter("post_position"),
            },
            {
              title: "แผนก",
              dataIndex: "post_depm",
              key: "post_depm",
              sorter: getSorter("post_depm"),
            },
            {
              title: "ฝ่าย",
              dataIndex: "post_sub_depm",
              key: "post_sub_depm",
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
          การจัดการองค์ความรู้องค์กร
        </Divider>
      </div>
      <Card>
        <div className="tw-flex tw-flex-row tw-justify-end tw-mb-4 tw-space-x-2">
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
          scroll={{ x: "max-content" }}
          pagination={{ current: 1, pageSize: 10, position: ["bottomRight"] }}
        />
      </Card>
    </>
  );
};
