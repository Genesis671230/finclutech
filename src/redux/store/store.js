import { configureStore } from '@reduxjs/toolkit';
import contactsSlice from 'features/contacts/contactSlice';
import editModalReducer from '../slices/editModalSlice/editModalSlice';
const store = configureStore({
    reducer: {
        editModal: editModalReducer,
        // Add other reducers here if needed
        contacts:contactsSlice
        
    },
});

export default store;