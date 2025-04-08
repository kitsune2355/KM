import React, { useEffect, useState } from "react";
import { Avatar, Button, Drawer, Dropdown, Input, MenuProps } from "antd";
import { UserOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import useIsAdmin from "../hook/useIsAdmin";
import { fetchUser, User } from "../services/userService";

export const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = useIsAdmin();

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

  useEffect(() => {
    loadUser();
  }, []);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div>{isAdmin && <Link to="/management">Admin Management</Link>}</div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="tw-text-red-500" onClick={handleLogout}>
          Log out
        </div>
      ),
    },
  ];

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
          <Input placeholder="search..." prefix={<SearchOutlined />} />
        </div>

        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
          {isAdmin ? (
            <Link to="/new">
              <Button type="primary" className="!tw-bg-primary">
                Add new
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
          <Dropdown menu={{ items }}>
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
          <Input placeholder="search..." prefix={<SearchOutlined />} />
        </div>
        <SidebarLeft />
      </Drawer>
    </>
  );
};
