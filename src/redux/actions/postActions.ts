import { NavigateFunction } from "react-router-dom";
import { getPosts } from "../../services/postService";
import { getAuthInfo } from "../../services/userService";
import {
  AppDispatch,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../reducer/postReducer";

export const fetchPosts = (navigate?:NavigateFunction) => async (dispatch: AppDispatch) => {
  try {
    dispatch(FETCH_POSTS_REQUEST());
    const posts = await getPosts(navigate);
    dispatch(FETCH_POSTS_SUCCESS(posts));
  } catch (error) {
    console.error("error::", error);
  }
};
