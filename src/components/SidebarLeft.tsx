import { Divider, Menu, MenuProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
} from "../redux/reducer/categoryReducer";

type MenuItem = Required<MenuProps>["items"][number];

const transformCategoriesToMenuItems = (
  categories: CategoryTreeNode[]
): MenuItem[] => {
  return categories.map((cat) => {
    const item: MenuItem = {
      key: String(cat.key),
      label: <Link to={`/categories/${cat.key}`}>{cat.title}</Link>,
    };
    return item;
  });
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
    if (!categories || categories.length === 0) {
      fetchData();
    }
  }, [categories, fetchData]);

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
      <Divider orientation="left" className="!tw-text-lg !tw-font-bold">
        คลังความรู้
      </Divider>
      <Menu style={{ width: "100%" }} mode="inline" items={menuItems} />
    </div>
  );
};
