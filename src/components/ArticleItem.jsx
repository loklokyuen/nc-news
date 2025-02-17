import { NavLink } from "react-router";

export default function ArticleItem({ article }){
    const formattedDate = new Date(article.created_at).toLocaleString();
    return <li className="article-item text-white w-xs rounded-sm">
        <NavLink to={"/articles/" + article.article_id}>
            <img src={article.article_img_url} alt="article image" className="w-xl article-item-img"/>
            <h4>{article.title}</h4>
        </NavLink>
        <p>{article.author}</p>
        <p>{article.body}</p>
        <p>Created At: {formattedDate}</p>
        <p><i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {article.votes}</p>
        <p>Comment ({article.comment_count})</p>
    </li>
}