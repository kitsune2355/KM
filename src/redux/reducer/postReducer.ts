import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { Post } from "../../services/postService";

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    FETCH_POSTS: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    ADD_POST: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    DELETE_POST: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    UPDATE_POST: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
});

export const { ADD_POST, DELETE_POST, UPDATE_POST, FETCH_POSTS } =
  postSlice.actions;

export const postReducer = postSlice.reducer;

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
