import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi, postApi, putApi, deleteApi } from "services/api";
const initialState = {
  invoices: [],
  selectedInvoice: null,
  status: "idle",
  error: null,
  filters: {
    status: null,
    dateRange: null,
    customerEmail: null,
    minAmount: null,
    maxAmount: null,
  },
};

// Async thunks
export const fetchInvoicesAsync = createAsyncThunk(
  "invoices/fetchInvoices",
  async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await getApi(`api/invoices?${queryParams.toString()}`);
      console.log(response)
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch invoices");
    }
  }
);

export const fetchInvoiceByIdAsync = createAsyncThunk(
  "invoices/fetchInvoiceById",
  async (id) => {
    try {
      const response = await getApi(`api/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch invoice");
    }
  }
);

export const createInvoiceAsync = createAsyncThunk(
  "invoices/createInvoice",
  async (invoiceData) => {
    try {
      const response = await postApi("api/invoices", invoiceData);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create invoice");
    }
  }
);

export const updateInvoiceAsync = createAsyncThunk(
  "invoices/updateInvoice",
  async ({ id, updates }) => {
    try {
      const response = await putApi(`api/invoices/${id}`, updates);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update invoice");
    }
  }
);

export const deleteInvoiceAsync = createAsyncThunk(
  "invoices/deleteInvoice",
  async (id) => {
    try {
      await deleteApi(`api/invoices/${id}`);
      return id;
    } catch (error) {
      throw new Error("Failed to delete invoice");
    }
  }
);

export const updatePaymentStatusAsync = createAsyncThunk(
  "invoices/updatePaymentStatus",
  async ({ id, installmentId, paymentData }) => {
    try {
      const response = await putApi(`api/invoices/${id}/payment`, {
        installmentId,
        ...paymentData,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to update payment status");
    }
  }
);

export const resendInvoiceEmailAsync = createAsyncThunk(
  "invoices/resendEmail",
  async (id) => {
    try {
      const response = await postApi(`api/invoices/${id}/resend-email`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to resend invoice email");
    }
  }
);

export const generateInvoiceFromSalesOrderAsync = createAsyncThunk(
  "invoices/generateFromSalesOrder",
  async (salesOrderId) => {
    try {
      const response = await postApi("api/invoices", { salesOrderId });
      return response.data;
    } catch (error) {
      throw new Error("Failed to generate invoice from sales order");
    }
  }
);

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoicesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoicesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invoices = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoicesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch single invoice
      .addCase(fetchInvoiceByIdAsync.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
        state.error = null;
      })
      // Create invoice
      .addCase(createInvoiceAsync.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.error = null;
      })
      // Update invoice
      .addCase(updateInvoiceAsync.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        state.error = null;
      })
      // Delete invoice
      .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload
        );
        if (state.selectedInvoice?._id === action.payload) {
          state.selectedInvoice = null;
        }
        state.error = null;
      })
      // Update payment status
      .addCase(updatePaymentStatusAsync.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(
          (invoice) => invoice._id === action.payload._id
        );
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.selectedInvoice?._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        state.error = null;
      })
      // Generate from sales order
      .addCase(generateInvoiceFromSalesOrderAsync.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.error = null;
      });
  },
});

// Selectors
export const selectInvoices = (state) => state.invoices.invoices;
export const selectSelectedInvoice = (state) => state.invoices.selectedInvoice;
export const selectInvoiceStatus = (state) => state.invoices.status;
export const selectInvoiceError = (state) => state.invoices.error;
export const selectInvoiceFilters = (state) => state.invoices.filters;

export const {
  setFilters,
  clearFilters,
  setSelectedInvoice,
  clearSelectedInvoice,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
