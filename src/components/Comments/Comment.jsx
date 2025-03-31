import { useContext, useEffect, useRef, useState } from "react";
import { UserAccount } from "../../contexts/UserAccount";
import { deleteCommentById } from "../../api";
import SmallLoader from "../Common/SmallLoader";
import Voting from "../Common/Voting";
import { NavLink } from "react-router";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DeleteConfirmation from "../Common/DeleteConfirmation";
import FormattedDate from "../Common/FormattedDate";
import DropdownMenu from "../Common/DropdownMenu";

export default function Comment({ comment, onCommentDeleted }) {
	const { loggedInUser } = useContext(UserAccount);
	const [message, setMessage] = useState(null);
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [confirmDeletion, setConfirmDeletion] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const commentRef = useRef(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setLoaded(true);
						observer.unobserve(entry.target);
					} else {
						setLoaded(false);
					}
				});
			},
			{ threshold: 0.1 }
		);
		if (commentRef.current) {
			observer.observe(commentRef.current);
		}
		return () => {
			if (commentRef.current) {
				observer.unobserve(commentRef.current);
			}
		};
	}, []);

	useEffect(() => {
		function handleClickOutside(e) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const dropdownOptions = [
		{
			label: "Delete",
			onClick: () => {
				setConfirmDeletion(true);
				setShowMenu(false);
			},
		},
	];

	function handleCommentDeleted() {
		setLoading(true);
		setIsError(false);
		setMessage("");
		deleteCommentById(comment.comment_id)
			.then(() => {
				setMessage("Comment deleted!");
				setTimeout(() => setMessage(""), 3000);
				onCommentDeleted(comment.comment_id);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				setIsError(true);
				setMessage(
					"Something went wrong! Unable to delete comment, please try again later."
				);
				setTimeout(() => setMessage(""), 3000);
			});
	}
	if (loading)
		return (
			<div className="border-t w-full border-highland-500 mt-1">
				<SmallLoader />
			</div>
		);

	return (
		<div ref={commentRef} className={`comment ${loaded ? "loaded" : ""}`}>
			<div className="flex justify-between items-center p-1">
				<span className="flex  flex-row flex-wrap align-top items-start">
					<NavLink
						to={`/users/${comment.author}`}
						className="flex items-center flex-row"
					>
						<img
							src={comment.avatar_url}
							alt="avatar"
							className="rounded-full h-6 w-6 mr-1 hover:shadow-md hover:shadow-mandys-pink-500 hover:transform-3d hover:scale-105"
						/>
						<div className="flex flex-col">
							<span className="secondary-interactive text-left mr-1 text-sm">
								{comment.name}
							</span>
							<span className="text-gray-500 text-xs text-start">
								@{comment.author}
							</span>
						</div>
					</NavLink>
					<FormattedDate date={comment.created_at} />
				</span>
				{comment.author === loggedInUser && (
					<div className="relative" ref={dropdownRef}>
						<i
							className="fa-solid fa-ellipsis-vertical text-gray-500 fa-xl text-right"
							onClick={() => setShowMenu(!showMenu)}
						></i>
						{showMenu && <DropdownMenu options={dropdownOptions} />}
					</div>
				)}
			</div>
			<Dialog
				open={confirmDeletion}
				onClose={() => setConfirmDeletion(false)}
				className="fixed inset-0 z-10 flex items-center justify-center p-4"
			>
				<DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
				<DialogPanel className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
					<DeleteConfirmation
						setConfirmDeletion={setConfirmDeletion}
						onItemDeleted={handleCommentDeleted}
						itemType="comment"
					/>
				</DialogPanel>
			</Dialog>
			<p className="text-neutral text-left m-1">{comment.body}</p>

			<Voting
				votes={comment.votes}
				itemType="comment"
				id={comment.comment_id}
			></Voting>
			{message && (
				<div
					className={`message ${
						isError ? "text-feedback-error" : "text-feedback-success"
					}`}
				>
					{message}
				</div>
			)}
		</div>
	);
}
