import { useContext } from "react";
import { NavLink } from "react-router";
import { UserAccount } from "../../contexts/UserAccount";

export default function NavBar({ activePage }) {
	const { loggedInUser, displayName, avatarURL } = useContext(UserAccount);
	return (
		<div className="bg-surface max-w-xl mx-auto py-1">
			<NavLink to="/">
				<span
					className={`h-10 text-2xl rounded-xs font-stretch-80% text-primary font-semibold italic tracking-wide font-serif hover:after:bg-mandys-pink-600 hover:after:w-full hover:after:h-1`}
				>
					Next
					<span className="text-mandys-pink-500 font-extrabold">Core</span> News
				</span>
			</NavLink>
			<br />
			<nav className="nav-bar flex flex-row items-center justify-center divide-x-3 divide-highland-400">
				<NavLink to="/articles">
					<span
						className={`h-8 m-1 tertiary-interactive  ${
							activePage === "articles"
								? "border-b-mandys-pink-400 border-b-2 text-mandys-pink-500"
								: "text-tertiary"
						}`}
					>
						Articles
					</span>
				</NavLink>
				<NavLink to="/topics">
					<span
						className={`h-8 m-1 tertiary-interactive  ${
							activePage === "topics"
								? "border-b-mandys-pink-400 border-b-2 text-mandys-pink-500"
								: "text-tertiary"
						}`}
					>
						Topics
					</span>
				</NavLink>
				<NavLink to="/articles/add">
					<span
						className={`h-8 m-1 tertiary-interactive  ${
							activePage === "new-article"
								? "border-b-mandys-pink-400 border-b-2 text-mandys-pink-500"
								: "text-tertiary"
						}`}
					>
						New Article
					</span>
				</NavLink>
				<NavLink to={"/users/" + loggedInUser}>
					<div className="avatar-container">
						<img
							src={avatarURL}
							alt={`${displayName || "User"}'s profile picture`}
							className="h-6 w-6 rounded-4xl ml-2 shadow-md shadow-mandys-pink-500 hover:transform-3d hover:scale-110"
						/>
					</div>
				</NavLink>
			</nav>
		</div>
	);
}
