import axios from "axios";
import { User } from "../redux/reducer/userReducer";

export interface usrCompany {
  com_id: string;
  com_name: string;
}

export const fetchCompany = async (): Promise<usrCompany[]> => {
  try {
    const res = await axios.get<usrCompany[]>("/API/get_company.php");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch company");
  }
};

export const fetchUser = async (): Promise<User | null> => {
  const accessToken = localStorage.getItem("token");
  const token = accessToken ? JSON.parse(accessToken).token : null;
  const user = localStorage.getItem("user");
  const id = user ? JSON.parse(user).employeeID : null;

  try {
    const res = await axios.post<User[]>("/API/get_user.php", { id, token });
    return res.data[0] || null;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw new Error(`Failed to fetch user: ${error.response?.data || error.message}`);
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const res = await axios.get<User[]>("/API/get_all_user.php");
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const addUser = async (user: User): Promise<any> => {
  try {
    const res = await axios.post<any>("/API/add_user.php", user);
    return res.data;
  } catch (error) {
    throw new Error("Failed to add user");
  }
};

export const deleteUser = async (employeeID: string): Promise<any> => {
  try {
    const res = await axios.post<any>("/API/delete_user.php", { employeeID });
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
