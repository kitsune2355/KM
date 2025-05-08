import { Divider, Menu, MenuProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  CategoryTreeNode,
  selectCategoryState,
} from "../redux/reducer/categoryReducer";
import { FolderOpenOutlined } from "@ant-design/icons";
import { fetchCategory } from "../redux/actions/categoryAction";
import { images } from "../utils/imageUtils";

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
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { categories, isFetchingCategory } = useSelector(selectCategoryState);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchData = useCallback(async () => {
    dispatch(fetchCategory());
  }, [dispatch]);

  useEffect(() => {
    if (!isFetchingCategory) {
      fetchData();
    }
  }, [fetchData]);

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
      <div className="tw-flex tw-flex-col tw-justify-between tw-h-full">
        <div>
          <div className="tw-font-bold tw-text-xl tw-flex tw-items-center tw-justify-between">
            {/* <Link
              to="/"
              className="tw-hidden lg:tw-flex tw-text-primary tw-font-bold tw-text-2xl"
            >
              <img
                src={images.logoHL}
                alt="logo"
                className="tw-w-full tw-h-7 tw-flex tw-items-center"
              />
            </Link> */}
            <Divider
              orientation="center"
              orientationMargin="0"
              className="!tw-text-primary !tw-border-primary tw-flex tw-justify-center tw-items-center tw-w-full"
            >
              <Link
                to="/"
                className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-space-x-0 md:tw-space-x-2 tw-px-4"
              >
                <img
                  src={images.logoH}
                  alt=""
                  className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8"
                />
                <div className="tw-text-primary tw-text-center">
                  <p className="tw-text-xs md:tw-text-sm">องค์ความรู้องค์กร</p>
                  <p className="tw-text-xs md:tw-text-sm">
                    Knowledge Management
                  </p>
                </div>
              </Link>
            </Divider>
          </div>
          <Menu
            className="tw-menu"
            style={{ width: "100%" }}
            mode="inline"
            items={menuItems}
            selectedKeys={selectedKey ? [selectedKey] : []}
            onClick={onClose}
          />
        </div>
        <div>
          <Divider orientationMargin={"0"} />
          <div className="tw-p-3 tw-space-y-4">
            <p className=" tw-text-md tw-text-primary">วัตถุประสงค์</p>
            <div className=" tw-text-xs tw-text-primary tw-text-wrap">
              เพื่อส่งเสริมการบริหารจัดการองค์ความรู้ให้เป็นระบบ
              และสามารถนำไปใช้ในการพัฒนาศักยภาพบุคลากร ปรับปรุงขบวนการทำงาน
              รวมถึงใช้เป็นกรณีศึกษาในสถานสถานการณ์ต่างๆ
              กลุ่มบริษัทในเครือแฮปปี้แลนด์จึงกำหนด
              นโยบายการบันทึกองค์ความรู้ภายในองค์กร
            </div>
            <img src={images.km01} alt="" className="tw-h-32 tw-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
