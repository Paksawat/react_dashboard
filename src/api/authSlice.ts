import { Company, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  company: Company | null;
  isTokenLoaded: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  company: null,
  isTokenLoaded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isTokenLoaded = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.company = null;
    },
  },
});

export const { setToken, setUser, setCompany, logout } = authSlice.actions;
export default authSlice.reducer;
