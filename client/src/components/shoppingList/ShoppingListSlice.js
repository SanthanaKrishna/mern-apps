import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    items: [],
    error: null
}

export const shoppingListSlice = createSlice({
    name: 'shoppingList',
    initialState,
    reducers: {
        itemLoading: (state) => {
            state.isLoading = true;
        },
        getItemSuccess: (state, { payload }) => {
            state.items = payload;
            state.isLoading = false;
        },
        addItemSuccess: (state, { payload }) => {
            state.items.push(payload);
            state.isLoading = false;
        },
        deleteItemSuccess: (state, { payload }) => {
            state.isLoading = false;
            state.items = state.items.filter(item => item._id !== payload);
        },
        itemFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
});

export const {
    itemLoading, getItemSuccess,
    addItemSuccess,
    deleteItemSuccess,
    itemFailure,
} = shoppingListSlice.actions;

export const shoppingListReducer = shoppingListSlice.reducer;

export const getItemAsync = () => async dispatch => {
    dispatch(itemLoading());
    try {
        const respone = await fetch('http://localhost:5000/api/items/');
        const data = await respone.json();
        dispatch(getItemSuccess(data));
    } catch (error) {
        dispatch(itemFailure(error));
    }
};

export const postItemAsync = (payload) => async dispatch => {
    dispatch(itemLoading());
    try {
        const response = await fetch('http://localhost:5000/api/items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        dispatch(addItemSuccess(data))
    } catch (error) {
        dispatch(itemFailure(error));
    }
};


export const deleteLeadAsync = (id) => async (dispatch) => {
    dispatch(itemLoading());
    try {
        const response = await fetch(`/api/items/${id}/`, {
            method: 'DELETE'
        })
        dispatch(deleteItemSuccess(id))
    } catch (error) {
        dispatch(itemFailure(error));
    }
};
