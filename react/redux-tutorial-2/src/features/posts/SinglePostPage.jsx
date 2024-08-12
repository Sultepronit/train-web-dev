import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link, useParams } from "react-router-dom";

export default function SinglePostPage() {
    const { postId } = useParams();
    const smth = useParams();
    console.log(smth);
    console.log(postId);

    const post = useSelector((state) => selectPostById(state, Number(postId)));
    console.log(post);

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
}