import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState();

const reactions = {
    thumbsUp: 0,
    wow: 0,
    heart: 0,
    rocket: 0,
    coffee: 0
};

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = reactions;
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts);
            },
            providesTags: (result, error, arg) => [
                { type: 'Post', id: 'LIST' },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        })
    })
});

export const {
    useGetPostsQuery
} = extendedApiSlice;

// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds

} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);
