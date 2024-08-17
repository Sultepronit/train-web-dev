import { useSelector } from 'react-redux';
import { selectAllPosts, getFetchStatus, getFetchError } from './postsSlice';
import PostsExcerpt from './PostsExerpt';

export default function PostsList() {
    // const posts = useSelector(state => state.posts);
    const posts = useSelector(selectAllPosts);
    const fetchStatus = useSelector(getFetchStatus);
    const fetchError = useSelector(getFetchError);

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