import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  results: any[];
}

const initialState: SearchState = {
  query: '',
  results: [],
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
    CLEAR_SEARCH: (state) => {
      state.query = '';
      state.results = [];
    },
  },
});

export const { SET_QUERY, SET_RESULTS, CLEAR_SEARCH } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
