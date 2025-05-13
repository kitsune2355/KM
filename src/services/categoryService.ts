import axios from "axios";

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

export async function fetchCategories(user_id: string): Promise<Category[]> {
  try {
    const { data } = await axios.post<Category[]>("/API/show_category.php", {
      user_id,
    });
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function updateCategory(
  key: string,
  title: string
): Promise<CategoryResponse> {
  try {
    const { data } = await axios.post<CategoryResponse>(
      "/API/update_category.php",
      { key, title }
    );

    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Error while updating category");
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
