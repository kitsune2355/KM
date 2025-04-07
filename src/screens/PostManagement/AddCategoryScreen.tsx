import { Card, Button, Input, Tree } from "antd";
import React, { useEffect, useState } from "react";
import { useTreeNodeForm, TreeNodeFormProps } from "../../forms/TreeNodeForm";
import { Controller, useForm } from "react-hook-form";
import type { DataNode } from "antd/es/tree";

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

  const [treeData, setTreeData] = useState<TreeNodeFormProps[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const onSubmit = (data: TreeNodeFormProps) => {
    console.log("data :>> ", data);
    setTreeData((prev) => [
      ...prev,
      { title: data.title, key: data.title, children: [] },
    ]);
  };

  const onSelectNode = (selectedKeys: React.Key[]) => {
    setSelectedKey(selectedKeys[0] as string);
  };

  const addChildToTree = (
    data: TreeNodeFormProps[],
    parentKey: string,
    child: TreeNodeFormProps
  ): TreeNodeFormProps[] => {
    return data.map((node) => {
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

  const onAddChild = (data: { title: string }) => {
    if (!selectedKey) return;

    const newChild: TreeNodeFormProps = {
      title: data.title,
      key: `${selectedKey}-${data.title}`,
      children: [],
    };

    const updatedTree = addChildToTree(treeData, selectedKey, newChild);
    setTreeData(updatedTree);
    resetChildForm();
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
          />
        )}
      </Card>

      <Card className="tw-col-span-12 md:tw-col-span-6">
        <div className="tw-space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-2">
            <h3 className="tw-font-bold tw-text-md">Add category name</h3>
            <div style={{ marginBottom: 10 }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="title" />}
              />
              {errors.title && (
                <div style={{ color: "red" }}>{errors.title.message}</div>
              )}
            </div>

            <div className="tw-flex tw-justify-end">
              <Button
                htmlType="submit"
                type="default"
                className="tw-border-primary"
              >
                Add
              </Button>
            </div>
          </form>

          {selectedKey && (
            <form
              onSubmit={handleChildSubmit(onAddChild)}
              className="tw-space-y-2"
            >
              <h3 className="tw-font-bold tw-text-md">
                Add Child category to: {selectedKey}
              </h3>
              <div style={{ marginBottom: 10 }}>
                <Controller
                  name="title"
                  control={childControl}
                  render={({ field }) => <Input {...field} />}
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
                  type="default"
                  className="tw-border-primary"
                >
                  Add Child
                </Button>
              </div>
            </form>
          )}

          {/* <div style={{ marginTop: 24 }}>
          <h3>Raw Tree Data:</h3>
          <pre>{JSON.stringify(treeData, null, 2)}</pre>
        </div> */}
        </div>
      </Card>
    </div>
  );
};
