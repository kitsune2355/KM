import { getPosts } from "../../services/postService";
import { AppDispatch, FETCH_POSTS } from "../reducer/postReducer";


export const fetchPosts = () => async (dispatch: AppDispatch) => {
  try {
    const posts = await getPosts();
    dispatch(FETCH_POSTS(posts));
  } catch (error) {
    console.error("error::", error);
  }
};
