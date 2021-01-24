import { createSlice } from "@reduxjs/toolkit";

export const editproSlice = createSlice({
  name: "editpro",
  initialState: {
    editpro: "",
  },
  reducers: {
    saveProId: (state, action) => {
      state.editpro = action.payload;
    },
  },
});

export const { saveProId } = editproSlice.actions;

export const savedProId = (state) => state.editpro.editpro;

export default editproSlice.reducer;
