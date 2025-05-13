import axios from "axios";
import { User } from "../redux/reducer/userReducer";

export interface LoginPayload {
  username: string;
}

export const login = async (data: LoginPayload): Promise<User[]> => {
  const { data: users } = await axios.post<User[]>("/API/login.php", data);
  return users;
};
