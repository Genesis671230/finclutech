import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "services/api";

const initialState = {
  contacts: [],
  status: "idle",
  error: null,
};

const user = JSON.parse(localStorage.getItem("user"));


export const fetchContactsAsync =  createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    try {
      const response = await getApi(
        user.role === "admin"
          ? "api/contacts/"
          : `api/contacts/?createdBy=${user._id}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch processed deals");
    }
  }
);
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsAsync.pending, (state) => {
          state.status = "loading";
      })
      .addCase(fetchContactsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchContactsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectContacts = (state) =>
  state.contacts.contacts||[];
export const selectStatus = (state) => state.contacts.status;
export const selectError = (state) => state.contacts.error;

export default contactsSlice.reducer;
