import { useContext, useEffect, useRef, useState } from "react";
import { UserAccount } from "../../contexts/UserAccount";
import { deleteCommentById } from "../../api";
import SmallLoader from "../Common/SmallLoader";
import Voting from "../Common/Voting";
import { NavLink } from "react-router";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import DeleteConfirmation from "../Common/DeleteConfirmation";

export default function Comment({ comment, onCommentDeleted }) {
    const formattedDate = new Date(comment.created_at).toLocaleString();
    const { loggedInUser } = useContext(UserAccount);
    const [message, setMessage] = useState(null)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmDeletion, setConfirmDeletion] = useState(false)
    const commentRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setLoaded(true);
                        observer.unobserve(entry.target);
                    } else {
                        setLoaded(false);
                    }
                });
            }, { threshold: 0.1 }
        );
        if (commentRef.current) {
            observer.observe(commentRef.current);
        }
        return () => {
            if (commentRef.current) {
                observer.unobserve(commentRef.current);
            }
        };
    }, []);
    function handleCommentDeleted(){
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

    return  <div ref={commentRef} className={`border-t w-full border-highland-500 mt-1 p-2 comment ${loaded ? 'loaded' : ''}`}>
            <div className="flex justify-between items-center">
                <NavLink to={`/users/${comment.author}`}>
                <span className="secondary-interactive text-left">{comment.author}</span>
                </NavLink>
                <span className="text-right text-neutral">Posted on {formattedDate}</span>
            </div>
            <div className="flex justify-between items-center">
            <p className="text-neutral text-left">{comment.body}</p>
            { comment.author === loggedInUser && <span className="text-right top-0 m-1">
                <i className="fa-regular fa-circle-xmark text-mandys-pink-700 fa-lg" onClick={(e)=>{setConfirmDeletion(true)}}></i></span>}
                <Dialog open={confirmDeletion} onClose={() => setConfirmDeletion(false)} className="fixed inset-0 z-10 flex items-center justify-center rounded-xl ">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                    <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full ">
                        <DeleteConfirmation setConfirmDeletion={setConfirmDeletion} onItemDeleted={handleCommentDeleted} itemType="comment"/>
                    </DialogPanel>
                </Dialog>
            </div>
            <Voting votes={comment.votes} itemType="comment" id={comment.comment_id}></Voting>
            { message && <div className={`message ${ isError? "text-feedback-error" : "text-feedback-success"}`}>{message}</div>}
    </div>
}