import { Company, CompanyState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CompanyState = {
  company: null,
  isLoading: true,
  error: null,
  selectedDepartmentId: null,
  departments: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state) {
      state.isLoading = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartmentId = action.payload;
    },
  },
});

export const { setCompany, setLoading, setError, setSelectedDepartment } =
  companySlice.actions;
export default companySlice.reducer;
