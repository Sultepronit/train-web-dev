import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: 'users',
    initialState: [
        { id: '0', name: 'Anna Yamada' },
        { id: '1', name: 'Dave Gray' },
        { id: '2', name: 'Step Muts' },
    ],
    reducers: {}
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;