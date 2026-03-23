import {createSlice} from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        setDashboardLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setDashboardData: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        setDashboardError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {
    setDashboardLoading,
    setDashboardData,
    setDashboardError,
} = dashboardSlice.actions;
