import { useEffect } from "react";
import {
  dutySelectors,
  fetchDutiesAsync,
} from "../../features/admin/duty/dutySlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useDuties() {
  const duties = useAppSelector(dutySelectors.selectAll);
  const dispatch = useAppDispatch();
  const { dutiesLoaded } = useAppSelector((state) => state.duty);

  useEffect(() => {
    if (!dutiesLoaded) dispatch(fetchDutiesAsync());
  }, [dutiesLoaded, dispatch]);

  return {
    duties,
    dutiesLoaded,
  };
}
