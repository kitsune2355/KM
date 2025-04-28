import { User } from "../redux/reducer/userReducer";

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

export const fetchAllUsers = async (): Promise<User[]> => {
  const res = await fetch(`/API/get_all_user.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const result = await res.json();
  return result;
};

export const addUser = async (user: User): Promise<any> => {
  const res = await fetch("/API/add_user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error("Failed to add user");
  }

  const result = await res.json();
  return result;
};

export const deleteUser = async (employeeID: string): Promise<any> => {
  const res = await fetch(`/API/delete_user.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employeeID }),
  })
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  const result = await res.json();
  return result;
  };
