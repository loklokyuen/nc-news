import { useContext } from "react";
import { NavLink } from "react-router";
import { UserAccount } from "../contexts/UserAccount";

export default function NavBar({ activePage }) {
    const { loggedInUser, avatarURL } = useContext(UserAccount);
    return <div className="bg-surface/50 max-w-xl mx-auto py-1">
          <NavLink to="/">
            <span className="h-10 text-2xl rounded-xs text-primary font-stretch-80% font-semibold">Northcoders News</span>
          </NavLink>
          <br />
        <nav className="nav-bar flex flex-row items-center justify-center divide-x-3 divide-asparagus-500">
          <NavLink to="/articles/add">
            <span className={`h-8 m-1 text-highland-500 hover:text-tertiary-light ${activePage === "new-article"? "underline": null}`}>New Article</span>
          </NavLink>
          <NavLink to="/articles">
            <span className={`h-8 m-1 text-highland-500 hover:text-tertiary-hover ${activePage === "articles"? "underline": null}`}>Articles</span>
          </NavLink>
          <NavLink to="/topics">
            <span className={`h-8 m-1 text-highland-500 hover:text-tertiary-hover ${activePage === "topics"? "underline": null}`}>Topics</span>
          </NavLink>
          <NavLink to={"/users/" + loggedInUser}>
            <div className="avatar-container">
                <img src={avatarURL} alt="user avatar" className="h-6 w-6 rounded-4xl ml-2" />
            </div>
          </NavLink>
        </nav>
    </div>
}