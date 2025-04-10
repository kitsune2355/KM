import React from "react";
import { Route, Routes } from "react-router-dom";
import { PostManagementScreen } from "../screens/PostManagement/PostManagementScreen";
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { PostContentScreen } from "../screens/PostContent/PostContentScreen";
import { AddCategoryScreen } from "../screens/Category/AddCategoryScreen";
import { CategoryScreen } from "../screens/Category/CategoryScreen";

export const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardScreen />} />
      <Route path="/new-post" element={<PostManagementScreen />} />
      <Route path="/content" element={<PostContentScreen />} />
      <Route path="/category" element={<AddCategoryScreen />} />
      <Route path="/categories/:id" element={<CategoryScreen />} />
    </Routes>
  );
};
