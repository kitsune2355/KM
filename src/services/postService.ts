export interface Post {
  id: string | null;
  post_title: string;
  post_ctg_id: string;
  post_date: string;
  post_type: string;
  post_prefix_name: string;
  post_fname: string;
  post_lname: string;
  post_position: string;
  post_depm: string;
  post_sub_depm: string;
  post_contents: string;
  post_desc: string;
  post_benefit: string;
  post_att_file: string;
  post_publish: string;
  post_comment?: string;
  post_create_at?: string;
  post_create_by: string;
  files?: File[];
  categories_title?: string | null;
}

export interface PostResponse {
  status: "success" | "error";
  message: string;
  insert_id?: number;
}

export async function addPost(payload: Post): Promise<PostResponse> {
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
    post_date: payload.post_date,
    post_type: payload.post_type,
    post_prefix_name: payload.post_prefix_name,
    post_fname: payload.post_fname,
    post_lname: payload.post_lname,
    post_position: payload.post_position,
    post_depm: payload.post_depm,
    post_sub_depm: payload.post_sub_depm,
    post_contents: payload.post_contents,
    desc: payload.post_desc,
    post_benefit: payload.post_benefit,
    post_att_file: payload.post_att_file,
    post_publish: payload.post_publish,
    post_comment: payload.post_comment,
    post_create_by: payload.post_create_by,
    file: payload.files,
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

export async function searchPost(query: string) {
  try {
    const response = await fetch("/API/search_post.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: query }),
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
