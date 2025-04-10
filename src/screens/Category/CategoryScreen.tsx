import { Card, Divider, Tooltip, Tree } from "antd";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
} from "../../redux/reducer/categoryReducer";

export const CategoryScreen: React.FC = () => {
  const params = useParams().id;
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [treeData, setTreeData] = React.useState<CategoryTreeNode[]>([]);

  const onStart = useCallback(() => {
    const tree = categories
      .filter((c) => c.key === params)
      .map((item) => item.children)[0];
    setTreeData(tree as CategoryTreeNode[]);
    dispatch(FETCH_CATEGORY(categories));
  }, [categories, params, dispatch]);

  useEffect(() => {
    onStart();
  }, [onStart]);

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          <Tooltip placement="leftBottom" title={categories.filter((c) => c.key === params)[0].title}>
            <div className="tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-max-w-[500px]">
              {categories.filter((c) => c.key === params)[0].title}
            </div>
          </Tooltip>
        </Divider>
      </div>
      <Card>
        <Tree
          showLine
          treeData={treeData as CategoryTreeNode[]}
          defaultExpandAll
          // titleRender={renderTreeTitle}
        />
      </Card>
    </>
  );
};
