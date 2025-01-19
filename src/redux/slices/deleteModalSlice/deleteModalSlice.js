import { mode } from '@chakra-ui/theme-tools';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  
    isDeleteModalOpen: false,
    loading: false,
    selectedItemsForDelete: [],
};


const editModalSlice = createSlice({
    name: 'editModal',
    initialState,
    reducers: {
        modalDeleteOpened: (state,action) => {
            state.isDeleteModalOpen = true;
            state.selectedItemsForDelete = action.payload;
        },
    },
});

export const { modalOpened,modalClosed,modalOpenedWithData,modalEditOpened } = editModalSlice.actions;
export const modalData = (state) => state.editModal;
export default editModalSlice.reducer;


