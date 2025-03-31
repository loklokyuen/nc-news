import { useContext, useState } from "react";
import { postArticleComment } from "../../api";
import { UserAccount } from "../../contexts/UserAccount";
import SmallLoader from "../Common/SmallLoader";

export default function NewComment({ articleId, onCommentPosted }) {
	const [comment, setComment] = useState("");
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState(null);
	const [loading, setLoading] = useState(false);

	const { loggedInUser, displayName, avatarURL } = useContext(UserAccount);

	function handleCommentSubmit(e) {
		e.preventDefault();
		if (!comment) {
			setIsError(true);
			setMessage("Please enter a comment before submitting.");
			setTimeout(() => setMessage(""), 3000);
			return;
		}
		if (!loggedInUser) {
			setIsError(true);
			setMessage("Please login before commenting.");
			setTimeout(() => setMessage(""), 3000);
			return;
		}
		setLoading(true);
		setIsError(false);
		setMessage("");
		postArticleComment(articleId, loggedInUser, comment)
			.then(({ insertedComment }) => {
				setLoading(false);
				setComment("");
				insertedComment.avatar_url = avatarURL;
				insertedComment.name = displayName;
				onCommentPosted(insertedComment);
			})
			.catch((err) => {
				setLoading(false);
				setIsError(true);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to comment, please try again later.";
				setMessage(errorMessage);
				setTimeout(() => setMessage(""), 3000);
			});
	}
	return (
		<>
			<section className="flex flex-row items-center border-t border-highland-500 bg-shadow-green-300/50">
				<textarea
					value={comment}
					id="new-comment"
					name="new-comment"
					onChange={(e) => setComment(e.target.value)}
					className="resize-y border-2 border-feedback-success rounded-md p-2 m-2 w-full bg-shadow-green-100 text-green-kelp-700"
					placeholder="Write your comment here..."
				></textarea>
				<i
					className="fa-solid fa-paper-plane rounded-full bg-mandys-pink-500 p-2 mr-2 text-white hover:bg-mandys-pink-600 cursor-pointer"
					onClick={handleCommentSubmit}
				></i>
			</section>
			{loading && <SmallLoader />}
			{message && (
				<div
					className={`message ${
						isError ? "text-feedback-error " : "text-feedback-success"
					}`}
				>
					{message}
				</div>
			)}
		</>
	);
}
