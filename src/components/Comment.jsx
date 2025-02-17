export default function Comment({ comment }) {
    return <div className="">
        <p className="font-semibold text-green-kelp-500 text-left">{comment.author}</p>
        <p className="text-green-kelp-800 text-left bg-shadow-green-300">{comment.body}</p>
        <p className="text-left">
            <i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {comment.votes}
        </p>
    </div>
}