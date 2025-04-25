import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Drawer, Dropdown, Input, Tag } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
  FilterFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import useIsAdmin from "../hook/useIsAdmin";
import { fetchUser, User } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_POST_TYPE_FILTER,
  SET_QUERY,
} from "../redux/reducer/searchReducer";
import { fetchCategories } from "../services/categoryService";
import { FETCH_CATEGORY } from "../redux/reducer/categoryReducer";
import { AppDispatch, RootState } from "../store";
import { fetchPosts } from "../redux/actions/postActions";
import { typeKnowledge } from "../config/constant";

export const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const isAdmin = useIsAdmin();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isFetchingCategory = useSelector(
    (state: RootState) => state.categories.isFetching
  );

  const fetchData = useCallback(async () => {
    const res = await fetchCategories();
    dispatch(FETCH_CATEGORY(res));
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(SET_QUERY(query));
    navigate("/");
  };

  const handleUserManagement = () => {
    navigate("/user-management");
  };

  const handleFilterSelect = (type: string) => {
    setSelectedFilter(type);
    dispatch(SET_POST_TYPE_FILTER(type));
    setIsFilterDropdownOpen(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const AdminMenu = {
    items: [
      {
        key: "formKM",
        label: (
          <>
            {isAdmin && (
              <Link to="/new-post">ยื่นแบบฟอร์มบันทึกองค์ความรู้</Link>
            )}
          </>
        ),
      },
      {
        key: "category",
        label: <>{isAdmin && <Link to="/category">สร้างหมวดหมู่</Link>}</>,
      },
      {
        key: "management",
        label: <>{isAdmin && <Link to="/management">ระบบจัดการองค์ความรู้</Link>}</>,
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
        icon: <LogoutOutlined />,
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
        icon: <LogoutOutlined />,
      },
    ],
  };

  const renderSearch = () => {
    return (
      <div className="tw-relative tw-w-full">
        <Input
          placeholder="ค้นหาองค์ความรู้"
          prefix={
            <>
              <SearchOutlined className="tw-text-gray-400" />
              {selectedFilter && (
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    handleFilterSelect("");
                  }}
                  color={
                    typeKnowledge.find((item) => item.value === selectedFilter)
                      ?.value === "1"
                      ? "pink"
                      : "purple"
                  }
                  style={{ marginRight: 8 }}
                >
                  {
                    typeKnowledge.find((item) => item.value === selectedFilter)
                      ?.label
                  }
                </Tag>
              )}
            </>
          }
          suffix={
            <FilterFilled
              className="tw-text-gray-400 tw-cursor-pointer"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            />
          }
          onChange={handleSearchChange}
        />

        {isFilterDropdownOpen && (
          <div className="tw-absolute tw-z-50 tw-w-full tw-bg-white tw-shadow-lg tw-rounded-md tw-mt-1 tw-border tw-border-gray-200">
            {typeKnowledge.map((type, key) => (
              <div
                key={key}
                className="tw-py-2 tw-px-4 tw-text-sm tw-cursor-pointer hover:tw-bg-gray-100"
                onClick={() => handleFilterSelect(type.value)}
              >
                {type.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-gradient-linear tw-border-spacing-1 tw-border-b-2 tw-border-background">
        <div className="tw-flex tw-items-center tw-gap-2 tw-text-black tw-font-bold tw-text-xl">
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

        <div className="tw-w-2/5 tw-hidden md:tw-flex">{renderSearch()}</div>

        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
          {!isAdmin && (
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-end">
              <p className="tw-text-primary tw-font-bold">
                {user?.username} {user?.fname}
              </p>
              <p className="tw-text-white tw-text-xs">{user?.position}</p>
            </div>
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
