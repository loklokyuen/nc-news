import { useState } from "react";
import { patchArticleVote, patchCommentVote } from "../../api";

export default function Voting({ votes, itemType, id }) {
	const [currUpvote, setCurrUpvote] = useState(0);
	const [currDownvote, setCurrDownvote] = useState(0);
	const [isError, setIsError] = useState(false);

	function handleUpvote() {
		setIsError(false);
		let vote = currUpvote === 1 ? -1 : 1;
		if (currDownvote === 1) vote += 1;
		setCurrUpvote((prevUpvote) => (prevUpvote === 1 ? 0 : 1));
		setCurrDownvote(0);
		if (itemType === "article") {
			patchArticleVote(id, vote).catch((err) => {
				setIsError(true);
				setCurrUpvote((prevUpvote) => (prevUpvote === 1 ? 0 : 1));
				setTimeout(() => setIsError(false), 3000);
			});
		} else {
			patchCommentVote(id, vote).catch((err) => {
				setIsError(true);
				setCurrUpvote((prevUpvote) => (prevUpvote === 1 ? 0 : 1));
				setTimeout(() => setIsError(false), 3000);
			});
		}
	}

	function handleDownvote() {
		setIsError(false);
		let vote = currDownvote === 1 ? 1 : -1;
		if (currUpvote === 1) vote -= 1;
		setCurrDownvote((prevDownvote) => (prevDownvote === 1 ? 0 : 1));
		setCurrUpvote(0);
		if (itemType === "article") {
			patchArticleVote(id, vote).catch((err) => {
				setIsError(true);
				setCurrDownvote((prevDownvote) => (prevDownvote === 1 ? 0 : 1));
				setTimeout(() => setIsError(false), 3000);
			});
		} else {
			patchCommentVote(id, vote).catch((err) => {
				setIsError(true);
				setCurrDownvote((prevDownvote) => (prevDownvote === 1 ? 0 : 1));
				setTimeout(() => setIsError(false), 3000);
			});
		}
	}
	return (
		<div className="">
			<span
				className={`${itemType === "comment" ? "justify-start" : " justify-center"} flex items-center rounded-sm p-0.5 w-full`}
			>
				{currUpvote === 1 ? (
					<i
						className={`${itemType === "comment" ? "fa-lg" : "fa-xl"} fa-solid fa-circle-up text-highland-500 action-icon`}
						onClick={handleUpvote}
					></i>
				) : (
					<i
						className={`${itemType === "comment" ? "fa-lg" : "fa-xl"} fa-regular fa-circle-up text-highland-500 action-icon`}
						onClick={handleUpvote}
					></i>
				)}
				<span
					className={`font-bold m-0.5 ${votes + currUpvote - currDownvote >= 0 ? "text-highland-500" : "text-mandys-pink-700"} ${itemType === "comment" ? "text-md" : "text-lg"} `}
				>
					{votes + currUpvote - currDownvote}
				</span>
				{currDownvote === 1 ? (
					<i
						className={`${itemType === "comment" ? "fa-lg" : "fa-xl"} fa-solid fa-circle-down text-mandys-pink-700 action-icon`}
						onClick={handleDownvote}
					></i>
				) : (
					<i
						className={`${itemType === "comment" ? "fa-lg" : "fa-xl"} fa-regular fa-circle-down text-mandys-pink-700 action-icon`}
						onClick={handleDownvote}
					></i>
				)}
			</span>
			{isError && (
				<div className="text-feedback-error m-1">
					Something went wrong! Unable to vote, please try again later.
				</div>
			)}
		</div>
	);
}
