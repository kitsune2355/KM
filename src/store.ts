import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./redux/reducer/categoryReducer";
import { postReducer } from "./redux/reducer/postReducer";
import { searchReducer } from "./redux/reducer/searchReducer";
import { userReducer } from "./redux/reducer/userReducer";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    posts: postReducer,
    search: searchReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
