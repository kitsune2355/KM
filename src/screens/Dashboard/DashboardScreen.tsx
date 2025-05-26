import React, { useEffect, useMemo, useState } from "react";
import { KnowledgeCard } from "../../components/KnowledgeCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchPosts } from "../../redux/actions/postActions";
import { Divider, Pagination, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { selectPostState } from "../../redux/reducer/postReducer";

export const findCategory = (list: any[], id: string): string[] | null => {
  for (const cat of list) {
    if (cat.key === id) return [cat.title];
    if (cat.children) {
      const found = findCategory(cat.children, id);
      if (found) return [cat.title, ...found];
    }
  }
  return null;
};

export const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { posts, isFetchingPosts } = useSelector(selectPostState);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const query = useSelector((state: RootState) => state.search.query);
  const selectedTags = useSelector(
    (state: RootState) => state.search.selectedTags
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    dispatch(fetchPosts(navigate));
  }, [dispatch, navigate]);

  const filteredPosts = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return posts.filter((post) => {
      const matchesText =
        post.post_title.toLowerCase().includes(lowerQuery) ||
        post.post_desc.toLowerCase().includes(lowerQuery) ||
        post.post_create_by.toLowerCase().includes(lowerQuery) ||
        post.post_fname.toLowerCase().includes(lowerQuery) ||
        post.post_lname.toLowerCase().includes(lowerQuery) || 
        (post.post_format as string).toLowerCase().includes(lowerQuery);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.includes(post.post_type) ||
        selectedTags.includes(post.post_ctg_id);

      return post.post_publish === "1" && matchesText && matchesTags;
    });
  }, [posts, query, selectedTags]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const isEmpty = !isFetchingPosts && filteredPosts.length === 0;

  return (
    <div className="tw-flex tw-flex-col tw-justify-between tw-min-h-screen tw-gap-4">
      <div>
        <div className="tw-mb-4">
          <Divider
            orientation="left"
            className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
          >
            องค์ความรู้องค์กร
          </Divider>
          <div className="tw-w-full tw-flex tw-justify-end tw-text-xs tw-text-gray-400">
            จำนวนองค์ความรู้ : {filteredPosts.length} ฉบับ
          </div>
        </div>

        {isFetchingPosts ? (
          <div className="tw-h-[90vh] tw-flex tw-justify-center tw-items-center tw-text-gray-500">
            <Spin size="large" />
          </div>
        ) : isEmpty ? (
          <div className="tw-h-[90vh] tw-flex tw-justify-center tw-items-center tw-text-gray-500">
            ไม่พบองค์ความรู้องค์กร
          </div>
        ) : (
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            {paginatedPosts.map((item) => {
              const tag = findCategory(categories, item.post_ctg_id);
              return (
                <div
                  key={item.id}
                  className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-4 tw-transition-transform hover:tw-scale-105 tw-cursor-pointer hover:tw-shadow-2xl"
                >
                  <KnowledgeCard
                    postId={item.id}
                    postsData={item}
                    query={query}
                    tags={tag || ["ไม่มีหมวดหมู่"]}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filteredPosts.length > 0 && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredPosts.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          className="tw-mt-8 tw-mb-2"
          align="center"
        />
      )}
    </div>
  );
};
