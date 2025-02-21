import { NavLink } from "react-router";
import Voting from "./Voting";

export default function ArticleItem({ article }){
    const formattedDate = new Date(article.created_at).toLocaleString();
    return <li className="article-item text-green-kelp-800 w-sm rounded-sm bg-surface">
        <NavLink to={"/articles/" + article.article_id}>
            <img src={article.article_img_url} alt="article image" className="w-xl article-item-img p-2 max-h-40 object-cover"/>
            <h4 className="primary-interactive p-1 pt-0">{article.title}</h4>
        </NavLink>
        <NavLink to={`/users/${article.author}`}>
            <h4 className="secondary-interactive">{article.author}</h4>
        </NavLink>
        <NavLink to={`/articles?topic=${article.topic}`}>
            <p className="m-0.5 tertiary-interactive">Topic: {article.topic[0].toUpperCase() + article.topic.slice(1)}</p>
        </NavLink>
        <p className="m-0.5">Posted on {formattedDate}</p>
        <Voting votes={article.votes} itemType="article" id={article.article_id}></Voting>
        <p className="m-0.5">Comment ({article.comment_count})</p>
    </li>
}