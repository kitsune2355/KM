import React, { useCallback, useEffect, useState } from "react";
import { Button, Drawer, Dropdown, Tag, TreeSelect } from "antd";
import {
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
import { AppDispatch, RootState } from "../store";
import { fetchPosts } from "../redux/actions/postActions";
import { typeKnowledge } from "../config/constant";
import { fetchCategory } from "../redux/actions/categoryAction";
import { images } from "../utils/imageUtils";
import { fetchUser } from "../services/userService";
import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  User,
} from "../redux/reducer/userReducer";
import UserAvatar from "./UserAvatar";

export const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isAdmin = useIsAdmin();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, isFetchingCategory } = useSelector(selectCategoryState);
  const currUser = useSelector((state: RootState) => state.users.currentUser);
  const { query } = useSelector((state: RootState) => state.search);

  const fetchData = useCallback(async () => {
    dispatch(fetchCategory(navigate));
    dispatch(fetchPosts(navigate));
  }, [dispatch]);

  const loadUser = async () => {
    try {
      dispatch(FETCH_USER_REQUEST());
      const res = await fetchUser(navigate);
      dispatch(FETCH_USER_SUCCESS(res as User));
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isFetchingCategory) {
      fetchData();
      loadUser();
    }
  }, [fetchData]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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

  const AdminMenu = {
    items: [
      {
        key: "category",
        label: (<>{isAdmin && <Link to="/category">ระบบจัดการหมวดหมู่</Link>}</>)
      },
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
        dropdownStyle={{ maxHeight: 300, overflow: "auto", display: `${query}` && "none" }}
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
            <div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
              <img src={images.km02} alt="" className="tw-w-8 tw-h-8" />
              <p>KM</p>
            </div>
          </Link>
        </div>

        <div className="tw-w-2/5 tw-hidden md:tw-flex">{renderSearch()}</div>

        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-end">
            <p className="tw-text-white tw-font-bold">
              {currUser?.firstName} {currUser?.lastName}
            </p>
            <p className="tw-text-white tw-text-xs">{currUser?.position}</p>
          </div>
          <Dropdown menu={isAdmin ? AdminMenu : items} trigger={["click"]}>
            <UserAvatar name={currUser?.firstName} size={32} className="tw-cursor-pointer" onClick={toggleDropdown} />
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
