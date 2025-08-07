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
    }
});

export const {
    setUsers,
    onUserAdded,
} = userSlice.actions;
