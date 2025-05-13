import axios from "axios";
import { callApi } from "./callApi";
import { NavigateFunction } from "react-router-dom";

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
  payload: Category
): Promise<CategoryResponse> {
  const { data } = await axios.post<CategoryResponse>(
    "/API/add_category.php",
    payload
  );
  return data;
}

export const fetchCategories = async (
  user_id: string,
  token: string,
  navigate?: NavigateFunction
): Promise<Category[]> => {
  try {
    const data = await callApi<Category[]>(
      "/API/show_category.php",
      { user_id, token },
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
  try {
    const data = await callApi<CategoryResponse>(
      "/API/update_category.php",
      { key, title },
      navigate
    );
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    return { status: "error", message: "Error updating category" };
  }
}

export async function deleteCategory(key: string): Promise<CategoryResponse> {
  try {
    const { data } = await axios.post<CategoryResponse>(
      "/API/delete_category.php",
      { key }
    );

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Error while deleting category");
  }
}
