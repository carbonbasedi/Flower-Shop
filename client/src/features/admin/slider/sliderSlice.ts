import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { MetaData } from "../../../app/models/pagination";
import { AppSlider, SliderParams } from "../../../app/models/slider";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface SliderState {
  sliderLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  sliderParams: SliderParams;
  metaData: MetaData | null;
}

const sliderAdapter = createEntityAdapter<AppSlider>();

function getAxiosParams(sliderParams: SliderParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", sliderParams.pageNumber.toString());
  params.append("pageSize", sliderParams.pageSize.toString());
  params.append("orderBy", sliderParams.orderBy);
  return params;
}

export const fetchSlidersAsync = createAsyncThunk<
  AppSlider[],
  void,
  { state: RootState }
>("slider/fetchSlidersAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().slider.sliderParams);
  try {
    const response = await agent.Slider.list(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchSliderAsync = createAsyncThunk<AppSlider, number>(
  "slider/fetchSliderAsync",
  async (sliderId, thunkAPI) => {
    try {
      return await agent.Slider.details(sliderId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
  };
}

export const sliderSlice = createSlice({
  name: "sliders",
  initialState: sliderAdapter.getInitialState<SliderState>({
    sliderLoaded: false,
    filtersLoaded: false,
    status: "idle",
    sliderParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setSliderParams: (state, action) => {
      state.sliderLoaded = false;
      state.sliderParams = {
        ...state.sliderParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.sliderLoaded = false;
      state.sliderParams = {
        ...state.sliderParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetSliderParams: (state) => {
      state.sliderParams = initParams();
    },
    setSlider: (state, action) => {
      sliderAdapter.upsertOne(state, action.payload);
      state.sliderLoaded = false;
    },
    removeSlider: (state, action) => {
      sliderAdapter.removeOne(state, action.payload);
      state.sliderLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSlidersAsync.pending, (state) => {
      state.status = "pendingFetchSliders";
    });
    builder.addCase(fetchSlidersAsync.fulfilled, (state, action) => {
      sliderAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.sliderLoaded = true;
    });
    builder.addCase(fetchSlidersAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchSliderAsync.pending, (state) => {
      state.status = "pendingFetchSlider";
    });
    builder.addCase(fetchSliderAsync.fulfilled, (state, action) => {
      sliderAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchSliderAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const sliderSelectors = sliderAdapter.getSelectors(
  (state: RootState) => state.slider
);

export const {
  setSliderParams,
  resetSliderParams,
  setMetaData,
  setPageNumber,
  setSlider,
  removeSlider,
} = sliderSlice.actions;
