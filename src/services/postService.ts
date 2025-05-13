import axios from "axios";
import { callApi } from "./callApi";
import { NavigateFunction } from "react-router-dom";
import { getAuthInfo } from "./userService";

export interface Post {
  id: string | null;
  post_format?: string;
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
  post_count?: number;
}

export interface PostResponse {
  status: "success" | "error";
  message: string;
  insert_id?: number;
}

export async function postView(id: Post["id"]): Promise<Post[]> {
  const { data } = await axios.post<Post[]>("/API/count_post.php", { id });
  return data;
}

export async function addPost(
  payload: Post,
  navigate?: NavigateFunction
): Promise<PostResponse> {
  const { token } = getAuthInfo();
  const formData = new FormData();

  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append("file[]", file);
    });
  }

  const dataPayload = {
    id: payload.id,
    post_format: payload.post_format,
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

  const data = await callApi<PostResponse>(
    "/API/add_post.php",
    { ...formData, token },
    navigate
  );
  return data;
}

export async function getPosts(navigate?: NavigateFunction): Promise<Post[]> {
  const { userID, token } = getAuthInfo();
  try {
    const data = await callApi<Post[]>(
      "/API/show_post.php",
      { user_id: userID, token },
      navigate
    );
    return data;
  } catch (error) {
    // console.error("API Error:", error);
    throw new Error("Error while fetching posts");
  }
}

export async function deletePost(
  post_id: string,
  navigate?: NavigateFunction
): Promise<PostResponse> {
  const { token } = getAuthInfo();
  try {
    const data = await callApi<PostResponse>("/API/delete_post.php", {
      post_id,
      token,
      navigate,
    });
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Error while deleting post");
  }
}

// export async function searchPost(
//   query: string,
//   navigate?: NavigateFunction
// ): Promise<Post[]> {
//   const { token } = getAuthInfo();
//   try {
//     const data = await callApi<Post[]>("/API/search_post.php", {
//       data: query,
//       token,
//       navigate,
//     });
//     return data;
//   } catch (error) {
//     console.error("API Error:", error);
//     throw new Error("Error while searching post");
//   }
// }
