import { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllUsers } from "../users/usereSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

export default function AddPostForm() {
    // const dispatch = useDispatch();
    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');

    const users = useSelector(selectAllUsers);

    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
    // const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    // const canSave = [title, content, userId, (addRequestStatus === 'idle')].every(Boolean);
    const canSave = [title, content, userId, !isLoading].every(Boolean);

    const onSavedPostClicked = async () => {
        if (canSave) {
            try {
                // dispatch(addNewPost({ title, body: content, userId })).unwrap(); // should throw an error if the promise is rejected
                await addNewPost({ title, body: content, userId }).unwrap();

                // do we need these???
                // setTitle('');
                // setContent('');
                // setUserId('');
                navigate('/');
            } catch (error) {  
                console.error(error);
            }             
        }
    }

    const usersOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={(e) => e.preventDefault()}>
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
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                >
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="button"
                    onClick={onSavedPostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
            </form>
        </section>
    );
}