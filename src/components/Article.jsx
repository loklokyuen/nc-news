import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router";
import { getArticleById, getCommentsByArticleId, patchArticleVote } from "../api";
import Comment from "./Comment";
import NewComment from "./NewComment";
import Loader from "./Loader";
import Voting from "./Voting";
import CommentList from "./CommentList";

export default function Article(){
    const [article, setArticle] = useState(null)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    const params = useParams();
    const articleId = params.article_id;
    useEffect(()=>{
        setLoading(true)
        setIsError(false)
        setMessage('')
        getArticleById(articleId)
        .then(({ article })=>{
            const formattedDate = new Date(article.created_at).toLocaleString();
            article.created_at = formattedDate
            setArticle(article)
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch article, please try again later.'
            setMessage(errorMessage)
        })
    }, [articleId])



    if (loading) return <Loader/>;
    if (isError && !article) return <div className="not-found">{message}</div>

    return <div className="flex justify-center items-center min-h-screen">
        <section className="max-w-4xl bg-shadow-green-300 text-green-kelp-800 mt-2 justify-center items-center flex flex-col self-center">
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Article</h2>
            <img src={article.article_img_url} alt="article image" className="p-4 w-80vw"/>
            <h3 className="font-bold text-xl m-2">{article.title}</h3>
            <NavLink to={`/users/${article.author}`}>
                <h4 className="font-semibold text-green-kelp-600 hover:text-green-kelp-400">{article.author}</h4>
            </NavLink>
            <NavLink to={`/articles?topic=${article.topic}`}>
                <h4 className="font-semibold text-highland-600 hover:text-highland-400">Topic: {article.topic[0].toUpperCase() + article.topic.substring(1)}</h4>
            </NavLink>
            <p>Posted on {article.created_at}</p>
            <p className="p-4 pt-2 text-left">{article.body}</p>

            <Voting votes={article.votes} itemType="article" id={articleId}></Voting>
            <CommentList articleId={articleId} commentCount={article.comment_count}></CommentList>
        </section>
    </div>
}