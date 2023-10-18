import { useEffect } from "react";
import {
  fetchFiltersAsync,
  fetchWorkersAsync,
  workerSelectors,
} from "../../features/admin/worker/workerSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useWorkers() {
  const workers = useAppSelector(workerSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { workersLoaded, filtersLoaded, duties, metaData } = useAppSelector(
    (state) => state.worker
  );

  useEffect(() => {
    if (!workersLoaded) dispatch(fetchWorkersAsync());
  }, [workersLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [dispatch, filtersLoaded]);

  return {
    workers,
    workersLoaded,
    filtersLoaded,
    duties,
    metaData,
  };
}
