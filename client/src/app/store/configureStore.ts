import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/accountSlice";
import { sliderSlice } from "../../features/admin/slider/sliderSlice";
import { aboutUsSlice } from "../../features/admin/aboutUs/aboutUsSlice";
import { dutySlice } from "../../features/admin/duty/dutySlice";
import { workerSlice } from "../../features/admin/worker/workerSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
    account: accountSlice.reducer,
    slider: sliderSlice.reducer,
    aboutUs: aboutUsSlice.reducer,
    duty: dutySlice.reducer,
    worker: workerSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
