import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  results: any[];
  postTypeFilter: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  postTypeFilter: null,
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
      state.query = '';
      state.results = [];
      state.postTypeFilter = null;
    },
  },
});

export const {
  SET_QUERY,
  SET_RESULTS,
  SET_POST_TYPE_FILTER,
  CLEAR_SEARCH,
} = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
