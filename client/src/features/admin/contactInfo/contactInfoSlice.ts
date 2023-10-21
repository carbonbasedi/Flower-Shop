import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { ContactInfo } from "../../../app/models/contactInfo";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface ContactInfoState {
  contactInfoLoaded: boolean;
  status: string;
}

const contactInfoAdapter = createEntityAdapter<ContactInfo>();

export const fetchContactInfosAsync = createAsyncThunk<
  ContactInfo[],
  void,
  {
    state: RootState;
  }
>("contactInfo", async (_, thunkAPI) => {
  try {
    const response = await agent.ContactInfo.list();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchContactInfoAsync = createAsyncThunk<ContactInfo, number>(
  "contactInfo/fetchContactInfoAsync",
  async (contactInfoId, thunkAPI) => {
    try {
      return await agent.ContactInfo.details(contactInfoId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const contactInfoSlice = createSlice({
  name: "contactInfo",
  initialState: contactInfoAdapter.getInitialState<ContactInfoState>({
    contactInfoLoaded: false,
    status: "idle",
  }),
  reducers: {
    setContactInfo: (state, action) => {
      contactInfoAdapter.upsertOne(state, action.payload);
      state.contactInfoLoaded = false;
    },
    removeContactInfo: (state, action) => {
      contactInfoAdapter.removeOne(state, action.payload);
      state.contactInfoLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContactInfosAsync.pending, (state) => {
      state.status = "pendingFetchContactInfos";
    });
    builder.addCase(fetchContactInfosAsync.fulfilled, (state, action) => {
      contactInfoAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.contactInfoLoaded = true;
    });
    builder.addCase(fetchContactInfosAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchContactInfoAsync.pending, (state) => {
      state.status = "pendingFetchContactIngo";
    });
    builder.addCase(fetchContactInfoAsync.fulfilled, (state, action) => {
      contactInfoAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchContactInfoAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const contactInfoSelector = contactInfoAdapter.getSelectors(
  (state: RootState) => state.contactInfo
);

export const { setContactInfo, removeContactInfo } = contactInfoSlice.actions;
