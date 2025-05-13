import { callApi } from "./callApi";
import { NavigateFunction } from "react-router-dom";
import { getAuthInfo } from "./userService";

export interface Category {
  title: string;
  key: string;
  children?: Category[];
  parent_key: string | null;
}

export interface CategoryResponse {
  status: "success" | "error";
  message: string;
  insert_id?: number;
}

export async function addCategory(
  payload: Category,
  navigate?: NavigateFunction
): Promise<CategoryResponse> {
  const { token } = getAuthInfo();
  try {
    const data = await callApi<CategoryResponse>(
      "/API/add_category.php",
      { ...payload, token },
      navigate
    );
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

export const fetchCategories = async (
  navigate?: NavigateFunction
): Promise<Category[]> => {
  const { userID, token } = getAuthInfo();
  try {
    const data = await callApi<Category[]>(
      "/API/show_category.php",
      { user_id: userID, token },
      navigate
    );
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export async function updateCategory(
  key: string,
  title: string,
  navigate?: NavigateFunction
): Promise<CategoryResponse> {
  const { token } = getAuthInfo();
  try {
    const data = await callApi<CategoryResponse>(
      "/API/update_category.php",
      { key, title, token },
      navigate
    );
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    return { status: "error", message: "Error updating category" };
  }
}

export async function deleteCategory(
  key: string,
  navigate?: NavigateFunction
): Promise<CategoryResponse> {
  const { token } = getAuthInfo();
  try {
    const data = await callApi<CategoryResponse>(
      "/API/delete_category.php",
      { key, token },
      navigate
    );
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: "Error deleting category" };
  }
}
