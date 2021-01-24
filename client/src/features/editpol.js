import { createSlice } from "@reduxjs/toolkit";

export const editpolSlice = createSlice({
  name: "editpol",
  initialState: {
    editpol: "",
  },
  reducers: {
    savePolId: (state, action) => {
      state.editpol = action.payload;
    },
  },
});

export const { savePolId } = editpolSlice.actions;

export const savedPolId = (state) => state.editpol.editpol;

export default editpolSlice.reducer;
