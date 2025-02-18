import { useContext, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import { deleteCommentById } from "../api";
import SmallLoader from "./SmallLoader";

export default function Comment({ comment, onCommentDeleted }) {
    const formattedDate = new Date(comment.created_at).toLocaleString();
    const { loggedInUser } = useContext(UserAccount);
    const [message, setMessage] = useState(null)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)
    

    function deleteComment(){
        setLoading(true)
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

    return  <div className="border-t w-full border-highland-500 mt-1">

        <div>
            <p className="font-semibold text-green-kelp-500 text-left">{comment.author}
            </p>
            <div className="flex justify-between items-center">
            <p className="text-green-kelp-800 text-left bg-shadow-green-300">{comment.body}</p>
            { comment.author === loggedInUser && <span className="text-right top-0 m-1">
                <i className="fa-regular fa-circle-xmark text-mandys-pink-700 fa-lg" onClick={deleteComment}></i></span>}
            </div>
            <p className="text-right">Posted on {formattedDate}</p>
            <p className="text-left">
                <i className="fa-regular fa-thumbs-up"></i> <i className="fa-regular fa-thumbs-down"></i> {comment.votes}
            </p>
            { message && <div className={`bg-shadow-green-200/90 w-full m-1 ${ isError? "text-roman-600" : "border-shadow-green-500"}`}>{message}</div>}
        </div>
        
        
    </div>
}