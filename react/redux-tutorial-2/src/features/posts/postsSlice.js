import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
    name: 'posts',
    initialState: [
        { id: '1', title: 'title 1', content: 'some content...' },
        { id: '2', title: 'title 2', content: 'more content...' }
    ],
    reducers: {}
});

export const selectAllPosts = (state) => state.posts;

export default postsSlice.reducer;