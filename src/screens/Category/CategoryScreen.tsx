import { Card, Divider, Tooltip, Tree } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
} from "../../redux/reducer/categoryReducer";
import { fetchCategories } from "../../services/categoryService";
import { fetchPosts } from "../../redux/actions/postActions";

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams().id;
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [treeData, setTreeData] = React.useState<CategoryTreeNode[]>([]);

  const fetchData = useCallback(async () => {
    const res = await fetchCategories();
    dispatch(FETCH_CATEGORY(res));
    dispatch(fetchPosts());
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

  const onOpenContent = (key: string) => {
    const postId = posts.find((c) => c.post_ctg_id === key)?.id;
    navigation(`/content/${postId}`);
  };

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
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
          onSelect={(key) => onOpenContent(key[0] as string)}
        />
      </Card>
    </>
  );
};
