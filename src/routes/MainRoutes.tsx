import React from "react";
import { Route, Routes } from "react-router-dom";
import { PostManagementScreen } from "../screens/Posts/PostManagementScreen";
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { PostContentScreen } from "../screens/Posts/PostContentScreen";
import { AddCategoryScreen } from "../screens/Category/AddCategoryScreen";
import { CategoryScreen } from "../screens/Category/CategoryScreen";
import { TablePostManageScreen } from "../screens/TableManagement/TablePostManageScreen";

export const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardScreen />} />
      <Route path="/new-post" element={<PostManagementScreen />} />
      <Route path="/content/:id" element={<PostContentScreen />} />
      <Route path="/category" element={<AddCategoryScreen />} />
      <Route path="/categories/:id" element={<CategoryScreen />} />
      <Route path="/management" element={<TablePostManageScreen />} />
    </Routes>
  );
};
