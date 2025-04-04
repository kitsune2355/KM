import React from 'react'
import { Route, Routes } from "react-router-dom";
import { PostManagementScreen } from '../screens/PostManagement/PostManagementScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { PostContentScreen } from '../screens/PostContent/PostContentScreen';

export const MainRoutes:React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/new" element={<PostManagementScreen />} />
        <Route path="/content" element={<PostContentScreen />} />
      </Routes>
  )
}
