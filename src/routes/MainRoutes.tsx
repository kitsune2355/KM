import React from 'react'
import { Route, Routes } from "react-router-dom";
import { LoginScreen } from '../screens/Login/LoginScreen';
import { PostManagementScreen } from '../screens/PostManagement/PostManagementScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';

export const MainRoutes:React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/new" element={<PostManagementScreen />} />
      </Routes>
  )
}
