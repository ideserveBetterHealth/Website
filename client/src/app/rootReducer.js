import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { meetingApi } from "@/features/api/meetingsApi";
import { detailsApi } from "@/features/api/detailsApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [detailsApi.reducerPath]: detailsApi.reducer,
  [meetingApi.reducerPath]: meetingApi.reducer,
  auth: authReducer,
});

export default rootReducer;
