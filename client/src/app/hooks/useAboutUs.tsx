import { useEffect } from "react";
import {
  aboutUsSelectors,
  fetchAboutUssAsync,
} from "../../features/admin/aboutUs/aboutUsSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useSliders() {
  const aboutUs = useAppSelector(aboutUsSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { aboutUsLoaded } = useAppSelector((state) => state.aboutUs);

  useEffect(() => {
    if (!aboutUsLoaded) dispatch(fetchAboutUssAsync());
  }, [aboutUsLoaded, dispatch]);

  return {
    aboutUs,
    aboutUsLoaded,
  };
}
