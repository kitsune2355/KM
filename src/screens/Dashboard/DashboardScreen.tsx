import React, { useCallback, useEffect } from "react";
import { KnowledgeCard } from "../../components/KnowledgeCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";

export const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchPosts());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const findCategory = (
    categoryList: any[],
    postCtgId: string
  ): string[] | null => {
    let result: string[] = [];

    for (const category of categoryList) {
      if (category.key === postCtgId) {
        result.push(category.title);
      }

      if (category.children && category.children.length > 0) {
        const foundChild = findCategory(category.children, postCtgId);
        if (foundChild) {
          result = [category.title, ...foundChild];
        }
      }
    }

    return result.length > 0 ? result : null;
  };

  return (
    <>
      {posts.length > 0 ? (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          {posts.map((item, key) => {
            const tag = findCategory(categories, item.post_ctg_id);
            return (
              <div
                className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3"
                key={key}
              >
                <KnowledgeCard
                postId={item.id}
                  title={item.post_title}
                  description={item.post_desc}
                  tags={tag || ["ไม่มีหมวดหมู่"]}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="tw-w-full tw-h-[90vh] tw-flex tw-justify-center tw-items-center tw-text-gray-500">
          ยังไม่มีบทความ
        </div>
      )}
    </>
  );
};
