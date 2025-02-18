import { NavLink } from "react-router";

export default function ArticleItem({ article }){
    const formattedDate = new Date(article.created_at).toLocaleString();
    return <li className="article-item text-green-kelp-800 w-sm rounded-sm bg-shadow-green-300 m-2">
        <NavLink to={"/articles/" + article.article_id}>
            <img src={article.article_img_url} alt="article image" className="w-xl article-item-img p-2"/>
            <h4 className="text-highland-600 hover:text-highland-400 p-2 text-lg">{article.title}</h4>
        </NavLink>
        <p>{article.author}</p>
        <p>Posted on {formattedDate}</p>
        <p><i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {article.votes}</p>
        <p>Comment ({article.comment_count})</p>
    </li>
}