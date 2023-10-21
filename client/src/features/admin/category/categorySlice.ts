import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Category } from "../../../app/models/product";
import { RootState } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";

interface CategoryState {
  categoriesLoaded: boolean;
  status: string;
}

const categoryAdapter = createEntityAdapter<Category>();

export const fetchCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("category/fetchCategoriesAsync", async (_, thunkAPI) => {
  try {
    const response = await agent.Category.list();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCategoryAsync = createAsyncThunk<Category, number>(
  "category/fetchCategoryAsync",
  async (categoryId, thunkAPI) => {
    try {
      return await agent.Category.details(categoryId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState: categoryAdapter.getInitialState<CategoryState>({
    categoriesLoaded: false,
    status: "idle",
  }),
  reducers: {
    setCategory: (state, action) => {
      categoryAdapter.upsertOne(state, action.payload);
      state.categoriesLoaded = false;
    },
    removeCategory: (state, action) => {
      categoryAdapter.removeOne(state, action.payload);
      state.categoriesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategoriesAsync.pending, (state) => {
      state.status = "pendingFetchCategories";
    });
    builder.addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
      categoryAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.categoriesLoaded = true;
    });
    builder.addCase(fetchCategoriesAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.pending, (state) => {
      state.status = "pendingFetchCategory";
    });
    builder.addCase(fetchCategoryAsync.fulfilled, (state, action) => {
      categoryAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const categorySelectors = categoryAdapter.getSelectors(
  (state: RootState) => state.category
);

export const { setCategory, removeCategory } = categorySlice.actions;
