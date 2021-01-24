import { configureStore } from "@reduxjs/toolkit";
import isopenReducer from "../features/isopen";
import editempReducer from "../features/editemp";
import editproReducer from "../features/editpro";
import editpolReducer from "../features/editpol";
import generatepayrollReducer from "../features/generatepayroll";

export default configureStore({
  reducer: {
    isopen: isopenReducer,
    editemp: editempReducer,
    editpro: editproReducer,
    editpol: editpolReducer,
    generatePayroll: generatepayrollReducer,
  },
});
