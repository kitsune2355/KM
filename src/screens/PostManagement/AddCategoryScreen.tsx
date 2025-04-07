import { Card, Button, Input, Tree, message } from "antd";
import React, { useEffect, useState } from "react";
import { useTreeNodeForm, TreeNodeFormProps } from "../../forms/TreeNodeForm";
import { Controller, useForm } from "react-hook-form";
import type { DataNode } from "antd/es/tree";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons

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

  // Delete Node function
  const deleteNode = (key: string) => {
    const deleteNodeRecursively = (
      nodes: TreeNodeFormProps[],
      key: string
    ): TreeNodeFormProps[] => {
      return nodes.filter((node) => {
        if (node.key === key) return false;
        if (node.children)
          node.children = deleteNodeRecursively(node.children, key);
        return true;
      });
    };
    setTreeData(deleteNodeRecursively(treeData, key));
    message.success("Node deleted!");
  };

  // Edit Node function
  const editNode = (key: string) => {
    const newTitle = prompt("Enter new title:"); // Simple prompt for editing, you can make it more fancy
    if (newTitle) {
      const updateNodeTitle = (
        nodes: TreeNodeFormProps[],
        key: string,
        newTitle: string
      ): TreeNodeFormProps[] => {
        return nodes.map((node) => {
          if (node.key === key) {
            node.title = newTitle;
          } else if (node.children) {
            node.children = updateNodeTitle(node.children, key, newTitle);
          }
          return node;
        });
      };
      setTreeData(updateNodeTitle(treeData, key, newTitle));
      message.success("Node updated!");
    }
  };

  const renderTreeTitle = (node: DataNode) => (
    <span>
      {node.title as string}
      <Button
        icon={<EditOutlined />}
        size="small"
        onClick={() => editNode(node.key as string)}
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
            titleRender={renderTreeTitle} // Custom render for tree node title
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
                render={({ field }) => <Input {...field} placeholder="title" />}
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

          {/* <div style={{ marginTop: 24 }}>
            <h3>Raw Tree Data:</h3>
            <pre>{JSON.stringify(treeData, null, 2)}</pre>
          </div> */}
        </div>
      </Card>
    </div>
  );
};
