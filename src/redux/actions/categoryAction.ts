import { NavigateFunction } from "react-router-dom";
import { fetchCategories } from "../../services/categoryService";
import { getAuthInfo } from "../../services/userService";
import {
  AppDispatch,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
} from "../reducer/categoryReducer";

export const fetchCategory =
  (navigate?: NavigateFunction) => async (dispatch: AppDispatch) => {
    const { userID, token } = getAuthInfo();
    try {
      dispatch(FETCH_CATEGORIES_REQUEST());
      const categories = await fetchCategories(userID, token, navigate);
      dispatch(FETCH_CATEGORIES_SUCCESS(categories));
    } catch (error) {
      console.error("error::", error);
    }
  };
