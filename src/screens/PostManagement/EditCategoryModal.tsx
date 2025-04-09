import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useEditCategoryForm } from "../../forms/EditCategoryForm";
import { TreeNode } from "./AddCategoryScreen";
import { updateCategory } from "../../services/categoryService";

interface EditCategoryModalProps {
  treeData: TreeNode[];
  selectedKey: string | null;
  open: boolean;
  onCancel: () => void;
  onUpdateCategory: (updatedKey: string, newTitle: string) => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  treeData,
  selectedKey,
  open,
  onCancel,
  onUpdateCategory,
}) => {
  const { control, setValue, handleSubmit } = useEditCategoryForm();

  const findNodeByKey = (
    nodes: TreeNode[],
    key: string | null
  ): TreeNode | undefined => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children?.length) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  const onstart = useCallback(() => {
    if (!selectedKey) return;
    const node = findNodeByKey(treeData, selectedKey);
    if (node) {
      setValue("title", node.title);
    }
  }, [selectedKey, treeData, setValue]);

  const onSubmit = async (data: { title: string }) => {
    console.log("data", data);
    if (!selectedKey) return;
    await updateCategory(selectedKey, data.title);
    onUpdateCategory(selectedKey, data.title);
    onCancel();
  };

  useEffect(() => {
    onstart();
  }, [onstart]);

  return (
    <Modal
      title="Edit Category"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
    >
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextArea value={value} onChange={onChange} placeholder="title" />
        )}
      />
    </Modal>
  );
};
