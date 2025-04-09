export interface Category {
  title: string;
  key: string;
  children?: Category[];
  parent_id: string | null;
}

export interface CategoryResponse {
  status: "success" | "error";
  message: string;
  insert_id?: number;
}

export async function addCategory(
  payload: Category
): Promise<CategoryResponse> {
  const response = await fetch("/API/add_category.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/API/show_category.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export const updateCategory = async (
  key: string,
  title: string
): Promise<CategoryResponse> => {
  try {
    const data = {
      key: key,
      title: title,
    };

    const response = await fetch(`/API/update_category.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result; // ส่งผลลัพธ์สำเร็จ
    } else {
      throw new Error(result.message); // ถ้ามีข้อผิดพลาดใน API
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Error while updating category");
  }
};

export const deleteCategory = async (key: string): Promise<CategoryResponse> => {
  try {
    const response = await fetch("/API/delete_category.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Error while deleting category");
  }
};
