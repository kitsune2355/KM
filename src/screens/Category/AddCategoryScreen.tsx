import { Card, Button, Input, Tree, message, Modal, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useTreeNodeForm, TreeNodeFormProps } from "../../forms/TreeNodeForm";
import { Controller, useForm } from "react-hook-form";
import type { DataNode } from "antd/es/tree";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { addCategory, deleteCategory } from "../../services/categoryService";
import { v4 as uuidv4 } from "uuid";
import { EditCategoryModal } from "./EditCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  ADD_CATEGORY,
  CategoryTreeNode,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../redux/reducer/categoryReducer";
import { useChildTreeNodeForm } from "../../forms/ChildTreeNodeForm";

const { confirm } = Modal;

export const AddCategoryScreen: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useTreeNodeForm();

  const {
    handleSubmit: handleChildSubmit,
    control: childControl,
    formState: { errors: childErrors },
    reset: resetChildForm,
  } = useChildTreeNodeForm();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const addCategoryToTree = async (newCategory: CategoryTreeNode) => {
    try {
      const response = await addCategory(newCategory);
      if (response.status === "success") {
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error("Failed to add category.");
      console.error(error);
      return false;
    }
  };

  const onSubmit = async (data: TreeNodeFormProps) => {
    const newCategory: CategoryTreeNode = {
      title: data.title,
      key: uuidv4(),
      children: [],
      parent_id: selectedKey ? selectedKey : null,
    };
    dispatch(ADD_CATEGORY(newCategory));

    const isSuccess = await addCategoryToTree(newCategory);
    if (isSuccess) {
      message.success("Category added successfully!");
    }
  };

  const onSelectNode = (selectedKeys: React.Key[]) => {
    setSelectedKey(selectedKeys[0] as string);
  };

  const onAddChild = async (data: { title: string }) => {
    if (!selectedKey) return;

    const newChild: CategoryTreeNode = {
      title: data.title,
      key: uuidv4(),
      children: [],
      parent_id: selectedKey,
    };

    const findNodeByKey = (
      nodes: CategoryTreeNode[],
      key: string
    ): CategoryTreeNode | undefined => {
      for (const node of nodes) {
        if (node.key === key) return node;
        if (node.children?.length) {
          const found = findNodeByKey(node.children, key);
          if (found) return found;
        }
      }
      return undefined;
    };

    const parentNode = findNodeByKey(categories, selectedKey);
    if (!parentNode) return;

    const updatedCategory: CategoryTreeNode = {
      ...parentNode,
      children: [...(parentNode.children || []), newChild],
    };

    dispatch(UPDATE_CATEGORY(updatedCategory));

    const isSuccess = await addCategoryToTree(newChild);
    if (isSuccess) {
      dispatch(ADD_CATEGORY(newChild));
      message.success("Child category added successfully!");
    }
  };

  const handleOpenEditModal = (key: string) => {
    setEditKey(key);
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  const deleteNode = async (key: string) => {
    confirm({
      title: "ยืนยันการลบ",
      content: "ท่านต้องการลบหมวดหมู่นี้จริงหรือไม่?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        await deleteCategory(key);
        dispatch(DELETE_CATEGORY(key));
        setSelectedKey(null);
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (categories.length > 0) {
      resetChildForm();
      reset();
    }
  }, [categories, resetChildForm, reset]);

  const renderTreeTitle = (node: DataNode) => (
    <span>
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={() => handleOpenEditModal(node.key as string)}
        style={{ marginLeft: 8 }}
      />
      <Button
        icon={<DeleteOutlined />}
        size="small"
        onClick={() => deleteNode(node.key as string)}
        style={{ marginLeft: 8 }}
        className="hover:!tw-border-red-500 hover:!tw-text-red-500"
      />
      {`  `}
      {node.title as string}
    </span>
  );

  return (
    <>
      <div>
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          สร้างหมวดหมู่
        </Divider>
      </div>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        <Card className="tw-col-span-12 md:tw-col-span-6 ">
          {categories.length === 0 ? (
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-[100px] tw-text-gray-300">
              ไม่มีหมวดหมู่ในระบบ
            </div>
          ) : (
            <Tree
              showLine
              treeData={categories as DataNode[]}
              onSelect={onSelectNode}
              defaultExpandAll
              titleRender={renderTreeTitle}
            />
          )}
        </Card>

        <Card className="tw-col-span-12 md:tw-col-span-6">
          <div className="tw-space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-2">
              <h3 className="tw-font-bold tw-text-md">เพิ่มชื่อหมวดหมู่</h3>
              <div style={{ marginBottom: 10 }}>
                <span>หมวดหมู่หลัก :</span>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={!!selectedKey}
                      placeholder="ชื่อหมวดหมู่หลัก"
                    />
                  )}
                />
                {errors.title && (
                  <div style={{ color: "red" }}>{errors.title.message}</div>
                )}
              </div>

              <div className="tw-flex tw-justify-end">
                <Button
                  htmlType="submit"
                  type="primary"
                  className="tw-bg-primary"
                  disabled={!!selectedKey}
                >
                  บันทึก
                </Button>
              </div>
            </form>

            {selectedKey && categories.length > 0 && (
              <form
                onSubmit={handleChildSubmit(onAddChild)}
                className="tw-space-y-2"
              >
                <h3 className="tw-font-bold tw-text-md">
                  เพิ่มหมวดหมู่ย่อยไปยัง :{" "}
                  <span className="!tw-font-normal">{selectedKey}</span>
                </h3>
                <div style={{ marginBottom: 10 }}>
                  <span>หมวดหมู่ย่อย :</span>
                  <Controller
                    name="title"
                    control={childControl}
                    render={({ field }) => (
                      <Input {...field} placeholder="ชื่อหมวดหมู่ย่อย" />
                    )}
                  />
                  {childErrors.title && (
                    <div style={{ color: "red" }}>
                      {childErrors.title.message}
                    </div>
                  )}
                </div>

                <div className="tw-flex tw-justify-end">
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="tw-bg-primary"
                  >
                    บันทึก
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>

        <EditCategoryModal
          editKey={editKey}
          open={editModalVisible}
          onCancel={handleEditCancel}
        />
      </div>
    </>
  );
};
