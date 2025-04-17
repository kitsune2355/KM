export interface Post {
  id: string | null;
  post_title: string;
  post_ctg_id: string;
  post_desc: string;
  post_create_by: string;
  files?: File[];
}

export interface PostResponse {
  status: "success" | "error";
  message: string;
  insert_id?: number;
}

export async function addPost(payload: Post): Promise<PostResponse> {
  console.log("payload", payload);
  const formData = new FormData();

  if (payload.files) {
    payload.files.forEach((f, _index) => {
      formData.append("file[]", f);
    });
  }

  const dataPayload = {
    id: payload.id,
    post_title: payload.post_title,
    post_ctg_id: payload.post_ctg_id,
    desc: payload.post_desc,
    post_create_by: payload.post_create_by,
  };

  formData.append("data", JSON.stringify(dataPayload));

  const response = await fetch("/API/add_post.php", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch("/API/show_post.php");
  const res = await response.json();
  return res;
}

export async function deletePost(post_id: string): Promise<Post[]> {
  try {
    const response = await fetch("/API/delete_post.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id }),
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
    throw new Error("Error while deleting post");
  }
}
