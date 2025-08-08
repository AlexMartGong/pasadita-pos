import {configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slices/auth/authSlice.js";
import {userSlice} from "./slices/user/userSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        user: userSlice.reducer,
    },
});
