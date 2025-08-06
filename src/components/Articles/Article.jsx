import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, useParams } from "react-router";
import { deleteArticleById, getArticleById } from "../../api";
import Loader from "../Common/Loader";
import Voting from "../Common/Voting";
import CommentList from "../Comments/CommentList";
import { UserAccount } from "../../contexts/UserAccount";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DeleteConfirmation from "../Common/DeleteConfirmation";
import FormattedDate from "../Common/FormattedDate";
import DropdownMenu from "../Common/DropdownMenu";

export default function Article() {
	const { loggedInUser } = useContext(UserAccount);

	const [article, setArticle] = useState(null);
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [confirmDeletion, setConfirmDeletion] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const dropdownRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const params = useParams();
	const articleId = params.article_id;
	useEffect(() => {
		setLoading(true);
		setIsError(false);
		setMessage("");
		getArticleById(articleId)
			.then(({ article }) => {
				setArticle(article);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				setIsError(true);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to fetch article, please try again later.";
				setMessage(errorMessage);
			});
	}, [articleId]);

	function handleArticleDeleted() {
		setLoading(true);
		setIsError(false);
		setMessage("");
		deleteArticleById(articleId)
			.then((status) => {
				if (status === 204) {
					setMessage("Article deleted!");
					setLoading(false);
				}
			})
			.catch((err) => {
				setLoading(false);
				setIsError(true);
				setMessage(
					"Something went wrong! Unable to delete article, please try again later."
				);
				setTimeout(() => setMessage(""), 3000);
			});
	}

	if (loading) return <Loader />;
	if (isError && !article) return <div className="not-found">{message}</div>;
	if (message)
		return (
			<section
				className={`m-2 font-semibold bg-mandys-pink-50/50 p-4 max-w-xl mx-auto ${
					isError ? "text-feedback-error" : "text-primary"
				}`}
			>
				{message}
				<section className="flex flex-row gap-1 m-2 items-center justify-center">
					<NavLink to="/articles/add">
						<button className="bg-mandys-pink-500">Post a new article</button>
					</NavLink>
					<NavLink to="/articles">
						<button>Browse articles</button>
					</NavLink>
				</section>
			</section>
		);

	const dropdownOptions = [
		{
			label: "Delete",
			onClick: () => {
				setConfirmDeletion(true);
				setShowMenu(false);
			},
		},
	];

	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<section className="max-w-2xl bg-surface text-neutral mt-2 justify-center flex flex-col self-center rounded-sm shadow-sm shadow-green-kelp-800/60">
				<section className="flex flex-row items-center mb-2">
					<div className="secondary-interactive flex flex-row items-center justify-between w-full px-4 py-2 rounded-t-md bg-highland-50/80 border-b border-green-kelp-700/70">
						<div className="secondary-interactive flex flex-row align-top p-1 ">
							<NavLink
								to={`/users/${article.author}`}
								className="flex flex-row items-center"
							>
								<img
									src={article.avatar_url}
									alt={`${article.name || "User"}'s profile picture`}
									className="rounded-full h-6 w-6 mr-1 hover:shadow-md hover:shadow-mandys-pink-500 hover:transform-3d hover:scale-105"
								/>
								<div className="flex flex-col">
									<span className="secondary-interactive text-sm">
										{article.name}
									</span>
									<span className="text-neutral text-xs text-start">
										@{article.author}
									</span>
								</div>
							</NavLink>
							<FormattedDate date={article.created_at} />
						</div>
						{article.author === loggedInUser && (
							<div className="relative" ref={dropdownRef}>
								<i
									className="fa-solid fa-ellipsis-vertical text-gray-500 fa-xl text-right"
									onClick={() => setShowMenu(!showMenu)}
								></i>
								{showMenu && <DropdownMenu options={dropdownOptions} />}
							</div>
						)}
					</div>
				</section>
				<div className="flex flex-row justify-between items-start w-full relative m-0 xs:text-sm">
					<span className="title">{article.title}</span>
				</div>
				<section className="relative flex justify-center w-full">
					<img
						src={article.article_img_url}
						alt="article image"
						className="p-2 w-full max-w-2xl object-cover"
					/>
				</section>

				<Dialog
					open={confirmDeletion}
					onClose={() => setConfirmDeletion(false)}
					className="fixed inset-0 z-10 flex items-center justify-center p-4"
				>
					<DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
					<DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full ">
						<DeleteConfirmation
							setConfirmDeletion={setConfirmDeletion}
							onItemDeleted={handleArticleDeleted}
							itemType="article"
						/>
					</DialogPanel>
				</Dialog>
				<p className="px-4 py-2 text-left">{article.body}</p>
				<div className="flex justify-between p-1 items-center rounded-b-md bg-highland-50/80 border-t border-green-kelp-700/70 w-full mx-auto">
					<div className="flex flex-row items-center p-1">
						<Voting
							votes={article.votes}
							itemType="article"
							id={articleId}
						></Voting>
						<div className="flex flex-row items-center ml-2">
							<i className="fa-regular fa-comments fa-xl text-cyan-800 mr-1"></i>
							<span className="text-cyan-800 font-bold font-stretch-90% ">
								{article.comment_count}
							</span>
						</div>
					</div>
					<NavLink
						to={`/articles?topic=${article.topic}`}
						className="ml-4 items-center px-3 py-1 bg-mandys-pink-500/90 hover:bg-mandys-pink-600/90 rounded-full"
					>
						<span className="text-sm font-semibold whitespace-nowrap text-white hover:text-mandys-pink-50 capitalize">
							#{article.topic}
						</span>
					</NavLink>
				</div>
			</section>
			<CommentList
				articleId={articleId}
				commentCount={article.comment_count}
			></CommentList>
		</div>
	);
}
