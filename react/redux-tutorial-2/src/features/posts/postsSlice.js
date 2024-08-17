import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

const reactions = {
    thumbsUp: 0,
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0
};

const initialState = {
    posts: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null
};

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

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions
                    }
                };
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find(post => post.id === postId);
            if(existingPost) {
                existingPost.reactions[reaction]++;
            }
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

                // updated current posts with loaded posts
                // state.posts = state.posts.concat(loadedPosts);
                // better this way
                state.posts = loadedPosts;
                console.log(state.posts);
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
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Not updated!');
                    console.log(action.payload);
                    return;
                }
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter(post => post.id !== action.payload.id);
                console.log(action.payload);
                state.posts = [...posts, action.payload];
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Not deleted!');
                    console.log(action.payload);
                    return;
                }
                const posts = state.posts.filter(post => post.id !== action.payload.id);
                state.posts = posts;
            });
            // .addMatcher((action) => true, (state, action) => {
            //     console.log(action);
            // });
    }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getFetchStatus = (state) => state.posts.status;
export const getFetchError = (state) => state.posts.error;

export const selectPostById = (state, postId) =>
    state.posts.posts.find(post => post.id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;