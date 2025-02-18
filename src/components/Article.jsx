import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getArticleById, getCommentsByArticleId, patchArticleVote } from "../api";
import Comment from "./Comment";
import NewComment from "./NewComment";

export default function Article(){
    const [article, setArticle] = useState({})
    const [comments, setComments] = useState([])
    const [currUpvote, setCurrUpvote] = useState(0)
    const [currDownvote, setCurrDownvote] = useState(0)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)

    const params = useParams();
    const articleId = params.article_id;
    useEffect(()=>{
        setLoading(true)
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
    }, [articleId])

    function handleUpvote(){
        let vote = currUpvote === 1 ? -1 : 1;
        if (currDownvote === 1) vote += 1;
        setCurrUpvote(prevUpvote => prevUpvote === 1 ? 0 : 1);
        setCurrDownvote(0)
        patchArticleVote(articleId, vote)
        .catch((err)=>{   
            setIsError(true)
            setCurrUpvote(prevUpvote => prevUpvote === 1 ? 0 : 1)
        })
    }

    function handleDownvote(){
        let vote = currDownvote === 1 ? 1 : -1;
        if (currUpvote === 1) vote -= 1;
        setCurrDownvote(prevDownvote => prevDownvote === 1 ? 0 : 1);
        setCurrUpvote(0)
        patchArticleVote(articleId, vote)
        .catch((err)=>{   
            setIsError(true)
            setCurrDownvote(prevDownvote => prevDownvote === 1 ? 0 : 1)
        })
    }

    function handleCommentPosted(comment){
        setComments(prevComments => [comment, ...prevComments])
    }

    if (loading) return <div className="flex flex-col self-center items-center justify-center h-screen">
        <div className="loader"></div>
    </div>;

    return <section className="w-80vw bg-shadow-green-300 text-green-kelp-800 mt-2">
        <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Article</h2>
        <img src={article.article_img_url} alt="article image" className="p-4 w-80vw"/>
        <h3 className="font-bold text-xl m-2">{article.title}</h3>
        <p>{article.author}</p>
        <h4 className="font-semibold text-green-kelp-700">Topic: {article.topic}</h4>
        <p>Posted on {article.created_at}</p>
        <p className="p-5 text-left">{article.body}</p>

        <p>
            {currUpvote === 1 ?
            <i className="fa-solid fa-thumbs-up fa-xl m-1 text-highland-500" onClick={handleUpvote}></i> : 
            <i className="fa-regular fa-thumbs-up fa-xl m-1 text-highland-500" onClick={handleUpvote}></i>}
            {currDownvote === 1 ? 
            <i className="fa-solid fa-thumbs-down fa-xl m-1 text-mandys-pink-700" onClick={handleDownvote}></i>:
            <i className="fa-regular fa-thumbs-down fa-xl m-1 text-mandys-pink-700" onClick={handleDownvote}></i>}
            <span className={`text-xl font-extrabold ${article.votes > 0 ? "text-highland-500":"text-mandys-pink-700"}`}>{article.votes + currUpvote - currDownvote}</span>
            { isError && <><br /><span className="text-roman-700">Something went wrong! Unable to vote, please try again later.</span></>}
        </p>
        <section className="comment-section border-2 p-2 border-shadow-green-400 rounded-sm m-1.5">
            <h4 className="font-bold text-green-kelp-600 text-xl p-2 bg-shadow-green-100 m-1">Comments</h4>
            { comments.map((comment)=>{
                return <Comment key={comment.comment_id} comment={comment}></Comment>
            })}
            <NewComment articleId={articleId} onCommentPosted={handleCommentPosted}></NewComment>
        </section>
    </section>
}