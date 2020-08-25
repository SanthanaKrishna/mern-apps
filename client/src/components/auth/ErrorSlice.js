import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isLoading: false,
    status: null,
    message: {},
    id: null
}

const errorSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getError: (state, { payload }) => {
            state.message = payload.msg;
            state.status = payload.status;
            state.id = payload.id;
        },
        clearError: (state, { payload }) => {
            state.message = payload.msg;
            state.status = null;
            state.id = null;
        }
    }
});


export const {
    getError, clearError
} = errorSlice.actions;


export const errorReducer = errorSlice.reducer;


// return errors
export const returnErrors = (payload) => dispatch => {
    // const {message, status, id= null}= 
    dispatch(getError(payload));
};

//clear errors
export const clearErrors = () => dispatch => {
    dispatch(clearError());
}