import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getArticleById } from "../api";

export default function Article(){
    const [article, setArticle] = useState({})
    const params = useParams();
    const articleId = params.article_id;
    useEffect(()=>{
        getArticleById(articleId)
        .then(({ article })=>{
            const formattedDate = new Date(article.created_at).toLocaleString();
            article.created_at = formattedDate
            setArticle(article)
        })
    }, [])
    return <section className="w-80vw bg-ash-green-500 text-dark-green-500 p-5">
        <h2 className="font-extrabold text-2xl p-5">Article</h2>
        <img src={article.article_img_url} alt="article image" className="p-2 w-80vw"/>
        <h3 className="font-bold text-xl">{article.title}</h3>
        <p>{article.author}</p>
        <h4 className="font-semibold text-asparagus-500">Topic: {article.topic}</h4>
        <p>Created At: {article.created_at}</p>
        <p className="p-5">{article.body}</p>

        <p>
            <i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {article.votes}
        </p>
    </section>
}