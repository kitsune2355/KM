export interface Post {
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
  const formData = new FormData();

  if (payload.files) {
    payload.files.forEach((f, _index) => {
      formData.append("file[]", f);
    });
  }

  const dataPayload = {
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
