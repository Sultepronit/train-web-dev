import { useSelector } from 'react-redux';
import { selectPostIds, useGetPostsQuery } from './postsSlice';
import PostsExcerpt from './PostsExerpt';

export default function PostsList() {
    // const posts = useSelector(state => state.posts);
    // const posts = useSelector(selectAllPosts);

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery();

    const orderedPostIds = useSelector(selectPostIds);

    let content;
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        // const orderdPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        // content = orderdPosts.map(post => <PostsExcerpt post={post} key={post.id} />);
        content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />);
    } else if(isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            {content}
        </section>
    );
}