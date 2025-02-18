export default function Comment({ comment }) {
    const formattedDate = new Date(comment.created_at).toLocaleString();

    return  <div className="border-t w-full border-highland-500 mt-1">
        <p className="font-semibold text-green-kelp-500 text-left">{comment.author}</p>
        <p className="text-green-kelp-800 text-left bg-shadow-green-300">{comment.body}</p>
        <p className="text-right">Posted on {formattedDate}</p>
        <p className="text-left">
            <i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {comment.votes}
        </p>
    </div>
}