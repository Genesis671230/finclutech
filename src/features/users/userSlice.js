import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteManyApi, getApi, postApi, putApi, deleteApi } from "services/api";

const initialState = {
  users: [],
  selectedUsersId:[],
  status: "idle",
  error: null,
  selectedUser: null,
  userEntries: [],
};

const user = JSON.parse(localStorage.getItem("user"));

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    try {
      const response = await getApi(
        user.role === "admin"
          ? "api/user"
          : `api/user/?createdBy=${user._id}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch processed users");
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData) => {
    try {
      const response = await postApi('api/user', userData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }) => {
    try {
      const response = await putApi(`api/user/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id) => {
    try {
      await deleteApi(`api/user/${id}`);
      return id;
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
);

export const fetchUserEntries = createAsyncThunk(
  'users/fetchUserEntries',
  async (userId) => {
    try {
      const response = await getApi(`api/user/${userId}/entries`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user entries");
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  "users/deleteUser",
  async (selectedUsersId, { getState, rejectWithValue }) => {
    const { users } = getState();
    
    try {
      console.log(users.selectedUsersId,"this is selected users id s inside of the delete User async")
      await deleteManyApi("api/user/deleteMany",  users.selectedUsersId );
      return users.selectedusersId;
    } catch (error) {
      return rejectWithValue("Failed to delete users");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserIds: (state, action) => {
      state.selectedUsersId = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        console.log(state,"this is loading state")
        state.status = "loading";
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
       console.log(action.payload,"payloads")
        // Remove the deleted users from the state
        state.users = state.users.filter(

    (User) =>  !action.payload.includes(User._id.toString())
  );
        state.selectedUsersId = []; // Reset selection after deletion
        console.log(state.users,"this is succesed state")
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.status = "failed";
        console.log(state,"this is failed state")
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(fetchUserEntries.fulfilled, (state, action) => {
        state.userEntries = action.payload;
      });
  },
});

export const selectUsers = (state) => state?.users?.users || [];
export const selectStatus = (state) => state?.users?.status;
export const selectError = (state) => state?.users?.error;
export const getSelectedUsersId = (state) => state?.users?.selectedUsersId;
export const { setUserIds, setSelectedUser, clearSelectedUser } = usersSlice.actions;

export default usersSlice.reducer;
