import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { meetingApi } from "@/features/api/meetingsApi";
import { detailsApi } from "@/features/api/detailsApi";
import { pricingApi } from "@/features/api/pricingApi";
import { psychologistApi } from "@/features/api/psychologistApi";
import { questionnaireApi } from "@/features/api/questionnaireApi";
import { couponApi } from "@/features/api/couponApi";
import { paymentApi } from "@/features/api/paymentApi";
import { userApi } from "@/features/api/userApi";
import { bhAssociateApi } from "@/features/api/bhAssociateApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [detailsApi.reducerPath]: detailsApi.reducer,
  [meetingApi.reducerPath]: meetingApi.reducer,
  [pricingApi.reducerPath]: pricingApi.reducer,
  [psychologistApi.reducerPath]: psychologistApi.reducer,
  [questionnaireApi.reducerPath]: questionnaireApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [bhAssociateApi.reducerPath]: bhAssociateApi.reducer,
  auth: authReducer,
});

export default rootReducer;
