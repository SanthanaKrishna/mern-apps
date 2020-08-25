import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    token: localStorage.getItem('token'),
    verification: null,
    user: null,
    isAuthenticated: false,
    isNewAccount: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStart: (state) => {
            state.isLoading = false;
            state.error = null;
        },
        registerPending: (state, { payload }) => {
            state.isLoading = false;
            state.verification = payload;
        },
        authSuccess: (state, { payload }) => {
            const newAccount = payload.hasOwnProperty('message');
            state.token = payload.token;
            state.user = payload.user;
            state.isLoading = false;
            state.verification = null;
            state.isAuthenticated = true;
            state.isNewAccount = newAccount;
        },
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            state.token = null;
            state.isAuthenticated = false;
        },
        authFail: (state, { payload }) => {
            localStorage.removeItem('token');
            state.isLoading = false;
            state.error = payload;
            state.isAuthenticated = false;
        },
        userLoading: (state) => {
            state.isLoading = true;
        },
        userLoaded: (state, { payload }) => {
            state.isAuthenticated = true;
            state.user = payload;
            state.isLoading = false;
        },
    }
});


export const {
    authStart,
    registerPending, authSuccess, logout, authFail,
    userLoading, userLoaded,
} = authSlice.actions;


export const authReducer = authSlice.reducer;


// setup config/header and token
export const tokenConfig = getState => {
    console.log('token config', getState())
    //get token from localStorage
    const token = getState().authState.token;
    // Headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
};


const checkAuthTimeout = expirationTime => dispatch => {
    setTimeout(() => {
        dispatch(logout());
    }, expirationTime * 1000);
};


// Register User
export const registerAsync = (payload) => async dispatch => {
    dispatch(authStart());
    try {
        const response = fetch('/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await (await response).json();
        dispatch(registerPending(data));
    } catch (error) {
        dispatch(authFail(error));
    }
};


//Account Activation
export const accountActivationAsync = (payload) => async dispatch => {
    let token = payload.split('/activate/')
    if (token) {
        token = token[1];
    }
    dispatch(authStart());
    try {
        const response = fetch('api/auth/account-activation/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        const data = await (await response).json();
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', data.token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(data));
        dispatch(checkAuthTimeout(3600));
    } catch (error) {
        dispatch(authFail(error))
    }
};


// Login User
export const loginAsync = (payload) => async dispatch => {
    console.log('loginAsync', payload);
    try {
        const response = fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await (await response).json();
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', data.token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(data));
        dispatch(checkAuthTimeout(3600));
    } catch (error) {
        dispatch(authFail(error))
    }
};


//Auto Signin
export const autoSigninAsync = () => dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch(logout());
    } else {
        const expirationDate = new Date(localStorage.getItem('exprirationDate'));
        //past 
        if (expirationDate <= new Date()) {
            dispatch(logout());
        } else {
            //future
            dispatch(authSuccess(token));
            const timeLimit = (expirationDate.getTime() - new Date().getTime());
            dispatch(checkAuthTimeout(timeLimit / 1000));
        }
    }
};


// Logout User
export const logoutAsync = () => dispatch => {
    dispatch(logout());
};


// // check token & load user
// export const loadUserAsync = () => async (dispatch, getState) => {
//     const headerData = tokenConfig(getState);
//     if (headerData.headers?.token) {
//         // user loading
//         dispatch(userLoading());
//         try {z
//             const response = fetch('/api/auth/user', headerData);
//             const data = await (await response).json();
//             dispatch(userLoaded(data));
//         } catch (error) {
//             dispatch(authError(error))
//         }
//     } else {
//         dispatch(authError())
//     }
// };
