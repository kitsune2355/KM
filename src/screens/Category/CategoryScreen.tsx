import { Card, Divider, Tooltip, Tree } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
} from "../../redux/reducer/categoryReducer";
import { fetchCategories } from "../../services/categoryService";

export const CategoryScreen: React.FC = () => {
  const params = useParams().id;
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [treeData, setTreeData] = React.useState<CategoryTreeNode[]>([]);

  const fetchData = useCallback(async () => {
    const res = await fetchCategories();
    dispatch(FETCH_CATEGORY(res));
  }, [dispatch]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchData();
    }
  }, [categories, fetchData]);

  const childTree = useMemo(() => {
    const data = categories.find((c) => c.key === params);
    return data ? data.title : "";
  }, [categories, params]);

  const onStart = useCallback(() => {
    const tree = categories
      .filter((c) => c.key === params)
      .map((item) => item.children)[0];
    setTreeData(tree as CategoryTreeNode[]);
    dispatch(FETCH_CATEGORY(categories));
  }, [categories, params, dispatch]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      onStart();
    }
  }, [categories, onStart]);

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
        >
          <Tooltip placement="leftBottom" title={childTree}>
            <div className="tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-max-w-[500px]">
              {childTree}
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
