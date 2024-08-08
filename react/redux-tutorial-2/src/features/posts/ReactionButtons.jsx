import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";
import { roundToNearestMinutesWithOptions } from "date-fns/fp/roundToNearestMinutesWithOptions";


const reactionEmoji = {
    thumbsUp: '👍🏻',
    wow: '😲',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
};

export default function ReactionButtons({ post }) {
    const dispatch = useDispatch();

    console.log(Object.entries(reactionEmoji));
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        console.log(name, emoji);
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: name }))}
            >
                {emoji} {post.reactions[name]}
            </button>
        );
    });

    return <div>{reactionButtons}</div>;
}