import { useEffect } from "react";
import {
  categorySelectors,
  fetchCategoriesAsync,
} from "../../features/admin/category/categorySlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useCateegories() {
  const categories = useAppSelector(categorySelectors.selectAll);
  const dispatch = useAppDispatch();
  const { categoriesLoaded } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (!categoriesLoaded) dispatch(fetchCategoriesAsync());
  }, [categoriesLoaded, dispatch]);

  return {
    categories,
    categoriesLoaded,
  };
}
