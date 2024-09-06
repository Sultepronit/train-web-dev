import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

// const initialState = {
//     posts: [],
//     status: 'idle', // idle, loading, succeeded, failed
//     error: null,
//     count: 0
// };

const initialState = postsAdapter.getInitialState({
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
    count: 0
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    // try {
    //     const response = await axios.get(POST_URL);
    //     return [...response.data];
    // } catch (err) {
    //     return err.message;
    // }
    const response = await axios.get(POST_URL);
    return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POST_URL, initialPost);
    return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    try {
        const response = await axios.put(`${POST_URL}/${initialPost.id}`, initialPost);
        console.log(response);
        return response.data;
    } catch (error) {
        // our fake api return error, 500 for no-existing id
        return initialPost;
    }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const response = await axios.delete(`${POST_URL}/${initialPost.id}`);
    if (response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
});

const reactions = {
    thumbsUp: 0,
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            // const existingPost = state.posts.find(post => post.id === postId);
            const existingPost = state.entities[postId];
            if(existingPost) {
                existingPost.reactions[reaction]++;
            }
        },
        increaseCount(state) {
            state.count++;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('fulfilled?');
                console.log(action.payload);

                // to add dates and reactions to our fake posts
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = reactions;
                    return post;
                });

                // state.posts = loadedPosts;
                postsAdapter.upsertMany(state, loadedPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'falied';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = reactions;

                console.log(action.payload);
                // state.posts.push(action.payload);
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Not updated!');
                    console.log(action.payload);
                    return;
                }
                action.payload.date = new Date().toISOString();
                console.log(action.payload);
                // const posts = state.posts.filter(post => post.id !== action.payload.id);
                // state.posts = [...posts, action.payload];
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Not deleted!');
                    console.log(action.payload);
                    return;
                }
                // const posts = state.posts.filter(post => post.id !== action.payload.id);
                // state.posts = posts;
                postsAdapter.removeOne(state, action.payload.id);
            });
            // .addMatcher((action) => true, (state, action) => {
            //     console.log(action);
            // });
    }
});

// export const selectAllPosts = (state) => state.posts.posts;
// export const selectPostById = (state, postId) =>
//     state.posts.posts.find(post => post.id === postId);

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds

} = postsAdapter.getSelectors(state => state.posts);

export const getFetchStatus = (state) => state.posts.status;
export const getFetchError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;