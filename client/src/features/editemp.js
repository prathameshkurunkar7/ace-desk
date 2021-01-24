import { createSlice } from "@reduxjs/toolkit";

export const editempSlice = createSlice({
  name: "editemp",
  initialState: {
    editemp: "",
  },
  reducers: {
    saveEmpId: (state, action) => {
      state.editemp = action.payload;
    },
  },
});

export const { saveEmpId } = editempSlice.actions;

export const savedEmpId = (state) => state.editemp.editemp;

export default editempSlice.reducer;
