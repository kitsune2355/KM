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
    try {
      dispatch(FETCH_CATEGORIES_REQUEST());
      const categories = await fetchCategories(navigate);
      dispatch(FETCH_CATEGORIES_SUCCESS(categories));
    } catch (error) {
      console.error("error::", error);
    }
  };
