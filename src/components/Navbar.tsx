import React, { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Dropdown, Input } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import useIsAdmin from "../hook/useIsAdmin";
import { fetchUser, User } from "../services/userService";
import { useDispatch } from "react-redux";
import { SET_QUERY } from "../redux/reducer/searchReducer";

export const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = useIsAdmin();
  const dispatch = useDispatch();

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
  };

  useEffect(() => {
    loadUser();
  }, []);

  const AdminMenu = {
    items: [
      {
        key: "management",
        label: <>{isAdmin && <Link to="/management">ระบบจัดการ Admin</Link>}</>,
      },
      {
        key: "category",
        label: <>{isAdmin && <Link to="/category">สร้างหมวดหมู่</Link>}</>,
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

  return (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-bg-foreground tw-border-spacing-1 tw-border-b-2 tw-border-background">
        <div className="tw-flex tw-items-center tw-gap-2 tw-text-black tw-font-bold tw-text-xl">
          <Button
            size="large"
            shape="circle"
            className="sm:tw-flex lg:tw-hidden !tw-bg-transparent !tw-border-none "
            onClick={showDrawer}
            icon={<MenuOutlined />}
          />
          <Link to="/" className="sm:tw-flex lg:tw-hidden">
            KM
          </Link>
        </div>

        <div className="tw-w-2/5 tw-hidden md:tw-flex">
          <Input
            placeholder="ค้นหา..."
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
          />
        </div>

        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
          {isAdmin ? (
            <Link to="/new-post">
              <Button type="primary" className="!tw-bg-primary">
                เพิ่มบทความ
              </Button>
            </Link>
          ) : (
            <div className="">
              <p className="tw-text-primary tw-font-bold">
                {user?.username} {user?.fname}
              </p>
              <p className="tw-text-gray-400 tw-text-xs">{user?.position}</p>
            </div>
          )}
          <Dropdown menu={isAdmin ? AdminMenu : items} trigger={["click"]}>
            <Avatar icon={<UserOutlined />} onClick={toggleDropdown} />
          </Dropdown>
        </div>
      </div>

      <Drawer
        title=""
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={drawerVisible}
        className="tw-sidebar-drawer"
      >
        <div className="tw-pt-6 tw-px-6">
          <Input
            placeholder="ค้นหา..."
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
          />
        </div>
        <SidebarLeft />
      </Drawer>
    </>
  );
};
