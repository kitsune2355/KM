import { Menu, MenuProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { fetchCategories } from "../services/categoryService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  CategoryTreeNode,
  FETCH_CATEGORY,
} from "../redux/reducer/categoryReducer";
import { FolderOpenOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarLeftProps {
  onClose?: () => void;
}

const transformCategoriesToMenuItems = (
  categories: CategoryTreeNode[],
  onClose?: () => void
): MenuItem[] => {
  return categories.map((cat) => ({
    key: String(cat.key),
    label: (
      <Link to={`/categories/${cat.key}`} onClick={onClose}>
        {cat.title}
      </Link>
    ),
    icon: <FolderOpenOutlined />,
  }));
};

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();
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
      setMenuItems(transformCategoriesToMenuItems(categories, onClose));
    }
  }, [categories, onClose]);

  // ตรวจสอบ path ว่าตรงกับ /categories/:id หรือไม่
  const match = matchPath("/categories/:id", location.pathname);
  const selectedKey = match ? match.params?.id : undefined;

  return (
    <div className="tw-sidebar tw-bg-foreground tw-w-full tw-h-screen md:tw-h-auto md:tw-max-h-screen">
      <div className="tw-font-bold tw-text-xl tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2">
        <Link to="/" className="tw-hidden lg:tw-flex tw-text-primary tw-font-bold tw-text-2xl">
          KM
        </Link>
      </div>
      <Menu
        style={{ width: "100%" }}
        mode="inline"
        items={menuItems}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onClick={onClose}
      />
    </div>
  );
};
