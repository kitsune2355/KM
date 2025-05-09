import { message } from "antd";
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

// ตรวจสอบว่า JWT หมดอายุหรือไม่
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// ตรวจสอบว่า login อยู่หรือไม่ และ token ยังไม่หมดอายุ
const isLoggedIn = (): boolean => {
  const rawToken = localStorage.getItem("token");

  if (!rawToken) return false;

  let token: string;
  try {
    const parsed = JSON.parse(rawToken); // กรณีเก็บแบบ { token: "..." }
    token = parsed.token || rawToken;
  } catch {
    token = rawToken; // กรณีเก็บเป็น string ตรง ๆ
  }

  if (!token || isTokenExpired(token)) {
    message.warning("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
    localStorage.clear();
    return false;
  }

  return true;
};

// Route เฉพาะคนที่ login แล้ว
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return isLoggedIn() ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
