import {createSlice} from "@reduxjs/toolkit";

const initialLoginState = JSON.parse(sessionStorage.getItem("login")) || {
    isAuth: false,
    isAdmin: false,
    role: '',
    user: undefined,
    employeeId: 0,
    isLoginLoading: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialLoginState,
    reducers: {
        onLogin: (state, action) => {
            state.isAuth = true;
            state.user = action.payload.user;
            state.isAdmin = action.payload.isAdmin;
            state.role = action.payload.role;
            state.employeeId = action.payload.employeeId;
            state.isLoginLoading = false;
        },
        onLogout: (state) => {
            state.user = undefined;
            state.isAuth = false;
            state.isAdmin = false;
            state.role = '';
            state.employeeId = 0;
            state.isLoginLoading = false;
        },
        onInitLogin: (state) => {
            state.isLoginLoading = true;
        }
    }
});

export const {
    onLogin,
    onLogout,
    onInitLogin,
} = authSlice.actions;
