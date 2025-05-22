import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { usrCompany } from "../../services/userService";

export interface User {
  employeeID: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  sub_department: string;
  company: string;
  role: string;
  status: string;
  permission?: string[];
  token?: string;
  message?: string;
}

interface UserState {
  currentUser: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetchingUsers: boolean;
  error: string | null;
  company: usrCompany[];
}

const initialState: UserState = {
  currentUser: null,
  allUsers: [],
  isAuthenticated: false,
  isLoading: false,
  isFetchingUsers: false,
  error: null,
  company: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LOGIN_REQUEST: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    LOGIN_SUCCESS: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.error = null;
    },
    LOGIN_FAILURE: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    LOGOUT: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    UPDATE_USER_PROFILE: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    FETCH_USER_REQUEST: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    FETCH_USER_SUCCESS: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    FETCH_USER_FAILURE: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    FETCH_ALL_USERS_REQUEST: (state) => {
      state.isFetchingUsers = true;
      state.error = null;
    },
    FETCH_ALL_USERS_SUCCESS: (state, action: PayloadAction<User[]>) => {
      state.isFetchingUsers = false;
      state.allUsers = action.payload;
      state.error = null;
    },
    FETCH_ALL_USERS_FAILURE: (state, action: PayloadAction<string>) => {
      state.isFetchingUsers = false;
      state.error = action.payload;
    },
    ADD_USER: (state, action: PayloadAction<User>) => {
      state.allUsers.push(action.payload);
    },
    UPDATE_USER: (state, action: PayloadAction<User>) => {
      const index = state.allUsers.findIndex(
        (user) => user.employeeID === action.payload.employeeID
      );
      if (index !== -1) {
        state.allUsers[index] = action.payload;
      }
    },
    DELETE_USER: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter(
        (user) => user.employeeID !== action.payload
      );
    },
    FETCH_COMPANY_REQUEST: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    FETCH_COMPANY_SUCCESS: (state, action: PayloadAction<usrCompany[]>) => {
      state.isLoading = false;
      state.company = action.payload;
      state.error = null;
    },
    FETCH_COMPANY_FAILURE: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_PROFILE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS,
  FETCH_ALL_USERS_FAILURE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  FETCH_COMPANY_REQUEST,
  FETCH_COMPANY_SUCCESS,
  FETCH_COMPANY_FAILURE,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export const selectUserState = createSelector(
  (state: RootState) => state.user,
  (user) => ({
    currentUser: user.currentUser,
    allUsers: user.allUsers,
    isAuthenticated: user.isAuthenticated,
    isLoading: user.isLoading,
    isFetchingUsers: user.isFetchingUsers,
    error: user.error,
    company: user.company,
  })
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
