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
} from "../../services/categoryService"; // Import updateCategory
import { v4 as uuidv4 } from "uuid";
import { EditCategoryModal } from "./EditCategoryModal";

export interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  parent_id: string | null;
}

const { confirm } = Modal;

export const AddCategoryScreen: React.FC = () => {
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

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  // const [editingNode, setEditingNode] = useState<TreeNode | null>(null);
  // const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchCategories();
      setTreeData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addCategoryToTree = async (newCategory: TreeNode) => {
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
    const newCategory: TreeNode = {
      title: data.title,
      key: uuidv4(),
      children: [],
      parent_id: selectedKey ? selectedKey : null,
    };

    const isSuccess = await addCategoryToTree(newCategory);
    if (isSuccess) {
      setTreeData((prev) => [...prev, newCategory]);
      message.success("Category added successfully!");
      reset(); // Reset the root form
    }
  };

  const onSelectNode = (selectedKeys: React.Key[]) => {
    setSelectedKey(selectedKeys[0] as string);
  };

  const addChildToTree = (
    data: TreeNode[],
    parentKey: string,
    child: TreeNode,
    parentID: string | null
  ): TreeNode[] => {
    return data.map((node): TreeNode => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), child],
        };
      } else if (node.children) {
        return {
          ...node,
          children: addChildToTree(node.children, parentKey, child, parentID),
        };
      }
      return node;
    });
  };

  const onAddChild = async (data: { title: string }) => {
    if (!selectedKey) return;

    const newChild: TreeNode = {
      title: data.title,
      key: uuidv4(),
      children: [],
      parent_id: selectedKey,
    };

    const isSuccess = await addCategoryToTree(newChild);
    if (isSuccess) {
      const updatedTree = addChildToTree(
        treeData,
        selectedKey,
        newChild,
        selectedKey
      );
      setTreeData(updatedTree);
      resetChildForm();
      message.success("Child category added successfully!");
    }
  };

  const handkeOpenEditModal = () => {
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  const updateTreeNodeTitle = (
    nodes: TreeNode[],
    key: string,
    newTitle: string
  ): TreeNode[] => {
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

  const handleUpdateCategory = (updatedKey: string, newTitle: string) => {
    const updatedTree = updateTreeNodeTitle(treeData, updatedKey, newTitle);
    setTreeData(updatedTree);
  };

  const deleteNode = async (key: string) => {
    confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
      onOk: async () => {
        await deleteCategory(key);
        setTreeData((prev) => prev.filter((node) => node.key !== key));
      },
      onCancel() {},
    });
  };

  // Reset child form after adding child
  useEffect(() => {
    if (treeData.length > 0) {
      resetChildForm();
    }
  }, [treeData, resetChildForm]);

  // Reset root form after adding root node
  useEffect(() => {
    if (treeData.length > 0) {
      reset();
    }
  }, [treeData, reset]);

  const renderTreeTitle = (node: DataNode) => (
    <span>
      {node.title as string}
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={handkeOpenEditModal}
        style={{ marginLeft: 8 }}
      />
      <Button
        icon={<DeleteOutlined />}
        size="small"
        onClick={() => deleteNode(node.key as string)}
        style={{ marginLeft: 8 }}
        className="hover:!tw-border-red-500 hover:!tw-text-red-500"
      />
    </span>
  );

  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
      <Card className="tw-col-span-12 md:tw-col-span-6">
        {treeData.length === 0 ? (
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-min-h-[100px] tw-text-gray-300">
            No data
          </div>
        ) : (
          <Tree
            showLine
            treeData={treeData as DataNode[]}
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

          {selectedKey && treeData.length > 0 && (
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
        treeData={treeData}
        selectedKey={selectedKey}
        open={editModalVisible}
        onCancel={handleEditCancel}
        onUpdateCategory={handleUpdateCategory}
      />
    </div>
  );
};
