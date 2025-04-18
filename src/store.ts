import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./redux/reducer/categoryReducer";
import { postReducer } from "./redux/reducer/postReducer";
import { searchReducer } from "./redux/reducer/searchReducer";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    posts: postReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
