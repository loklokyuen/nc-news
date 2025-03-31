import { useContext, useEffect, useRef, useState } from "react";
import { getTopics, postArticle } from "../../api";
import { UserAccount } from "../../contexts/UserAccount";
import Loader from "../Common/Loader";
import { NavLink } from "react-router";
import NewTopic from "../Topics/NewTopic";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import DropdownMenu from "../Common/DropdownMenu";

export default function NewArticle({ setActivePage }) {
	const { loggedInUser } = useContext(UserAccount);
	const topRef = useRef(null);
	const topicRef = useRef(null);

	const [title, setTitle] = useState("");
	const [topic, setTopic] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [body, setBody] = useState("");
	const [topics, setTopics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState("");
	const [titleErrorMessage, setTitleErrorMessage] = useState("");
	const [bodyErrorMessage, setBodyErrorMessage] = useState("");
	const [topicErrorMessage, setTopicErrorMessage] = useState("");
	const [imageErrorMessage, setImageErrorMessage] = useState("");
	const [newArticleId, setNewArticleId] = useState(null);
	const [createNewTopic, setCreateNewTopic] = useState(false);
	const [showTopics, setShowTopics] = useState(false);

	useEffect(() => {
		setActivePage("new-article");
		setLoading(true);
		setIsError(false);
		setMessage("");
		getTopics()
			.then(({ topics }) => {
				setTopics(topics);
				setLoading(false);
			})
			.catch((err) => {
				setIsError(true);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to fetch topics, please try again later.";
				setMessage(errorMessage);
				setTimeout(() => setMessage(""), 3000);
			});
	}, []);

	function checkImageExist(url) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.onload = function () {
				if (this.width > 0) {
					resolve(true);
				} else {
					setIsError(true);
					setImageErrorMessage("- Please enter a valid image URL.");
					reject(false);
				}
			};
			image.onerror = function () {
				setIsError(true);
				setImageErrorMessage("- Please enter a valid image URL.");
				reject(false);
			};
			image.src = url;
		});
	}

	function handleTopicAdded(topic) {
		setTopics([...topics, topic]);
	}

	function handleTopicCreation() {
		setCreateNewTopic(true);
	}

	function handleClearInput() {
		setTitle("");
		setBody("");
		setImageURL("");
		setTopic("");
		setMessage("");
		setIsError(false);
	}

	async function handleArticleSubmit(e) {
		setNewArticleId("");
		e.preventDefault();
		let hasError = false;
		if (title === "" || body === "" || topic === "") {
			setIsError(true);
			if (title === "") setTitleErrorMessage("- Please enter a title.");
			if (body === "") setBodyErrorMessage("- Please enter an article body.");
			if (topic === "") setTopicErrorMessage("- Please choose from a topic.");
			setMessage("Please enter all the required fields before submitting.");
			hasError = true;
		}
		if (imageURL !== "") {
			try {
				const imageExists = await checkImageExist(imageURL);
				if (!imageExists) {
					setIsError(true);
					if (hasError)
						setMessage(
							"Please enter all the required fields and ensure your input is valid before submitting."
						);
					else
						setMessage("Please ensure your input is valid before submitting.");
					hasError = true;
				}
			} catch (error) {
				setIsError(true);
				if (hasError)
					setMessage(
						"Please enter all the required fields and ensure your input is valid before submitting."
					);
				else setMessage("Please ensure your input is valid before submitting.");
				hasError = true;
			}
		}
		if (hasError) {
			if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
			return;
		}
		setMessage("");
		setImageErrorMessage("");
		setLoading(true);
		postArticle(loggedInUser, title, body, topic, imageURL)
			.then(({ insertedArticle }) => {
				setMessage(`Your article is successfully posted!`);
				if (topRef.current)
					topRef.current.scrollIntoView({ behavior: "smooth" });
				setLoading(false);
				setIsError(false);
				setTitle("");
				setImageURL("");
				setBody("");
				setNewArticleId(insertedArticle.article_id);
				setTimeout(() => setMessage(""), 10000);
			})
			.catch((err) => {
				setIsError(true);
				setLoading(false);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to post article, please try again later.";
				setMessage(errorMessage);
				if (topRef.current)
					topRef.current.scrollIntoView({ behavior: "smooth" });
				setTimeout(() => setMessage(""), 10000);
			});
	}

	const topicOptions = topics.map((topicItem) => ({
		label: topicItem.slug[0].toUpperCase() + topicItem.slug.slice(1),
		onClick: () => {
			setTopic(topicItem.slug);
			setShowTopics(false);
			setTopicErrorMessage("");
		},
	}));

	if (loading) return <Loader />;
	return (
		<section
			ref={topRef}
			className="flex flex-col items-center border-t border-highland-500"
		>
			<h2 className="title">Post an article</h2>
			{message && (
				<div
					className={`message w-full max-w-3xl mb-2 rounded-lg ${
						isError
							? "text-feedback-error text-start"
							: "text-feedback-success text-center"
					}`}
				>
					<ul className="flex flex-col p-4 items-start">
						<li className="font-semibold">{message}</li>
						{titleErrorMessage && <li className="mt-1">{titleErrorMessage}</li>}
						{bodyErrorMessage && <li className="mt-1">{bodyErrorMessage}</li>}
						{imageErrorMessage && <li className="mt-1">{imageErrorMessage}</li>}
						{topicErrorMessage && <li className="mt-1">{topicErrorMessage}</li>}
					</ul>
					{newArticleId ? (
						<div className="flex justify-center mb-4">
							<NavLink to={`/articles/${newArticleId}`}>
								<button className="py-2 px-4">Go to your new article</button>
							</NavLink>
						</div>
					) : null}
				</div>
			)}
			<form className="w-full max-w-xl" onSubmit={handleArticleSubmit}>
				<section className="items-center text-tertiary font-bold">
					<div className="flex flex-row">
						<label
							htmlFor="new-article-title"
							className="text-tertiary font-bold p-1 mr-2 text-left"
						>
							Title:
						</label>
						<input
							id="new-article-title"
							name="new-article-title"
							type="text"
							value={title}
							className={`p-2 border rounded-md text-tertiary bg-shadow-green-100 w-full font-medium ${
								titleErrorMessage
									? "error-input border-red-500"
									: "border-gray-300"
							}`}
							onChange={(e) => {
								setTitle(e.target.value);
								setTitleErrorMessage("");
								if (title !== "" && body !== "" && topic !== "") setMessage("");
							}}
						/>
					</div>

					<div className="flex flex-col w-full">
						<div className="flex flex-row flex-wrap md:items-center my-2 w-full items-center">
							<label
								htmlFor="new-article-topic"
								className="text-tertiary font-bold p-1 mr-2 text-left"
							>
								Topic:
							</label>
							<div className="relative w-auto" ref={topicRef}>
								<span
									onClick={() => setShowTopics(!showTopics)}
									className="text-tertiary bg-surface p-2 px-3 rounded-xl font-semibold cursor-pointer flex items-center justify-between w-full  border border-gray-300"
								>
									<span className="truncate mr-1">
										{topic
											? topic[0].toUpperCase() + topic.slice(1)
											: "Select a topic"}
									</span>
									<i className="fa-solid fa-caret-down"></i>
								</span>
								{showTopics && (
									<div className="absolute z-10 w-full">
										<DropdownMenu options={topicOptions} />
									</div>
								)}
							</div>
							<span className="mx-2 hidden md:inline">or</span>
							<button
								type="button"
								onClick={handleTopicCreation}
								disabled={loading}
								aria-label="Create a new topic"
								className="md:hidden"
							>
								<i className="fa-solid fa-plus"></i>
							</button>
							<button
								type="button"
								onClick={handleTopicCreation}
								disabled={loading}
								className="hidden md:block"
							>
								Create a new topic
							</button>
						</div>
					</div>

					<div className="flex flex-col md:flex-row mb-2">
						<label
							htmlFor="new-article_img_url"
							className="text-tertiary font-bold p-1 mb-2 md:mb-0 md:mr-2 text-left text-nowrap"
						>
							Image URL:
						</label>
						<input
							id="new-article_img_url"
							name="new-article_img_url"
							type="text"
							value={imageURL}
							placeholder="(optional)"
							className={`p-2 border rounded-md text-tertiary bg-shadow-green-100 w-full ${
								imageErrorMessage
									? "error-input border-red-500"
									: "border-gray-300"
							}`}
							onChange={(e) => {
								setImageURL(e.target.value);
								setImageErrorMessage("");
							}}
						/>
					</div>
				</section>

				<div className="flex flex-col items-center w-full mb-4">
					<label
						htmlFor="new-article-body"
						className="text-tertiary font-bold w-full p-1 mb-2 text-left"
						aria-label="article-body"
					>
						Article Body:
					</label>
					<textarea
						value={body}
						id="new-article-body"
						name="new-article-body"
						rows={10}
						onChange={(e) => {
							setBody(e.target.value);
							setBodyErrorMessage("");
							if (title !== "" && body !== "" && topic !== "") setMessage("");
						}}
						className={`resize-y border rounded-md p-3 w-full bg-shadow-green-100 ${
							bodyErrorMessage
								? "error-input border-red-500"
								: "border-gray-300"
						}`}
						placeholder="Write your article here..."
					></textarea>
				</div>

				<section className="flex flex-row items-center justify-center gap-4 my-6">
					<button type="button" onClick={handleClearInput} className="cancel">
						Clear
					</button>
					<button type="submit" disabled={loading} className="secondary">
						Submit
					</button>
				</section>
			</form>

			<Dialog
				open={createNewTopic}
				onClose={() => setCreateNewTopic(false)}
				className="fixed inset-0 z-10 flex items-center justify-center p-2"
			>
				<DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
				<DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
					<NewTopic
						setCreateNewTopic={setCreateNewTopic}
						onTopicCreated={handleTopicAdded}
					/>
				</DialogPanel>
			</Dialog>
		</section>
	);
}
