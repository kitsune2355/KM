import React, { useCallback, useEffect } from "react";
import { KnowledgeCard } from "../../components/KnowledgeCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";

export const findCategory = (
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

export const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    '<mark style="background-color: yellow;">$1</mark>'
  );
};

export const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const query = useSelector((state: RootState) => state.search.query);

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

  const filteredPosts = posts.filter(
    (post) =>
      (post.post_publish === "1" &&
        post.post_title.toLowerCase().includes(query.toLowerCase())) ||
      post.post_desc.toLowerCase().includes(query.toLowerCase()) ||
      post.post_create_by.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {filteredPosts.filter((post) => post.post_publish === "1").length > 0 ? (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
          {filteredPosts
            .filter((post) => post.post_publish === "1")
            .map((item, key) => {
              const tag = findCategory(categories, item.post_ctg_id);
              return (
                <div
                  className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3"
                  key={key}
                >
                  <KnowledgeCard
                    postId={item.id}
                    title={highlightText(item.post_title, query)}
                    description={highlightText(item.post_desc, query)}
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
