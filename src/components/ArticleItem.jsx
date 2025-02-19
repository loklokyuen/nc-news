import { NavLink } from "react-router";
import Voting from "./Voting";

export default function ArticleItem({ article }){
    const formattedDate = new Date(article.created_at).toLocaleString();
    return <li className="article-item text-green-kelp-800 w-sm rounded-sm bg-shadow-green-300 m-1">
        <NavLink to={"/articles/" + article.article_id}>
            <img src={article.article_img_url} alt="article image" className="w-xl article-item-img p-2"/>
            <h4 className="text-highland-600 hover:text-highland-400 p-1 pt-0 text-lg font-bold">{article.title}</h4>
        </NavLink>
        <NavLink to={`/users/${article.author}`}>
            <h4 className="font-semibold text-green-kelp-600 hover:text-green-kelp-400">{article.author}</h4>
        </NavLink>
        <NavLink to={`/articles?topic=${article.topic}`}>
            <p className="m-0.5 font-semibold text-highland-600 hover:text-highland-400">Topic: {article.topic[0].toUpperCase() + article.topic.slice(1)}</p>
        </NavLink>
        <p className="m-0.5">Posted on {formattedDate}</p>
        <Voting votes={article.votes} itemType="article" id={article.article_id}></Voting>
        <p className="m-0.5">Comment ({article.comment_count})</p>
    </li>
}