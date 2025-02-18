import { useContext, useState } from "react"
import { postArticleComment } from "../api"
import { UserAccount } from "../contexts/UserAccount";

export default function NewComment({ articleId, onCommentPosted}) {
    const [comment, setComment] = useState('')
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const { loggedInUser } = useContext(UserAccount);
    
    function handleCommentSubmit(e){
        e.preventDefault()
        setLoading(true)
        setMessage('')
        postArticleComment(articleId, loggedInUser, comment)
        .then(()=>{
            setLoading(false)
            setComment('')
            setMessage('Comment posted!')
            onCommentPosted({author: loggedInUser, body: comment, created_at: new Date().toISOString(), votes: 0})
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            setMessage('Something went wrong! Unable to comment, please try again later.')
        })

    }
    return <><section className="flex flex-row items-center border-t border-highland-500 ">
        <textarea value={comment} id="new-comment" name="new-comment" onChange={(e)=>setComment(e.target.value)}
        className="resize-y border-2 border-shadow-green-500 rounded-md p-2 m-2 w-full" 
        placeholder="Write your comment here...">
        </textarea>
        <button className="" onClick={handleCommentSubmit}>Submit</button>
    </section>
        { loading && <div className="flex flex-col self-center items-center justify-center">
            <div className="small-loader"></div>
        </div>}
        { message && <div className={`w-full m-1 ${ isError? "text-roman-700" : "border-shadow-green-500"}`}>{message}</div>}
    </>
}