import React, { JSX } from "react";
import { Route, Navigate } from "react-router-dom";

// ฟังก์ชันเช็คสถานะการล็อกอิน
const isLoggedIn = () => {
  return localStorage.getItem("user") !== null;
};

// PrivateRoute สำหรับปกป้องเส้นทางที่ต้องการ
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return isLoggedIn() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
