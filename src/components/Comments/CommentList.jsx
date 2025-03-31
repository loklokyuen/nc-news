import { useEffect, useRef, useState } from "react";
import Loader from "../Common/Loader";
import NewComment from "./NewComment";
import { getCommentsByArticleId } from "../../api";
import Comment from "./Comment";
import Pagination from "../Common/Pagination";

export default function CommentList({ articleId, commentCount }) {
	const [comments, setComments] = useState([]);
	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState();
	const commentRef = useRef(null);

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		setMessage("");
		setTotalPages(Math.ceil(commentCount / 10));
		getCommentsByArticleId(articleId, currentPage)
			.then(({ comments }) => {
				setComments(comments);
				setIsLoading(false);
				if (comments.length === 0) {
					setMessage("No comment yet");
				}
			})
			.catch((err) => {
				setIsLoading(false);
				setIsError(true);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to fetch comments, please try again later.";
				setMessage(errorMessage);
			});
	}, [articleId, currentPage]);

	useEffect(() => {
		if (window.location.hash === "#comments") {
			commentRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	function handlePageChange(page) {
		setCurrentPage(page);
		setTimeout(() => {
			if (commentRef.current) {
				commentRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 0);
	}

	function handleCommentPosted(comment) {
		setComments((prevComments) => [comment, ...prevComments]);
		commentRef.current.scrollIntoView({ behavior: "smooth" });
		setMessage("Comment posted!");
		setTimeout(() => setMessage(""), 3000);
	}

	function handleCommentDeleted(commentId) {
		setComments((prevComments) =>
			prevComments.filter((comment) => comment.comment_id !== commentId)
		);
		commentRef.current.scrollIntoView({ behavior: "smooth" });
		setMessage("Comment deleted!");
		setTimeout(() => setMessage(""), 3000);
	}

	return (
		<section
			id="comments"
			ref={commentRef}
			className="comment-section border-highland-600/50 max-w-2xl mt-4 bg-shadow-green-200/40 mx-auto w-full self-center rounded-sm shadow-sm shadow-green-kelp-800/60"
		>
			<section className="bg-highland-50/80 border-b border-green-kelp-700/70 flex flex-row w-full items-center justify-start m-0 p-0 rounded-t-sm">
				<h4 className="font-bold text-highland-600 text-xl p-2 ml-2">
					Comments ({commentCount})
				</h4>
			</section>
			{isLoading && <Loader />}
			{message && (
				<div
					className={`message ${
						isError ? "text-feedback-error" : "text-feedback-success"
					}`}
				>
					{message}
				</div>
			)}
			{comments.map((comment) => {
				return (
					<Comment
						key={comment.comment_id}
						comment={comment}
						onCommentDeleted={handleCommentDeleted}
					></Comment>
				);
			})}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChanged={handlePageChange}
			></Pagination>
			<NewComment
				articleId={articleId}
				onCommentPosted={handleCommentPosted}
			></NewComment>
		</section>
	);
}
