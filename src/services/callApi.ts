import axios from "axios";
import { message } from "antd";
import { NavigateFunction } from "react-router-dom";

export async function callApi<T>(
  url: string,
  body: any,
  navigate?: NavigateFunction
): Promise<T> {
  try {
    const response = await axios.post<T>(url, body);
    const data = response.data as any;

    if (data?.status === "error" && data?.message === "Token expired") {
      message.warning("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      localStorage.clear();
      if (navigate) navigate("/login");
      return Promise.reject("Token expired");
    }

    return data;
  } catch (error: any) {
    console.error("API error:", error);
    return Promise.reject(error); 
  }
}
