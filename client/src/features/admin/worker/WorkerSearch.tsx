import { useState } from "react";
import { useAppSelector } from "../../../app/store/configureStore";
import { useDispatch } from "react-redux";
import { TextField, debounce } from "@mui/material";
import { setWorkerParams } from "./workerSlice";

export default function WorkerSearch() {
  const { workerParams } = useAppSelector((state) => state.worker);
  const [searchTerm, setSearchTerm] = useState(workerParams.searchTerm);
  const dispatch = useDispatch();

  const debouncedSearch = debounce((event: any) => {
    dispatch(setWorkerParams({ searchTerm: event.target.value }));
  }, 1000);

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      onChange={(event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}
