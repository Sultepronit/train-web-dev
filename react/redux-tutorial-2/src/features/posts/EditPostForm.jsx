import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usereSlice";
import { selectPostById, useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";

export default function EditPostForm() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [updatePost, { isLoading }] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const post = useSelector((state) => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);
    
    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const canSave = [title, content, userId, !isLoading].every(Boolean);

    async function onSavePostClicked() {
        if (!canSave) return;

        try {
            await updatePost({ id: post.id, title, body: content, userId }).unwrap();

            // setTitle('');
            // setContent('');
            // setUserId('');
            navigate(`/post/${postId}`);
        } catch (error) {
            console.error('Failed to update the post', error);
        }
    }

    async function onDeletePostClicked() {
        try {
            await deletePost({ id: post.id }).unwrap();

            // do we need to update inputs, if we just move away???
            navigate('/');
        } catch (error) {
            console.error('Failed to delete the post:', error);
        }
    }

    const usersOptions = users.map(user => (
        <option
            key={user.id}
            value={user.id}
        >
            {user.name}
        </option>
    ));

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="postAuthor">Author:</label>
                <select
                    id="postAuthor"
                    defaultValue={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                >
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content:</label>
                <textarea
                    name="postContent"
                    id="postContent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>

                <button
                    className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    );
}