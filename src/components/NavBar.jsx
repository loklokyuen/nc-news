import { useContext } from "react";
import { NavLink } from "react-router";
import { UserAccount } from "../contexts/UserAccount";

export default function NavBar({ currentPage }) {
    const { loggedInUser, avatarURL } = useContext(UserAccount);
    return <div className="bg-shadow-green-100/50">
          <NavLink to="/">
            <span className="h-10 text-2xl rounded-xs text-shadow-green-600 font-stretch-80% font-semibold">Northcoders News</span>
          </NavLink>
          <br />
        <nav className="nav-bar flex flex-row items-center justify-center divide-x-3 divide-asparagus-500">
          <NavLink to="/articles/add">
            <span className={`h-8 m-1 text-highland-500 hover:text-highland-400 ${currentPage === "new-article"? "underline": null}`}>New Article</span>
          </NavLink>
          <NavLink to="/articles">
            <span className={`h-8 m-1 text-highland-500 hover:text-highland-400 ${currentPage === "articles"? "underline": null}`}>Articles</span>
          </NavLink>
          <NavLink to="/topics">
            <span className={`h-8 m-1 text-highland-500 hover:text-highland-400 ${currentPage === "topics"? "underline": null}`}>Topics</span>
          </NavLink>
          <NavLink to={"/users/" + loggedInUser}>
            <div className="avatar-container">
                <img src={avatarURL} alt="user avatar" className="h-6 w-6 rounded-4xl ml-2" />
            </div>
          </NavLink>
        </nav>
    </div>
}