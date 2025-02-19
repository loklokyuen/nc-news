import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router";
import { getArticleById, getCommentsByArticleId, patchArticleVote } from "../api";
import Comment from "./Comment";
import NewComment from "./NewComment";
import Loader from "./Loader";
import Voting from "./Voting";

export default function Article(){
    const [article, setArticle] = useState(null)
    const [comments, setComments] = useState([])
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const commentRef = useRef(null)

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
            return getCommentsByArticleId(articleId)
        })
        .then(({ comments })=>{
            setComments(comments)
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch article, please try again later.'
            setMessage(errorMessage)
        })
    }, [articleId])

    function handleCommentPosted(comment){
        setComments(prevComments => [comment, ...prevComments])
        commentRef.current.scrollIntoView({ behavior: 'smooth' });
        setMessage('Comment posted!')
        setTimeout(()=>setMessage(''), 3000)

    }

    function handleCommentDeleted(commentId){
        setComments(prevComments => prevComments.filter((comment)=> comment.comment_id !== commentId))
        commentRef.current.scrollIntoView({ behavior: 'smooth' });
        setMessage('Comment deleted!')
        setTimeout(()=>setMessage(''), 3000)
    }

    if (loading) return <Loader/>;
    if (isError && !article) return <div className="not-found">{message}</div>

    return <div className="flex justify-center items-center min-h-screen">
        <section className="max-w-4xl bg-shadow-green-300 text-green-kelp-800 mt-2 justify-center items-center flex flex-col self-center">
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Article</h2>
            <img src={article.article_img_url} alt="article image" className="p-4 w-80vw"/>
            <h3 className="font-bold text-xl m-2">{article.title}</h3>
            <p>{article.author}</p>
            <NavLink to={`/articles?topic=${article.topic}`}>
                <h4 className="font-semibold text-highland-600 hover:text-highland-400">Topic: {article.topic[0].toUpperCase() + article.topic.substring(1)}</h4>
            </NavLink>
            <p>Posted on {article.created_at}</p>
            <p className="p-4 pt-2 text-left">{article.body}</p>

            <Voting votes={article.votes} itemType="article" id={articleId}></Voting>
            <section ref={commentRef} className="comment-section border-2 p-2 border-shadow-green-400 outline-shadow-green-200/90 outline-solid outline-4 rounded-sm max-w-3xl w-full px-2">
                <h4 className="font-bold text-green-kelp-600 text-xl p-2 bg-shadow-green-100/70 m-1">Comments</h4>
                { message && <div className={`message ${ isError? "text-mandys-pink-500" : "text-shadow-green-500"}`}>{message}</div>}
                { comments.map((comment)=>{
                    return <Comment key={comment.comment_id} comment={comment} onCommentDeleted={handleCommentDeleted}></Comment>
                })}
                <NewComment articleId={articleId} onCommentPosted={handleCommentPosted}></NewComment>
            </section>
        </section>
    </div>
}