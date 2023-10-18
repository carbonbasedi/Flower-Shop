import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Duty } from "../../../app/models/workers";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface DutyState {
  dutiesLoaded: boolean;
  status: string;
}

const dutiesAdapter = createEntityAdapter<Duty>();

export const fetchDutiesAsync = createAsyncThunk<
  Duty[],
  void,
  { state: RootState }
>("duty/fetchDutiesAsync", async (_, thunkAPI) => {
  try {
    const resposnse = await agent.Duty.list();
    return resposnse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchDutyAsync = createAsyncThunk<Duty, number>(
  "duty/fetchDutyAsync",
  async (dutyId, thunkAPI) => {
    try {
      return await agent.Duty.details(dutyId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const dutySlice = createSlice({
  name: "duty",
  initialState: dutiesAdapter.getInitialState<DutyState>({
    dutiesLoaded: false,
    status: "idle",
  }),
  reducers: {
    setDuty: (state, action) => {
      dutiesAdapter.upsertOne(state, action.payload);
      state.dutiesLoaded = false;
    },
    removeDuty: (state, action) => {
      dutiesAdapter.removeOne(state, action.payload);
      state.dutiesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDutiesAsync.pending, (state) => {
      state.status = "pendingFetchDuties";
    });
    builder.addCase(fetchDutiesAsync.fulfilled, (state, action) => {
      dutiesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.dutiesLoaded = true;
    });
    builder.addCase(fetchDutiesAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchDutyAsync.pending, (state) => {
      state.status = "pendingFetchDuty";
    });
    builder.addCase(fetchDutyAsync.fulfilled, (state, action) => {
      dutiesAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchDutyAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const dutySelectors = dutiesAdapter.getSelectors(
  (state: RootState) => state.duty
);

export const { setDuty, removeDuty } = dutySlice.actions;
