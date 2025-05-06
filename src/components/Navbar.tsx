import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Drawer, Dropdown, Tag, TreeSelect } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import useIsAdmin from "../hook/useIsAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_POST_TYPE_FILTER,
  SET_QUERY,
  SET_SELECTED_TAGS,
} from "../redux/reducer/searchReducer";
import { selectCategoryState } from "../redux/reducer/categoryReducer";
import { AppDispatch } from "../store";
import { fetchPosts } from "../redux/actions/postActions";
import { typeKnowledge } from "../config/constant";
import { fetchUser } from "../services/userService";
import { User } from "../redux/reducer/userReducer";
import { fetchCategory } from "../redux/actions/categoryAction";

export const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isAdmin = useIsAdmin();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, isFetchingCategory } = useSelector(selectCategoryState);

  const fetchData = useCallback(async () => {
    dispatch(fetchCategory());
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingCategory) {
      fetchData();
    }
  }, [fetchData]);

  const loadUser = async () => {
    try {
      const result = await fetchUser();
      setUser(result);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSearchChange = (value: string) => {
    dispatch(SET_QUERY(value));
    navigate("/");
  };

  const handleUserManagement = () => {
    navigate("/user-management");
  };

  const handleTagChange = (values: string[]) => {
    setSelectedTags(values);

    const selectedType = values.find((v) =>
      typeKnowledge.some((tk) => tk.value === v)
    );

    dispatch(SET_POST_TYPE_FILTER(selectedType || ""));
    dispatch(SET_SELECTED_TAGS(values));
    navigate("/");
  };

  useEffect(() => {
    loadUser();
  }, []);

  const AdminMenu = {
    items: [
      {
        key: "management",
        label: (
          <>{isAdmin && <Link to="/management">ระบบจัดการองค์ความรู้</Link>}</>
        ),
      },
      {
        key: "user",
        label: <div onClick={handleUserManagement}>ระบบจัดการผู้ใช้</div>,
      },
      {
        key: "logout",
        label: (
          <div className="tw-text-red-500" onClick={handleLogout}>
            ออกจากระบบ
          </div>
        ),
        icon: <LogoutOutlined className="tw-text-red-500" />,
      },
    ],
  };

  const items = {
    items: [
      {
        key: "logout",
        label: (
          <div className="tw-text-red-500" onClick={handleLogout}>
            ออกจากระบบ
          </div>
        ),
        icon: <LogoutOutlined className="tw-text-red-500" />,
      },
    ],
  };

  const buildTreeData = (categories: any[]): any[] => {
    return categories.map((category) => {
      const categoryData: any = {
        title: category.title,
        value: category.key,
        children:
          category.children && category.children.length > 0
            ? buildTreeData(category.children)
            : [],
      };
      return categoryData;
    });
  };

  const combinedTreeData = [
    {
      title: "ประเภทความรู้",
      value: "type",
      selectable: false,
      children: typeKnowledge.map((item) => ({
        title: item.label,
        value: item.value,
      })),
    },
    {
      title: "หมวดหมู่",
      value: "category",
      selectable: false,
      children: buildTreeData(categories),
    },
  ];

  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    let color;
    if (
      typeKnowledge.find((item) => item.value.includes(value))?.value === "1"
    ) {
      color = "green";
    } else if (
      typeKnowledge.find((item) => item.value.includes(value))?.value === "2"
    ) {
      color = "orange";
    } else {
      color = "blue";
    }

    return (
      <Tag
        color={color}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const renderSearch = () => {
    return (
      <TreeSelect
        showSearch
        treeData={combinedTreeData}
        value={selectedTags}
        onChange={handleTagChange}
        onSearch={handleSearchChange}
        treeCheckable
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        filterTreeNode={(input, node) =>
          (node.title as string).toLowerCase().includes(input.toLowerCase())
        }
        placeholder="ค้นหาองค์ความรู้"
        className="tw-w-full"
        dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
        tagRender={tagRender}
        suffixIcon={<SearchOutlined />}
        allowClear
        maxTagCount={2}
      />
    );
  };

  return (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-gradient-linear tw-border-spacing-1 tw-border-b-2 tw-border-background">
        {/* ipad */}
        <div className="sm:tw-flex lg:tw-hidden tw-items-center tw-gap-2 tw-text-black tw-font-bold tw-text-xl">
          <Button
            size="large"
            shape="circle"
            className="sm:tw-flex lg:tw-hidden !tw-bg-transparent !tw-border-none tw-text-white"
            onClick={showDrawer}
            icon={<MenuOutlined />}
          />
          <Link to="/" className="sm:tw-flex lg:tw-hidden tw-text-white">
            KM
          </Link>
        </div>

        {/* desktop */}
        <div className="tw-hidden lg:tw-flex">
          <Link to="/" className="tw-font-bold tw-text-xl tw-text-white">
            KM
          </Link>
        </div>

        <div className="tw-w-2/5 tw-hidden md:tw-flex">{renderSearch()}</div>

        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
          {!isAdmin ? (
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-end">
              <p className="tw-text-white tw-font-bold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="tw-text-white tw-text-xs">{user?.position}</p>
            </div>
          ) : (
            <p className="tw-text-white tw-font-bold">Admin</p>
          )}
          <Dropdown menu={isAdmin ? AdminMenu : items} trigger={["click"]}>
            <Avatar
              className="tw-cursor-pointer"
              icon={<UserOutlined />}
              onClick={toggleDropdown}
            />
          </Dropdown>
        </div>
      </div>

      {/* mobile */}
      <Drawer
        title="KM"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={drawerVisible}
        className="tw-sidebar-drawer"
      >
        <div className="tw-pt-6 tw-px-6 tw-flex md:tw-hidden">
          {renderSearch()}
        </div>
        <SidebarLeft onClose={closeDrawer} />
      </Drawer>
    </>
  );
};
