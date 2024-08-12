import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectAllPosts, fetchPosts, getFetchStatus, getFetchError } from './postsSlice';
import PostsExcerpt from './PostsExerpt';

export default function PostsList() {
    const dispatch = useDispatch();
    // const posts = useSelector(state => state.posts);
    const posts = useSelector(selectAllPosts);
    const fetchStatus = useSelector(getFetchStatus);
    const fetchError = useSelector(getFetchError);

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [fetchStatus, dispatch]);

    let content;
    if (fetchStatus === 'loading') {
        content = <p>Loading...</p>;
    } else if (fetchStatus === 'succeeded') {
        const orderdPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = orderdPosts.map(post => <PostsExcerpt post={post} key={post.id} />);
    } else if(fetchStatus === 'failed') {
        content = <p>{fetchError}</p>;
    }

    return (
        <section>
            {content}
        </section>
    );
}