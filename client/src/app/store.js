import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { detailsApi } from "@/features/api/DetailsApi";
import { meetingApi } from "@/features/api/meetingsApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      detailsApi.middleware,
      meetingApi.middleware
    ),
});

const onAppInitialize = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

onAppInitialize();
