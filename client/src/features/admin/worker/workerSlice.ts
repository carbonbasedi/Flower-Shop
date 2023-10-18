import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { MetaData } from "../../../app/models/pagination";
import { Duty, Worker, WorkerParams } from "../../../app/models/workers";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface WorkerState {
  workersLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  duties: Duty[] | null;
  workerParams: WorkerParams;
  metaData: MetaData | null;
}

const workerAdapter = createEntityAdapter<Worker>();

function getAxiosParams(workerParams: WorkerParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", workerParams.pageNumber.toString());
  params.append("pageSize", workerParams.pageSize.toString());
  params.append("orderBy", workerParams.orderBy);
  if (workerParams.searchTerm)
    params.append("searchTerm", workerParams.searchTerm);
  if (workerParams.duties.length > 0)
    params.append("duties", workerParams.duties.toString());
  return params;
}

export const fetchWorkersAsync = createAsyncThunk<
  Worker[],
  void,
  { state: RootState }
>("worker/fetchWorkersAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().worker.workerParams);
  try {
    const response = await agent.Worker.list(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchWorkerAsync = createAsyncThunk<Worker, number>(
  "worker/fetWorkerAsync",
  async (workerId, thunkAPI) => {
    try {
      return await agent.Worker.details(workerId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFiltersAsync = createAsyncThunk<
  Duty[],
  void,
  { state: RootState }
>("worker/fetchFilters", async (_, thunkAPI) => {
  try {
    const response = await agent.Worker.fetchFilters();
    return response.duties;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
    duties: [],
  };
}

export const workerSlice = createSlice({
  name: "worker",
  initialState: workerAdapter.getInitialState<WorkerState>({
    workersLoaded: false,
    filtersLoaded: false,
    status: "idle",
    duties: null,
    workerParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setWorkerParams: (state, action) => {
      state.workersLoaded = false;
      state.workerParams = {
        ...state.workerParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.workersLoaded = false;
      state.workerParams = {
        ...state.workerParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetWorkerParams: (state) => {
      state.workerParams = initParams();
    },
    setWorker: (state, action) => {
      workerAdapter.upsertOne(state, action.payload);
      state.workersLoaded = false;
    },
    removeWorker: (state, action) => {
      workerAdapter.removeOne(state, action.payload);
      state.workersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkersAsync.pending, (state) => {
      state.status = "pendingFetchWorkers";
    });
    builder.addCase(fetchWorkersAsync.fulfilled, (state, action) => {
      workerAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.workersLoaded = true;
    });
    builder.addCase(fetchWorkersAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchWorkerAsync.pending, (state) => {
      state.status = "pendingFetchWorker";
    });
    builder.addCase(fetchWorkerAsync.fulfilled, (state, action) => {
      workerAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchWorkerAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
      state.duties = action.payload;
      state.filtersLoaded = true;
      state.status = "idle";
    });
    builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

export const workerSelectors = workerAdapter.getSelectors(
  (state: RootState) => state.worker
);

export const {
  setWorkerParams,
  resetWorkerParams,
  setMetaData,
  setPageNumber,
  setWorker,
  removeWorker,
} = workerSlice.actions;
