import { useEffect, useRef, useState } from "react"
import Loader from "../Common/Loader"
import NewComment from "./NewComment"
import { getCommentsByArticleId } from "../../api"
import Comment from "./Comment"
import Pagination from "../Common/Pagination"

export default function CommentList({ articleId, commentCount }){
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const commentRef = useRef(null)

    useEffect(()=>{
        setIsLoading(true)
        setIsError(false)
        setMessage('')
        setTotalPages(Math.ceil(commentCount/10))
        getCommentsByArticleId(articleId, currentPage)
        .then(({ comments })=>{
            setComments(comments)
            setIsLoading(false)
            if (comments.length === 0) {
                setMessage('No comment yet');
            }
        })
        .catch((err)=>{
            setIsLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch comments, please try again later.'
            setMessage(errorMessage)
        })
    }, [articleId, currentPage]) 
    
    function handlePageChange(page){
        setCurrentPage(page)
        setTimeout(()=>{
            if (commentRef.current) {
                commentRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0)
    }

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

    return <section ref={commentRef} className="comment-section border-2 p-2 border-primary-light outline-surface/90 outline-solid outline-4 rounded-sm max-w-4xl w-full px-2">
        <h4 className="font-bold text-green-kelp-600 text-xl p-2 bg-bg/50 m-1">Comments</h4>
        { isLoading && <Loader/>}
        { message && <div className={`message ${ isError? "text-feedback-error" : "text-feedback-success"}`}>{message}</div>}
        { comments.map((comment)=>{
            return <Comment key={comment.comment_id} comment={comment} onCommentDeleted={handleCommentDeleted}></Comment>
        })}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChanged={handlePageChange}></Pagination>
        <NewComment articleId={articleId} onCommentPosted={handleCommentPosted}></NewComment>
    </section>
}