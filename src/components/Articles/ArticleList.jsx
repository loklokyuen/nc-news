import { useEffect, useState } from "react";
import { getArticles } from "../../api";
import ArticleItem from "./ArticleItem";
import { NavLink, useSearchParams } from "react-router";
import SortFilterBar from "./SortFilterBar";
import Loader from "../Common/Loader";
import Pagination from "../Common/Pagination";

export default function ArticleList({ setActivePage }) {
	const [articles, setArticles] = useState([]);
	const [totalNumberOfArticles, setTotalNumberOfArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [numberOfPages, setNumberOfPages] = useState(1);

	const [searchParams, setSearchParams] = useSearchParams();
	const topic = searchParams.get("topic") || "";
	const sort_by = searchParams.get("sort_by");
	const order = searchParams.get("order");
	const limit = searchParams.get("limit");

	useEffect(() => {
		setActivePage("articles");
		setLoading(true);
		setIsError(false);
		setMessage("");
		getArticles(sort_by, order, topic, currentPage, limit)
			.then(({ articles, total_count }) => {
				setArticles(articles);

				setTotalNumberOfArticles(total_count);
				setLoading(false);
				if (limit) {
					setNumberOfPages(Math.ceil(total_count / limit));
				} else {
					setNumberOfPages(Math.ceil(total_count / 10));
				}
				if (total_count === "0") {
					setMessage("No article about this topic yet");
				}
			})
			.catch((err) => {
				setLoading(false);
				setIsError(true);
				const errorMessage =
					err.response?.data?.msg ||
					"Something went wrong! Unable to fetch articles, please try again later.";
				setMessage(errorMessage);
			});
	}, [sort_by, order, topic, currentPage, limit]);

	useEffect(() => {
		setCurrentPage(1);
	}, [sort_by, order, topic, limit]);

	function handlePageChange(page) {
		setCurrentPage(page);
	}
	if (loading) return <Loader />;
	if (isError) return <div className="not-found">{message}</div>;

	return (
		<div>
			<h2 className="title">
				{topic ? topic[0].toUpperCase() + topic.slice(1) : "All Articles"} (
				{totalNumberOfArticles})
				<NavLink to="/articles/add" aria-label="Add Article">
					<i className="absolute float-right m-1 p-0 text-center justify-center text-shadow-green-500 bg-shadow-green-50 rounded-2xl hover:text-shadow-green-50 hover:bg-shadow-green-500 hover:border-shadow-green-500 hover:border fa-solid fa-circle-plus fa-md"></i>
				</NavLink>
			</h2>
			<SortFilterBar
				topic={topic}
				limit={limit}
				setSearchParams={setSearchParams}></SortFilterBar>
			{!isError && message && <div className="not-found">{message}</div>}
			<ul className="items-center flex flex-col flex-wrap justify-center md:flex-row md:grid-cols-3 md:items-stretch md:gap-x-4">
				{articles.map((article) => {
					return (
						<ArticleItem
							key={article.article_id}
							article={article}></ArticleItem>
					);
				})}
			</ul>
			<Pagination
				currentPage={currentPage}
				onPageChanged={handlePageChange}
				totalPages={numberOfPages}></Pagination>
		</div>
	);
}
