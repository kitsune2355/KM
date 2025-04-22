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
import { Post } from "../../services/postService";

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams().id;
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [treeData, setTreeData] = React.useState<CategoryTreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);

  const getAllKeys = (nodes: CategoryTreeNode[]): string[] => {
    return nodes.reduce<string[]>((keys, node) => {
      keys.push(node.key);
      if (node.children) {
        keys.push(...getAllKeys(node.children));
      }
      return keys;
    }, []);
  };

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

  const mergePostsIntoTreeData = (
    tree: CategoryTreeNode[],
    posts: Post[]
  ): CategoryTreeNode[] => {
    return tree.map((node) => {
      const matchedPosts = posts
        .filter((post) => post.post_ctg_id === node.key)
        .map((post) => ({
          title: <span className="tw-text-primary">{post.post_title}</span>,  // เพิ่ม className ที่นี่
          key: post.id,
          isLeaf: true,
          parent_id: node.key,
        })) as any[];
  
      const mergedChildren =
        node.children && node.children.length > 0
          ? mergePostsIntoTreeData(node.children, posts)
          : [];
  
      return {
        ...node,
        children: [...mergedChildren, ...matchedPosts],
      };
    });
  };
  

  const onStart = useCallback(() => {
    const tree = categories
      .filter((c) => c.key === params)
      .map((item) => item.children)[0];

    const treeWithPosts = mergePostsIntoTreeData(
      tree as CategoryTreeNode[],
      posts
    );
    setTreeData(treeWithPosts);
    dispatch(FETCH_CATEGORY(categories));

    if (treeData.length > 0) {
      const keys = getAllKeys(treeData);
      setExpandedKeys(keys);
    }
    dispatch(fetchPosts());

  }, [categories, params, posts, dispatch]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      onStart();
    }
  }, [categories, onStart]);

  const onOpenContent = (key: string) => {
    const post = posts.find((c) => c.id === key);
    if (post) {
      navigation(`/content/${post.id}`);
    }
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
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys as string[])}
          onSelect={(key) => onOpenContent(key[0] as string)}
        />
      </Card>
    </>
  );
};
