import { User } from "../redux/reducer/userReducer";

export interface usrCompany {
  com_id: string;
  com_name: string;
}

export const fetchCompany = async (): Promise<usrCompany[]> => {
  const res = await fetch(`/API/get_company.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }
  const result = await res.json();
  return result;
};

export const fetchUser = async (): Promise<User | null> => {
  const accessToken = localStorage.getItem("token");
  const token = accessToken ? JSON.parse(accessToken).token : null;
  const user = localStorage.getItem("user");
  const id = user ? JSON.parse(user).employeeID : null;

  try {
    const res = await fetch(`/API/get_user.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, token }),
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(`Failed to fetch user: ${errorMessage}`);
    }

    const result = await res.json();
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
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
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  const result = await res.json();
  return result;
};
