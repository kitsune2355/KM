import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  results: any[];
  postTypeFilter: string | null;
  selectedTags: string[];
}

const initialState: SearchState = {
  query: "",
  results: [],
  postTypeFilter: null,
  selectedTags: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    SET_QUERY: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    SET_RESULTS: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
    },
    SET_POST_TYPE_FILTER: (state, action: PayloadAction<string | null>) => {
      state.postTypeFilter = action.payload;
    },
    CLEAR_SEARCH: (state) => {
      state.query = "";
      state.results = [];
      state.postTypeFilter = null;
    },
    SET_SELECTED_TAGS: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
  },
});

export const { SET_QUERY, SET_RESULTS, SET_POST_TYPE_FILTER, CLEAR_SEARCH, SET_SELECTED_TAGS } =
  searchSlice.actions;

export const searchReducer = searchSlice.reducer;
