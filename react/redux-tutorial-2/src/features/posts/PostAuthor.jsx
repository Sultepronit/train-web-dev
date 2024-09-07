import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usereSlice";
import { Link } from 'react-router-dom';

export default function PostAuthor({ userId }) {
    const users = useSelector(selectAllUsers);

    const author = users.find(user => user.id === userId);

    return (
        <span>
            by {author ? <Link to={`/user/${userId}`}>author.name</Link> : 'Unknown Author'}
        </span>
    );
}