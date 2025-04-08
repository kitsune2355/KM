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

export async function addCategory(payload: Category): Promise<CategoryResponse> {
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
    throw error; // เพื่อให้สามารถจับ error ที่เกิดขึ้นใน component ได้
  }
}