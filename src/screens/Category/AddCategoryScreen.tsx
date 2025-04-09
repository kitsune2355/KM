import { Card, Button, Input, Tree, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTreeNodeForm, TreeNodeFormProps } from "../../forms/TreeNodeForm";
import { Controller, useForm } from "react-hook-form";
import type { DataNode } from "antd/es/tree";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
} from "../../services/categoryService";
import { v4 as uuidv4 } from "uuid";
import { EditCategoryModal } from "./EditCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  ADD_CATEGORY,
  CategoryTreeNode,
  DELETE_CATEGORY,
  FETCH_CATEGORY,
  UPDATE_CATEGORY,
} from "../../redux/reducer/categoryReducer";

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
  } = useForm<{ title: string }>({ defaultValues: { title: "" } });

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

  const addChildToTree = (
    data: CategoryTreeNode[],
    parentKey: string,
    child: CategoryTreeNode
  ): CategoryTreeNode[] => {
    return data.map((node): CategoryTreeNode => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), child],
        };
      } else if (node.children) {
        return {
          ...node,
          children: addChildToTree(node.children, parentKey, child),
        };
      }
      return node;
    });
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

  const updateTreeNodeTitle = (
    nodes: CategoryTreeNode[],
    key: string,
    newTitle: string
  ): CategoryTreeNode[] => {
    return nodes.map((node) => {
      if (node.key === key) {
        return { ...node, title: newTitle };
      } else if (node.children) {
        return {
          ...node,
          children: updateTreeNodeTitle(node.children, key, newTitle),
        };
      }
      return node;
    });
  };

  const deleteNode = async (key: string) => {
    confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
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
      {`  `}{node.title as string}
    </span>
  );

  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
      <Card className="tw-col-span-12 md:tw-col-span-6">
        {categories.length === 0 ? (
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-[100px] tw-text-gray-300">
            No data
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
            <h3 className="tw-font-bold tw-text-md">Add category name</h3>
            <div style={{ marginBottom: 10 }}>
              <span>Root Node :</span>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="title"
                    disabled={!!selectedKey}
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
                Add
              </Button>
            </div>
          </form>

          {selectedKey && categories.length > 0 && (
            <form
              onSubmit={handleChildSubmit(onAddChild)}
              className="tw-space-y-2"
            >
              <h3 className="tw-font-bold tw-text-md">
                Add Child category to: {selectedKey}
              </h3>
              <div style={{ marginBottom: 10 }}>
                <span>Child Node :</span>
                <Controller
                  name="title"
                  control={childControl}
                  render={({ field }) => (
                    <Input {...field} placeholder="title" />
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
                  Add
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
  );
};
