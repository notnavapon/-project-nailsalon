import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axiosConfig";

export const getBookByDate = createAsyncThunk(
  "booking/getBookByDate",
  async (date, thunkAPI) => {
    try {
      const response = await api.post("date", date);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const createBook = createAsyncThunk(
  "booking/createBook",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("create", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const initialState = {
  bookinglist: [],
  reload: true,
  message: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookByDate.pending, (state) => {
        state.reload = false;
      })
      .addCase(getBookByDate.fulfilled, (state, action) => {
        state.bookinglist = action.payload.data.sort((a, b) => a.slot - b.slot);
        state.reload = true;
      })
      .addCase(getBookByDate.rejected, (state) => {
        state.reload = true;
      })

      .addCase(createBook.pending, (state) => {
        state.reload = false;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.reload = true;
      })
      .addCase(createBook.rejected, (state) => {
        state.reload = true;
      });
  },
});

export default bookingSlice.reducer;
