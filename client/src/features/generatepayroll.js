import { createSlice } from "@reduxjs/toolkit";

export const generatePayrollSlice = createSlice({
  name: "generatePayroll",
  initialState: {
    generatePayroll: "",
  },
  reducers: {
    savePayrollId: (state, action) => {
      state.generatePayroll = action.payload;
    },
  },
});

export const { savePayrollId } = generatePayrollSlice.actions;

export const savedPayrollId = (state) => state.generatePayroll.generatePayroll;

export default generatePayrollSlice.reducer;
