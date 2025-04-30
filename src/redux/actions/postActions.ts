import { getPosts } from "../../services/postService";
import { AppDispatch, FETCH_POSTS_REQUEST, FETCH_POSTS_SUCCESS } from "../reducer/postReducer";


export const fetchPosts = () => async (dispatch: AppDispatch) => {
  const user = localStorage.getItem("user");
  const userID = JSON.parse(user || "{}")[0].id;
  try {
    dispatch(FETCH_POSTS_REQUEST());
    const posts = await getPosts(userID);
    dispatch(FETCH_POSTS_SUCCESS(posts));
  } catch (error) {
    console.error("error::", error);
  }
};