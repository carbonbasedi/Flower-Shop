import { useEffect } from "react";
import {
  fetchSlidersAsync,
  sliderSelectors,
} from "../../features/admin/slider/sliderSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useSliders() {
  const sliders = useAppSelector(sliderSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { sliderLoaded, metaData } = useAppSelector((state) => state.slider);

  useEffect(() => {
    if (!sliderLoaded) dispatch(fetchSlidersAsync());
  }, [sliderLoaded, dispatch]);

  return {
    sliders,
    sliderLoaded,
    metaData,
  };
}
