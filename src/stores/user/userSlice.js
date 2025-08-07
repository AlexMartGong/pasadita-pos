import {createSlice} from "@reduxjs/toolkit";

export const initialUserForm = {
    id: 0,
    fullName: '',
    password: '',
    username: '',
    position: '',
    phone: '',
    active: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        userSelected: initialUserForm,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        onUserAdded: (state, action) => {
            state.users.push({
                ...action.payload,
            });
            state.userSelected = initialUserForm;
        },
        onUserUpdated: (state, action) => {
            state.users = state.users.map(user => {
                return (user.id === action.payload.id) ? {
                    ...action.payload,
                } : user;
            })
        },
        onUserChangeStatus: (state, action) => {
            state.users = state.users.map(user => {
                return (user.id === action.payload.id) ? {
                    ...user,
                    active: action.payload.active,
                } : user;
            });
        }
    }
});

export const {
    setUsers,
    onUserAdded,
    onUserUpdated,
    onUserChangeStatus,
} = userSlice.actions;
