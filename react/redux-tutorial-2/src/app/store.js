import { configureStore } from "@reduxjs/toolkit";
// import postsReducer from "../features/posts/postsSlice";
import { apiSlice } from "../features/api/apiSlice";
import userReducer from "../features/users/usereSlice";

export const store = configureStore({
    reducer: {
        // posts: postsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: userReducer
    },
    // so here we are concatenating the default middleware & ours which are arrays btw
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});