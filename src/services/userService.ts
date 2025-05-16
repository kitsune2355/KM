import axios from "axios";
import { User } from "../redux/reducer/userReducer";
import { callApi } from "./callApi";
import { NavigateFunction } from "react-router-dom";

export interface usrCompany {
  com_id: string;
  com_name: string;
}

export const getAuthInfo = () => {
  const user = localStorage.getItem("user");
  const tokenData = localStorage.getItem("token");

  try {
    const userID = user ? JSON.parse(user).employeeID : null;
    const token = tokenData ? JSON.parse(tokenData).token : null;
    return { userID, token };
  } catch {
    return { userID: null, token: null };
  }
};

export const fetchCompany = async (): Promise<usrCompany[]> => {
  try {
    const res = await axios.get<usrCompany[]>("/API/get_company.php");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch company");
  }
};

export const fetchUser = async (
  navigate?: NavigateFunction
): Promise<User | null> => {
  const { userID, token } = getAuthInfo();
  try {
    const data = await callApi<User[]>(
      "/API/get_user.php",
      { id: userID, token },
      navigate
    );
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const fetchAllUsers = async (
  navigate?: NavigateFunction
): Promise<User[]> => {
  const { token } = getAuthInfo();
  try {
    const data = await callApi<User[]>(
      "/API/get_all_user.php",
      { token },
      navigate
    );
    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const addUser = async (
  userData: User,
  navigate?: NavigateFunction
): Promise<any> => {
  const { token } = getAuthInfo();
  const user = { ...userData, status: parseInt(userData.status) };
  try {
    const data = await callApi<any>(
      "/API/add_user.php",
      { user, token },
      navigate
    );
    return data;
  } catch (error) {
    throw new Error("Failed to add user");
  }
};

export const deleteUser = async (
  employeeID: string,
  navigate?: NavigateFunction
): Promise<any> => {
  try {
    const { token } = getAuthInfo();
    const data = await callApi<any>(
      "/API/delete_user.php",
      { employeeID, token },
      navigate
    );
    return data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
