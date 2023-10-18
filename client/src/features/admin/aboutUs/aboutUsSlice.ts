import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AboutUs } from "../../../app/models/aboutUs";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface AboutUsState {
  aboutUsLoaded: boolean;
  status: string;
}

const aboutUsAdapter = createEntityAdapter<AboutUs>();

export const fetchAboutUssAsync = createAsyncThunk<
  AboutUs[],
  void,
  {
    state: RootState;
  }
>("aboutUs/fetchAboutUssAsync", async (_, thunkAPI) => {
  try {
    const response = await agent.AboutUs.list();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchAboutUsAsync = createAsyncThunk<AboutUs, number>(
  "aboutUs/fetchAboutUsAsync",
  async (aboutUsId, thunkAPI) => {
    try {
      return await agent.AboutUs.details(aboutUsId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState: aboutUsAdapter.getInitialState<AboutUsState>({
    aboutUsLoaded: false,
    status: "idle",
  }),
  reducers: {
    setAboutUs: (state, action) => {
      aboutUsAdapter.upsertOne(state, action.payload);
      state.aboutUsLoaded = false;
    },
    removeAboutUs: (state, action) => {
      aboutUsAdapter.removeOne(state, action.payload);
      state.aboutUsLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAboutUssAsync.pending, (state) => {
      state.status = "pendingFetchAboutUss";
    });
    builder.addCase(fetchAboutUssAsync.fulfilled, (state, action) => {
      aboutUsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.aboutUsLoaded = true;
    });
    builder.addCase(fetchAboutUssAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchAboutUsAsync.pending, (state) => {
      state.status = "pendingFetchAboutUs";
    });
    builder.addCase(fetchAboutUsAsync.fulfilled, (state, action) => {
      aboutUsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchAboutUsAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const aboutUsSelectors = aboutUsAdapter.getSelectors(
  (state: RootState) => state.aboutUs
);

export const { setAboutUs, removeAboutUs } = aboutUsSlice.actions;
