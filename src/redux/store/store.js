import { configureStore } from '@reduxjs/toolkit';
import editModalReducer from '../slices/editModalSlice/editModalSlice';
const store = configureStore({
    reducer: {
        editModal: editModalReducer,
        // Add other reducers here if needed
        
    },
});

export default store;