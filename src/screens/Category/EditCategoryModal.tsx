import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useEditCategoryForm } from "../../forms/EditCategoryForm";
import { updateCategory } from "../../services/categoryService";
import {
  CategoryTreeNode,
  RootState,
  UPDATE_CATEGORY,
} from "../../redux/reducer/categoryReducer";
import { useDispatch, useSelector } from "react-redux";

interface EditCategoryModalProps {
  editKey: string | null;
  open: boolean;
  onCancel: () => void;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  editKey,
  open,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const { control, setValue, handleSubmit } = useEditCategoryForm();

  const findNodeByKey = useCallback(
    (
      nodes: CategoryTreeNode[],
      key: string | null
    ): CategoryTreeNode | undefined => {
      for (const node of nodes) {
        if (node.key === key) return node;
        if (node.children?.length) {
          const found = findNodeByKey(node.children, key);
          if (found) return found;
        }
      }
      return undefined;
    },
    []
  );

  const onstart = useCallback(() => {
    if (!editKey) return;
    const node = findNodeByKey(categories, editKey);
    if (node) {
      setValue("title", node.title);
    }
  }, [categories, editKey, findNodeByKey, setValue]);

  const onSubmit = useCallback(
    async (data: { title: string }) => {
      if (!editKey) return;
      await updateCategory(editKey, data.title);
      dispatch(
        UPDATE_CATEGORY({
          key: editKey,
          title: data.title,
          parent_key: findNodeByKey(categories, editKey)?.parent_key || null,
        })
      );
      onCancel();
    },
    [editKey, categories, findNodeByKey, dispatch, onCancel]
  );

  useEffect(() => {
    onstart();
  }, [onstart]);

  return (
    <Modal
      title="แก้ไขชื่อหมวดหมู่"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      okText="บันทึก"
      cancelText="ยกเลิก"
      okButtonProps={{
        style: { backgroundColor: "#0E7490", color: "#ffffff" },
      }}
    >
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextArea value={value} onChange={onChange} placeholder="" rows={3} />
        )}
      />
    </Modal>
  );
};
