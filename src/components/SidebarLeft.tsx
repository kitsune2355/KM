import { Menu, MenuProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { CategoryTreeNode, FETCH_CATEGORY } from "../redux/reducer/categoryReducer";

type MenuItem = Required<MenuProps>["items"][number];

const transformCategoriesToMenuItems = (categories: CategoryTreeNode[]): MenuItem[] => {
  return categories.map((cat) => ({
    key: cat.key,
    label: cat.title,
    children:
      cat.children && cat.children.length > 0
        ? transformCategoriesToMenuItems(cat.children)
        : undefined,
  }));
};

export const SidebarLeft: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchData = useCallback(async () => {
    const res = await fetchCategories();
    dispatch(FETCH_CATEGORY(res));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setMenuItems(transformCategoriesToMenuItems(categories));
    }
  }, [categories]);

  return (
    <div className="tw-sidebar tw-bg-foreground tw-w-full tw-h-screen md:tw-h-auto md:tw-max-h-screen">
      <div className="tw-font-bold tw-text-xl tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2">
        <Link to="/" className="tw-hidden lg:tw-flex">
          KM
        </Link>
      </div>
      <div className="tw-p-4 tw-text-lg tw-font-bold">Category</div>
      <Menu style={{ width: "100%" }} mode="inline" items={menuItems} />
    </div>
  );
};
