import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getArticleById, getCommentsByArticleId } from "../api";
import Comment from "./Comment";

export default function Article(){
    const [article, setArticle] = useState({})
    const [comments, setComments] = useState([])

    const params = useParams();
    const articleId = params.article_id;
    useEffect(()=>{
        getArticleById(articleId)
        .then(({ article })=>{
            const formattedDate = new Date(article.created_at).toLocaleString();
            article.created_at = formattedDate
            setArticle(article)
            return getCommentsByArticleId(articleId)
        })
        .then(({ comments })=>{
            setComments(comments)
        })
    }, [])
    return <section className="w-80vw bg-shadow-green-300 text-green-kelp-800 mt-2">
        <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Article</h2>
        <img src={article.article_img_url} alt="article image" className="p-4 w-80vw"/>
        <h3 className="font-bold text-xl m-2">{article.title}</h3>
        <p>{article.author}</p>
        <h4 className="font-semibold text-green-kelp-700">Topic: {article.topic}</h4>
        <p>Posted on {article.created_at}</p>
        <p className="p-5 text-left">{article.body}</p>

        <p>
            <i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {article.votes}
        </p>
        <section className="comment-section border-2 p-2 border-shadow-green-400 rounded-sm m-1.5 ">
            <h4 className="font-bold text-green-kelp-600 text-xl p-2 bg-shadow-green-100 m-1">Comments</h4>
            { comments.map((comment)=>{
                return <Comment key={comment.comment_id} comment={comment}></Comment>
            })}
        </section>
    </section>
}