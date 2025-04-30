import { fetchCategories } from "../../services/categoryService";
import {
  AppDispatch,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
} from "../reducer/categoryReducer";

export const fetchCategory = () => async (dispatch: AppDispatch) => {
  const user = localStorage.getItem("user");
  const userID = JSON.parse(user || "{}")[0].id;
  try {
    dispatch(FETCH_CATEGORIES_REQUEST());
    const categories = await fetchCategories(userID);
    dispatch(FETCH_CATEGORIES_SUCCESS(categories));
  } catch (error) {
    console.error("error::", error);
  }
};
