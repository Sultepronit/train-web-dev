import { createSlice, nanoid } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

const reactions = {
    thumbsUp: 0,
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0
};

const postsSlice = createSlice({
    name: 'posts',
    initialState: [
        {
            id: '1',
            title: 'title 1',
            content: 'some content...',
            date: sub(new Date(), { minutes: 10 }).toISOString(),
            reactions
        },
        {
            id: '2',
            title: 'title 2',
            content: 'more content...',
            date: sub(new Date(), { minutes: 5 }).toISOString(),
            reactions
        }
    ],
    reducers: {
        // postAdded(state, action) {
        //     state.push(action.payload)
        // }
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
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
            const existingPost = state.find(post => post.id === postId);
            if(existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    }
});

export const selectAllPosts = (state) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;