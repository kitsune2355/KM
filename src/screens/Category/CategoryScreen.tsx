import { Card, Tree } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import { CategoryTreeNode, FETCH_CATEGORY } from "../../redux/reducer/categoryReducer";

export const CategoryScreen: React.FC = () => {
  const params = useParams().id;
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [treeData, setTreeData] = React.useState<CategoryTreeNode[]>([]);

  const onStart = () => {
    const tree = categories
      .filter((c) => c.key === params)
      .map((item) => item.children)[0];
      setTreeData(tree as CategoryTreeNode[]);
      dispatch(FETCH_CATEGORY(categories));
  };

  useEffect(() => {
    onStart();
  }, [onStart]);

  return (
    <Card>
      <Tree
        showLine
        treeData={treeData as CategoryTreeNode[]}
        defaultExpandAll
        // titleRender={renderTreeTitle}
      />
    </Card>
  );
};
