import { NavLink } from "react-router";
import Voting from "../Common/Voting";
import { useEffect, useRef, useState } from "react";
import FormattedDate from "../Common/FormattedDate";

export default function ArticleItem({ article }) {
	const [loaded, setLoaded] = useState(false);
	const articleRef = useRef(null);

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
		if (articleRef.current) {
			observer.observe(articleRef.current);
		}
		return () => {
			if (articleRef.current) {
				observer.unobserve(articleRef.current);
			}
		};
	}, []);
	return (
		<li
			ref={articleRef}
			className={`article-item ${loaded ? "loaded" : ""} flex flex-col`}
		>
			<section className="flex flex-row items-center">
				<div className="secondary-interactive ml-2 flex flex-row align-top p-1">
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
			</section>
			<div className="relative">
				<NavLink to={"/articles/" + article.article_id}>
					<img
						src={article.article_img_url}
						alt="article image"
						className="rounded-lg article-item-img px-1 py-1 h-40 object-cover mx-auto"
					/>
				</NavLink>
			</div>
			<NavLink
				to={"/articles/" + article.article_id}
				className="flex flex-col justify-center flex-grow"
			>
				<h2 className="primary-interactive p-1 pt-0">{article.title}</h2>
			</NavLink>
			<section className="flex flex-row items-center text-center justify-between bg-bg/50 rounded-md mt-auto w-full px-2">
				<section className="flex flex-row items-center w-full">
					<Voting
						votes={article.votes}
						itemType="article"
						id={article.article_id}
					></Voting>
					<span className="ml-1 font-semibold font-stretch-90%">
						<NavLink to={`/articles/${article.article_id}#comments`}>
							<i className="fa-regular fa-comments fa-xl text-cyan-800 action-icon"></i>
							<span className="text-cyan-800 font-bold font-stretch-90% ">
								{article.comment_count}
							</span>
						</NavLink>
					</span>
				</section>
				<NavLink
					to={`/articles?topic=${article.topic}`}
					className=" bg-mandys-pink-500/90 hover:bg-mandys-pink-600/90 rounded-full"
				>
					<p className="m-1 font-semibold text-white italic hover:text-mandys-pink-50 capitalize px-1">
						#{article.topic}
					</p>
				</NavLink>
			</section>
		</li>
	);
}
