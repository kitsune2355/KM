export interface LoginPayload {
  username: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  fname: string;
  position: string;
  role: string;
  status: string;
}

export const login = async (data: LoginPayload): Promise<LoginResponse[]> => {
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

  const result: LoginResponse[] = await res.json();
  return result;
};
