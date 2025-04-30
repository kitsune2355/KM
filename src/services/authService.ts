import { User } from "../redux/reducer/userReducer";

export interface LoginPayload {
  username: string;
}

export const login = async (data: LoginPayload): Promise<User[]> => {
  const res = await fetch(`/API/login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const result: User[] = await res.json();
  return result;
};
