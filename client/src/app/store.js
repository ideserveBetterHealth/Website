import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { detailsApi } from "@/features/api/detailsApi";
import { meetingApi } from "@/features/api/meetingsApi";
import { pricingApi } from "@/features/api/pricingApi";
import { psychologistApi } from "@/features/api/psychologistApi";
import { questionnaireApi } from "@/features/api/questionnaireApi";
import { couponApi } from "@/features/api/couponApi";
import { paymentApi } from "@/features/api/paymentApi";
import { userApi } from "@/features/api/userApi";
import { bhAssociateApi } from "@/features/api/bhAssociateApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      detailsApi.middleware,
      meetingApi.middleware,
      pricingApi.middleware,
      psychologistApi.middleware,
      questionnaireApi.middleware,
      couponApi.middleware,
      paymentApi.middleware,
      userApi.middleware,
      bhAssociateApi.middleware
    ),
});

const onAppInitialize = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

onAppInitialize();
