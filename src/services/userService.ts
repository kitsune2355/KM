import { json } from "stream/consumers";

export interface User {
  id: string;
  username: string;
  fname: string;
  position: string;
  role: string;
  status: string;
}

export const fetchUser = async (): Promise<User> => {
  const user = localStorage.getItem("user");
  const data = JSON.parse(user || "{}");
  const userID = data[0].id;

  const res = await fetch(`/API/get_user.php?id=${userID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const result = await res.json();
  return result[0];
};
