import {createSlice} from "@reduxjs/toolkit";

const loggedOutState = {
    isAuth: false,
    isAdmin: false,
    role: '',
    user: undefined,
    employeeId: 0,
    expiresAt: 0,
    isLoginLoading: false,
    isRestoring: false,
};

// Con un token vigente en esta pestaña se entra directo; si no (ventana cerrada, token vencido o guardado antes
// de los refresh tokens), el arranque pregunta a la cookie antes de decidir.
const savedLogin = JSON.parse(sessionStorage.getItem("login"));
const hasUsableToken = Boolean(sessionStorage.getItem("token")) && savedLogin?.expiresAt > Date.now();

const initialLoginState = hasUsableToken
    ? {...loggedOutState, ...savedLogin}
    : {...loggedOutState, isRestoring: true};

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
            state.expiresAt = action.payload.expiresAt;
            state.isLoginLoading = false;
            state.isRestoring = false;
        },
        onLogout: () => loggedOutState,
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
