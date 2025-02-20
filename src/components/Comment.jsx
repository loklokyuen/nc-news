import { useContext, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import { deleteCommentById } from "../api";
import SmallLoader from "./SmallLoader";
import Voting from "./Voting";
import { NavLink } from "react-router";

export default function Comment({ comment, onCommentDeleted }) {
    const formattedDate = new Date(comment.created_at).toLocaleString();
    const { loggedInUser } = useContext(UserAccount);
    const [message, setMessage] = useState(null)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)
    
    function deleteComment(){
        setLoading(true)
        setIsError(false)
        setMessage('')
        deleteCommentById(comment.comment_id)
        .then(()=>{
            setMessage('Comment deleted!')
            setTimeout(()=>setMessage(''), 3000)
            onCommentDeleted(comment.comment_id)
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            setMessage('Something went wrong! Unable to delete comment, please try again later.')
            setTimeout(()=> setMessage(''), 3000)
        })
    }
    if ( loading ) 
        return <div className="border-t w-full border-highland-500 mt-1">
            <SmallLoader/>
        </div>

    return  <div className="border-t w-full border-highland-500 mt-1 p-2">
            <div className="flex justify-between items-center">
                <NavLink to={`/users/${comment.author}`}>
                <span className="font-semibold text-green-kelp-500 hover:text-green-kelp-400 text-left">{comment.author}</span>
                </NavLink>
                <span className="text-right text-green-kelp-800">Posted on {formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
            <p className="text-green-kelp-800 text-left bg-shadow-green-300">{comment.body}</p>
            { comment.author === loggedInUser && <span className="text-right top-0 m-1">
                <i className="fa-regular fa-circle-xmark text-mandys-pink-700 fa-lg" onClick={deleteComment}></i></span>}
            </div>
            <Voting votes={comment.votes} itemType="comment" id={comment.comment_id}></Voting>
            { message && <div className={`message ${ isError? "text-mandys-pink-500" : "text-shadow-green-500"}`}>{message}</div>}
    </div>
}