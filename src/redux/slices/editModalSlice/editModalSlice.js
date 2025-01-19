import { mode } from '@chakra-ui/theme-tools';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isOpen: false,
    isAddModalOpen: false,
    isEditModalOpen: false,
    selectedModalIndex: null,
    
    loading: false,
    rowData: null,
    // New states for Entries component
    isEntryDetailsModalOpen: false,
    selectedEntry: null,
    selectedCustomer: null,
    activeTab: 0,
};


const editModalSlice = createSlice({
    name: 'editModal',
    initialState,
    reducers: {
        modalOpened: (state) => {
            state.isOpen = true;
            state.isAddModalOpen = true;
        },
        modalEditOpened: (state) => {
            state.isEditModalOpen = true;
            
        },
        modalOpenedWithData: (state, action) => {
            console.log(action, "payload");
            state.selectedModalIndex = action?.payload?.selectedModalIndex;
            state.rowData = action.payload;
            state.isEditModalOpen = true;
        },
        modalClosed: (state) => {
            state.rowData = null;
            state.isEditModalOpen = false;
            state.isOpen = false;
            state.isAddModalOpen = false;
            state.isEntryDetailsModalOpen = false;
            state.selectedEntry = null;
            state.selectedCustomer = null;
        },
      
        // New actions for Entries component
        openEntryDetailsModal: (state, action) => {
            state.isEntryDetailsModalOpen = true;
            state.selectedEntry = action.payload;
        },
        closeEntryDetailsModal: (state) => {
            // Complete state cleanup
            return {
                ...state,
                isEntryDetailsModalOpen: false,
                selectedEntry: null,
                selectedCustomer: null,
                activeTab: 0,
                rowData: null
            };
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { 
    modalOpened,
    modalClosed,
    modalOpenedWithData,
    modalEditOpened,
    openEntryDetailsModal,
    closeEntryDetailsModal,
    setSelectedCustomer,
    setActiveTab,
    setSelectedEntry,
    isEntryDetailsModalOpen
} = editModalSlice.actions;
export const modalData = (state) => state.editModal;
export default editModalSlice.reducer;


