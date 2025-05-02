import { Card, Divider, Tooltip, Tree } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
  selectCategoryState,
} from "../../redux/reducer/categoryReducer";
import { fetchPosts } from "../../redux/actions/postActions";
import { Post } from "../../services/postService";
import { RightCircleOutlined } from "@ant-design/icons";
import { selectPostState } from "../../redux/reducer/postReducer";
import { fetchCategory } from "../../redux/actions/categoryAction";

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigate();
  const params = useParams().id;
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isFetchingCategory } = useSelector(selectCategoryState);
  const { posts, isFetchingPosts } = useSelector(selectPostState);

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
    dispatch(fetchCategory());
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingCategory) {
      fetchData();
    }
    if (treeData.length > 0) {
      const keys = getAllKeys(treeData);
      setExpandedKeys(keys);
    }
  }, [treeData, fetchData]);

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
        .filter(
          (post) => post.post_ctg_id === node.key && post.post_publish === "1"
        )
        .map(
          (post) =>
            ({
              title: post.post_title,
              key: post.id,
              isLeaf: true,
              parent_key: node.key,
            } as CategoryTreeNode)
        );

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
    const selectedCategory = categories.find((c) => c.key === params);
    if (!selectedCategory || !selectedCategory.children) {
      setTreeData([]);
      return;
    }

    const treeWithPosts = mergePostsIntoTreeData(
      selectedCategory.children,
      posts
    );
    setTreeData(treeWithPosts);
    dispatch(FETCH_CATEGORY(categories));
  }, [categories, params, posts, dispatch]);

  const onOpenContent = (key: string) => {
    const post = posts.find((c) => c.id === key);
    if (post) {
      navigation(`/content/${post.id}`);
    }
  };

  useEffect(() => {
    onStart();
  }, [onStart]);

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
          titleRender={(nodeData: any) => {
            if (nodeData.isLeaf) {
              return (
                <Card
                  size="small"
                  hoverable
                  className="
    tw-w-full tw-rounded
    tw-border-l-4 tw-border-l-primary tw-bg-white
    hover:tw-border-l-secondary 
    tw-transition-all 
    tw-text-primary hover:tw-text-secondary
    hover:tw-bg-slide-gradient tw-bg-[length:200%_100%] tw-bg-left
    hover:tw-animate-slide-colors
  "
                >
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <span className="tw-font-medium">{nodeData.title}</span>
                    <span className="tw-ml-auto">
                      <RightCircleOutlined />
                    </span>
                  </div>
                </Card>
              );
            }
            return <div className="tw-cursor-none">{nodeData.title}</div>;
          }}
        />
      </Card>
    </>
  );
};
