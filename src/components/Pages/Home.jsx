import { useEffect, useState } from "react";
import { getArticles, getTopics } from "../../api";
import ArticleItem from "../Articles/ArticleItem";
import Topic from "../Topics/Topic";
import { NavLink } from "react-router";
import SmallLoader from "../Common/SmallLoader";

export default function Home({ setActivePage }) {
	const [latestArticles, setLatestArticles] = useState([]);
	const [topics, setTopics] = useState([]);
	const [loadingArticles, setLoadingArticles] = useState(true);
	const [loadingTopics, setLoadingTopics] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setActivePage("home");
		setLoadingArticles(true);
		setLoadingTopics(true);
		setIsError(false);
		const limit = 2;
		getArticles(null, null, null, null, limit)
			.then(({ articles }) => {
				setLatestArticles(articles);
				setLoadingArticles(false);
				return getTopics();
			})
			.then(({ topics }) => {
				setTopics(topics.slice(0, 4));
				setLoadingTopics(false);
			})
			.catch((err) => {
				setLoadingArticles(false);
				setLoadingTopics(false);
				setIsError(true);
			});
	}, []);

	return (
		<section className="items-center justify-center flex mt-4 flex-col">
			<section className="banner items-center h-60 justify-center w-full max-w-screen-sm flex mx-auto overflow-hidden">
				<h1 className="font-serif text-white text-4xl bg-primary/70 rounded-md p-8 font-light italic">
					Next
					<span className="text-mandys-pink-500 font-extrabold">Core</span> News
				</h1>
			</section>
			<section className="items-center justify-center flex flex-col">
				<h2 className="title">
					Welcome to{" "}
					<span className="font-serif italic font-semibold">
						Next
						<span className="text-mandys-pink-500 font-semibold">
							Core
						</span>{" "}
						News
					</span>
					!
				</h2>
				<p className="text-green-kelp-700 max-w-2xl">
					<span className="italic font-semibold font-serif text-primary">
						Next
						<span className="text-mandys-pink-500 font-extrabold">
							Core
						</span>{" "}
						News
					</span>{" "}
					is your go-to platform for discovering, sharing, and discussing the
					latest stories. Our community-driven platform lets you{" "}
					<b>post articles</b>, <b>join discussions</b>, and{" "}
					<b>upvote content</b> to highlight what matters most.
				</p>
				<p className="text-green-kelp-700 max-w-2xl">
					Stay informed, share your insights, and explore a world of knowledge
					and perspectives—all in one place.
				</p>
			</section>
			<section className="items-center justify-center flex flex-col">
				<h2 className="font-bold text-2xl pt-4 text-primary italic">
					Check out the latest articles
				</h2>
				<ul className="items-center flex flex-col flex-wrap justify-center md:flex-row md:grid-cols-3 md:items-stretch md:gap-x-4">
					{latestArticles.map((article) => {
						return (
							<ArticleItem
								key={article.article_id}
								article={article}
							></ArticleItem>
						);
					})}
				</ul>
				{loadingArticles && <SmallLoader key="articles-loader" />}
				<section className="items-center w-full mx-auto p-1">
					<NavLink to="/articles">
						<button>View All Articles</button>
					</NavLink>
				</section>
				{isError && latestArticles.length === 0 && (
					<div className="not-found">
						Something went wrong! Unable to fetch articles, please try again
						later.
					</div>
				)}
			</section>
			<section className="items-start justify-center flex flex-col">
				<h2 className="font-bold text-2xl p-2 text-primary italic">
					Or choose from a topic
				</h2>
				{topics.map((topic) => {
					return <Topic key={topic.slug} topic={topic}></Topic>;
				})}
				{loadingTopics && <SmallLoader key="topics-loader" />}
				<div className="items-center w-full mx-auto p-1">
					<NavLink to="/topics">
						<button>View All Topics</button>
					</NavLink>
				</div>
				{isError && topics.length === 0 && (
					<div className="not-found">
						Something went wrong! Unable to fetch topics, please try again
						later.
					</div>
				)}
			</section>
			<section className="items-center justify-center flex flex-col">
				<h2 className="font-bold text-2xl p-4 text-primary italic">
					Start a conversation by posting your thoughts
				</h2>
				<NavLink to="/articles/add">
					<button className="secondary">Post an Article</button>
				</NavLink>
			</section>
		</section>
	);
}
