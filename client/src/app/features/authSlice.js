import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null, // Check for token on refresh
        user: null,
        loading: true // Keep as true initially to verify token
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false; // ⚠️ FIX: Set loading to false once logged in
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.loading = false; // Stop loading on logout
            localStorage.removeItem('token');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Helpful for initializing user data if token exists but user data isn't loaded yet
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        }
    }
})

export const { login, logout, setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;