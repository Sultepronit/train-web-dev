import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usereSlice";

export default function AddPostForm() {
    const dispatch = useDispatch();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');


    const users = useSelector(selectAllUsers);

    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId);
    // const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';
    const canSave = [title, content, userId, (addRequestStatus === 'idle')].every(Boolean);

    const onSavedPostClicked = () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                dispatch(addNewPost({ title, body: content, userId })).unwrap(); // should throw an error if the promise is rejected

                setTitle('');
                setContent('');
                setUserId('');
            } catch (error) {  
                console.error(error);
            } finally {
                setAddRequestStatus('idle');
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