import { useEffect, useState, useRef } from "react";
import { getTopics } from "../../api";
import DropdownMenu from "../Common/DropdownMenu";

export default function SortFilterBar({ topic, limit, setSearchParams }) {
	const [topics, setTopics] = useState([]);
	const [showSortMenu, setShowSortMenu] = useState(false);
	const [showTopicMenu, setShowTopicMenu] = useState(false);
	const [showLimitMenu, setShowLimitMenu] = useState(false);

	const [sortOption, setSortOption] = useState("Most Recent");
	const [topicOption, setTopicOption] = useState("All Topics");
	const [limitOption, setLimitOption] = useState(limit || "10");

	const sortMenuRef = useRef(null);
	const topicMenuRef = useRef(null);
	const limitMenuRef = useRef(null);

	useEffect(() => {
		getTopics().then(({ topics }) => {
			const topicOptions = topics.map((topic) => topic.slug);
			topicOptions.unshift("all");
			setTopics(topicOptions);
		});
	}, []);

	useEffect(() => {
		function handleClickOutside(e) {
			if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
				setShowSortMenu(false);
			}
			if (topicMenuRef.current && !topicMenuRef.current.contains(e.target)) {
				setShowTopicMenu(false);
			}
			if (limitMenuRef.current && !limitMenuRef.current.contains(e.target)) {
				setShowLimitMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (topic) {
			setTopicOption(topic[0].toUpperCase() + topic.slice(1));
		} else {
			setTopicOption("All Topics");
		}
	}, [topic]);

	useEffect(() => {
		if (limit) {
			setLimitOption(limit);
		} else {
			setLimitOption("10");
		}
	}, [limit]);

	const updateSearchParams = (key, value) => {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			if (value && value !== "all") {
				newParams.set(key, value);
			} else {
				newParams.delete(key);
			}
			return newParams;
		});
	};

	function handleSortChange(sort_by, order) {
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			if (sort_by) newParams.set("sort_by", sort_by);
			if (order) newParams.set("order", order);
			return newParams;
		});
	}

	const sortOptions = [
		{
			label: "Most Recent",
			onClick: () => {
				setSortOption("Most Recent");
				handleSortChange("created_at", "desc");
			},
		},
		{
			label: "Most Popular",
			onClick: () => {
				setSortOption("Most Popular");
				handleSortChange("votes", "desc");
			},
		},
		{
			label: "Most Discussed",
			onClick: () => {
				setSortOption("Most Discussed");
				handleSortChange("comment_count", "desc");
			},
		},
		{
			label: "Oldest",
			onClick: () => {
				setSortOption("Oldest");
				handleSortChange("created_at", "asc");
			},
		},
		{
			label: "Least Popular",
			onClick: () => {
				setSortOption("Least Popular");
				handleSortChange("votes", "asc");
			},
		},
		{
			label: "Least Discussed",
			onClick: () => {
				setSortOption("Least Discussed");
				handleSortChange("comment_count", "asc");
			},
		},
	];

	const topicOptions = topics.map((topic) => {
		return {
			label: topic[0].toUpperCase() + topic.slice(1),
			onClick: () => {
				setShowTopicMenu(false);
				setTopicOption(topic[0].toUpperCase() + topic.slice(1));
				updateSearchParams("topic", topic);
			},
		};
	});

	const limitOptions = [
		{
			label: "5",
			onClick: () => {
				setLimitOption("5");
				updateSearchParams("limit", "5");
			},
		},
		{
			label: "10",
			onClick: () => {
				setLimitOption("10");
				updateSearchParams("limit", "10");
			},
		},
		{
			label: "20",
			onClick: () => {
				setLimitOption("20");
				updateSearchParams("limit", "20");
			},
		},
		{
			label: "30",
			onClick: () => {
				setLimitOption("30");
				updateSearchParams("limit", "30");
			},
		},
	];

	return (
		<section>
			<div className="flex md:flex-row justify-around mt-2 items-stretch flex-wrap gap-2 lg:mx-36">
				<div className="flex flex-row items-center m-1">
					<label htmlFor="sort-by" className="text-tertiary font-bold">
						Sort By:
					</label>
					<div className="relative" ref={sortMenuRef}>
						<span
							onClick={() => setShowSortMenu(!showSortMenu)}
							className="text-tertiary bg-surface m-1 p-1.5 px-2 rounded-xl font-semibold text-nowrap cursor-pointer"
						>
							{sortOption}
							<i className="fa-solid fa-caret-down ml-1"></i>
						</span>
						{showSortMenu && <DropdownMenu options={sortOptions} />}
					</div>
				</div>
				<div className="flex flex-row items-center m-1">
					<label htmlFor="current-topic" className="text-tertiary font-bold">
						Topic:
					</label>
					<div className="relative" ref={topicMenuRef}>
						<span
							onClick={() => setShowTopicMenu(!showTopicMenu)}
							className="text-tertiary bg-surface m-1 p-1.5 px-2 rounded-xl font-semibold text-nowrap cursor-pointer"
						>
							{topicOption}
							<i className="fa-solid fa-caret-down ml-1"></i>
						</span>
						{showTopicMenu && <DropdownMenu options={topicOptions} />}
					</div>
				</div>
				<div className="flex flex-row items-center m-1">
					<label htmlFor="limit" className="text-tertiary font-bold">
						Articles per page:
					</label>
					<div className="relative" ref={limitMenuRef}>
						<span
							onClick={() => setShowLimitMenu(!showLimitMenu)}
							className="text-tertiary bg-surface m-1 p-1.5 px-2 rounded-xl font-semibold text-nowrap cursor-pointer"
						>
							{limitOption}
							<i className="fa-solid fa-caret-down ml-1"></i>
						</span>
						{showLimitMenu && <DropdownMenu options={limitOptions} />}
					</div>
				</div>
			</div>
		</section>
	);
}
