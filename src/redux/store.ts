import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
