import { createSlice } from "@reduxjs/toolkit";

export const isopenSlice = createSlice({
  name: "isopen",
  initialState: {
    isopen: true,
  },
  reducers: {
    isbuttonopen: (state, action) => {
      state.isopen = action.payload;
    },
  },
});

export const { isbuttonopen } = isopenSlice.actions;

export const selectisopenbutton = (state) => state.isopen.isopen;

export default isopenSlice.reducer;
