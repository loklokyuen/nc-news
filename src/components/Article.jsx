import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { deleteArticleById, getArticleById } from "../api";
import Loader from "./Loader";
import Voting from "./Voting";
import CommentList from "./CommentList";
import { UserAccount } from "../contexts/UserAccount";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import DeleteConfirmation from "./DeleteConfirmation";

export default function Article(){
    const { loggedInUser } = useContext(UserAccount);
    
    const [article, setArticle] = useState(null)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [confirmDeletion, setConfirmDeletion] = useState(false)

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

    function handleArticleDeleted(){
        setLoading(true)
        setIsError(false)
        setMessage('')
        deleteArticleById(articleId)
        .then((status)=>{
            if (status === 204){
                setMessage('Article deleted!')
                setLoading(false)
            }
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            setMessage('Something went wrong! Unable to delete article, please try again later.')
            setTimeout(()=> setMessage(''), 3000)
        })
    }

    if (loading) return <Loader/>;
    if (isError && !article) return <div className="not-found">{message}</div>
    if (message) return <section className={`m-2 font-semibold bg-mandys-pink-50/50 p-4 max-w-xl mx-auto ${isError? "text-feedback-error": "text-primary"}`}>
        {message}
        <section className="flex flex-row gap-1 m-2 items-center justify-center">
            <NavLink to="/articles/add">
                <button className="bg-mandys-pink-500">Post a new article</button>
            </NavLink>
            <NavLink to="/articles">
                <button>Browse articles</button>
            </NavLink>
        </section>
    </section>

    return <div className="flex justify-center items-center min-h-screen">
        <section className="max-w-4xl bg-surface text-neutral mt-2 justify-center flex flex-col self-center">
            <div className="flex flex-row justify-between items-start w-full relative">
                <h3 className="title">{article.title}</h3>
                { article.author === loggedInUser && 
                    <i className="fa-regular fa-circle-xmark text-mandys-pink-700 fa-xl justify-center absolute top-7 right-4" onClick={()=>{ setConfirmDeletion(true)}}></i>}
                <Dialog open={confirmDeletion} onClose={() => setConfirmDeletion(false)} className="fixed inset-0 z-10 flex items-center justify-center rounded-xl ">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                    <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full ">
                        <DeleteConfirmation setConfirmDeletion={setConfirmDeletion} onItemDeleted={handleArticleDeleted} itemType="article"/>
                    </DialogPanel>
                </Dialog>

            </div>
            <img src={article.article_img_url} alt="article image" className="p-4 w-80vw"/>

            <NavLink to={`/users/${article.author}`}>
                <h4 className="secondary-interactive">{article.author}</h4>
            </NavLink>
            <NavLink to={`/articles?topic=${article.topic}`}>
                <h4 className="tertiary-interactive">Topic: {article.topic[0].toUpperCase() + article.topic.substring(1)}</h4>
            </NavLink>
            <p>Posted on {article.created_at}</p>
            <p className="p-4 pt-2 text-left">{article.body}</p>

            <Voting votes={article.votes} itemType="article" id={articleId}></Voting>
            <CommentList articleId={articleId} commentCount={article.comment_count}></CommentList>
        </section>
    </div>
}