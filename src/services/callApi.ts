import axios from "axios";
import { message } from "antd";
import { NavigateFunction } from "react-router-dom";

export async function callApi<T>(
  url: string,
  body: any,
  navigate?: NavigateFunction
): Promise<T> {
  try {
    const isFormData = body instanceof FormData;

    const response = await axios.post<T>(url, body, {
      headers: isFormData
        ? {
            // ไม่ต้องตั้ง 'Content-Type' เพราะ axios จะจัดการให้อัตโนมัติเมื่อส่ง FormData
          }
        : {
            "Content-Type": "application/json",
          },
    });

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
