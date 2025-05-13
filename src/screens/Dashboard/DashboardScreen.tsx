import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KnowledgeCard } from "../../components/KnowledgeCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";
import { Divider, Pagination } from "antd";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const query = useSelector((state: RootState) => state.search.query);
  const selectedTags = useSelector(
    (state: RootState) => state.search.selectedTags
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);

  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchPosts(navigate));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPosts = useMemo(() => {
    setCurrentPage(1);
    return posts.filter((post) => {
      const matchesQuery =
        post.post_title.toLowerCase().includes(query.toLowerCase()) ||
        post.post_desc.toLowerCase().includes(query.toLowerCase()) ||
        post.post_create_by.toLowerCase().includes(query.toLowerCase()) ||
        post.post_fname.toLowerCase().includes(query.toLowerCase()) ||
        post.post_lname.toLowerCase().includes(query.toLowerCase());

      const matchesSelectedTags =
        selectedTags.length === 0 ||
        selectedTags.includes(post.post_type) ||
        selectedTags.includes(post.post_ctg_id);

      return post.post_publish === "1" && matchesQuery && matchesSelectedTags;
    });
  }, [posts, query, selectedTags]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="tw-flex tw-flex-col tw-justify-between tw-min-h-screen tw-gap-4">
      <div>
        <div className="tw-mb-4">
          <Divider
            orientation="left"
            orientationMargin="0"
            className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
          >
            องค์ความรู้องค์กร
          </Divider>

          <div className="tw-w-full tw-flex tw-justify-end tw-text-xs tw-text-gray-400">
            จำนวนองค์ความรู้ : {filteredPosts.length} ฉบับ
          </div>
        </div>

        {paginatedPosts.filter((post) => post.post_publish === "1").length >
        0 ? (
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            {paginatedPosts
              .filter((post) => post.post_publish === "1")
              .map((item, index) => {
                const tag = findCategory(categories, item.post_ctg_id);
                return (
                  <div
                    key={index}
                    className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-4 tw-transition-transform tw-duration-300 tw-transform hover:tw-scale-105 tw-cursor-pointer hover:tw-shadow-2xl"
                  >
                    <KnowledgeCard
                      postId={item.id}
                      title={highlightText(item.post_title, query)}
                      description={highlightText(item.post_desc, query)}
                      tags={tag || ["ไม่มีหมวดหมู่"]}
                      fName={highlightText(item.post_fname, query)}
                      lName={highlightText(item.post_lname, query)}
                      postFormat={item.post_format}
                      createdAt={highlightText(
                        item.post_create_at as string,
                        query
                      )}
                      postType={item.post_type}
                      view={item.post_count}
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="tw-w-full tw-h-[90vh] tw-flex tw-justify-center tw-items-center tw-text-gray-500">
            ยังไม่มีองค์ความรู้องค์กร
          </div>
        )}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredPosts.length}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
        className="tw-mt-8 tw-mb-2"
        align="center"
      />
    </div>
  );
};
