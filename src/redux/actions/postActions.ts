import { getPosts } from "../../services/postService";
import { AppDispatch, FETCH_POSTS_REQUEST, FETCH_POSTS_SUCCESS } from "../reducer/postReducer";


export const fetchPosts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(FETCH_POSTS_REQUEST());
    const posts = await getPosts();
    dispatch(FETCH_POSTS_SUCCESS(posts));
  } catch (error) {
    console.error("error::", error);
  }
};
