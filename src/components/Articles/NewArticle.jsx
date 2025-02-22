import { useContext, useEffect, useRef, useState } from "react"
import { getTopics, postArticle } from "../../api"
import { UserAccount } from "../../contexts/UserAccount";
import Loader from "../Common/Loader";
import { NavLink } from "react-router";
import NewTopic from "../Topics/NewTopic";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function NewArticle({ setActivePage }) {
    const { loggedInUser } = useContext(UserAccount);
    const topRef = useRef(null)
    
    const [title, setTitle] = useState('')
    const [topic, setTopic] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [body, setBody] = useState('')
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState('')
    const [titleErrorMessage, setTitleErrorMessage] = useState('')
    const [bodyErrorMessage, setBodyErrorMessage] = useState('')
    const [topicErrorMessage, setTopicErrorMessage] = useState('')
    const [imageErrorMessage, setImageErrorMessage] = useState('')
    const [newArticleId, setNewArticleId] = useState(null)
    const [createNewTopic, setCreateNewTopic] = useState(false)

    useEffect(()=>{
        setActivePage('new-article')
        setLoading(true)
        setIsError(false)
        setMessage('')
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
            setLoading(false)
            if (topics.length > 0) setTopic(topics[0].slug)
        })
        .catch((err)=>{
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch topics, please try again later.'
            setMessage(errorMessage)
            setTimeout(()=>setMessage(''), 3000)
        })
    }, [])

    function checkImageExist(url) {
        return new Promise((resolve, reject)=>{
            var image = new Image();
            image.onload = function() {
              if (this.width > 0) {
                resolve(true)
              } else {
                setIsError(true)
                setImageErrorMessage("- Please enter a valid image URL.")
                reject(false)
              }
            }
            image.onerror = function() {
                setIsError(true)
                setImageErrorMessage("- Please enter a valid image URL.")
                reject(false)
            }
            image.src = url;
        })
    }

    function handleTopicAdded(topic) {
        setTopics([...topics, topic])
    }
    
    function handleTopicCreation(){
        setCreateNewTopic(true)
    }

    async function handleArticleSubmit(e){
        setNewArticleId('')
        e.preventDefault();
        let hasError = false;
        if (title === '' || body === '' || topic === ''){
            setIsError(true)
            if ( title === '' ) setTitleErrorMessage("- Please enter a title.")
            if ( body === '' ) setBodyErrorMessage("- Please enter an article body.")
            if ( topic === '' ) setTopicErrorMessage("- Please choose from a topic.")
            setMessage("Please enter all the required fields before submitting.")
            hasError = true;
        }
        if (imageURL !== ''){
            try {
                const imageExists = await checkImageExist(imageURL)
                if (!imageExists){
                    setIsError(true)
                    if (hasError) setMessage("Please enter all the required fields and ensure your input is valid before submitting.")
                    else setMessage("Please ensure your input is valid before submitting.")
                    hasError = true;
                }
            } catch (error) {
                setIsError(true)
                if (hasError) setMessage("Please enter all the required fields and ensure your input is valid before submitting.")
                    else setMessage("Please ensure your input is valid before submitting.")
                hasError = true;
            }
        }
        if (hasError) {
            if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        setMessage('')
        setImageErrorMessage('')
        setLoading(true)
        postArticle(loggedInUser, title, body, topic, imageURL)
        .then(({ insertedArticle })=>{
            setMessage(`Your article is successfully posted!`)
            if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
            setLoading(false)
            setIsError(false)
            setTitle('')
            setImageURL('')
            setBody('')
            setNewArticleId(insertedArticle.article_id)
            setTimeout(()=>setMessage(''), 10000)
        })
        .catch((err)=>{
            setIsError(true)
            setLoading(false)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to post article, please try again later.'
            setMessage(errorMessage)
            if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
            setTimeout(()=>setMessage(''), 10000)
        })
    }

    if (loading) return <Loader />
    return (
        <section ref={topRef} className="flex flex-col items-center border-t border-highland-500">
            <h2 className="title">Post an article</h2>
            { message && <div className={`message max-w-3xl ${ isError? "text-feedback-error text-start" : "text-feedback-success text-center"}`}>
                <ul className="flex flex-col p-4 items-start">
                <li >{message}</li>
                <li >{titleErrorMessage}</li>
                <li >{bodyErrorMessage}</li>
                <li >{imageErrorMessage}</li>
                <li >{topicErrorMessage}</li>
                </ul>
                {newArticleId? <NavLink to={`/articles/${newArticleId}`}>
                    <button  className="mb-2 p-1">Go to your new article</button>
                </NavLink>: null}
            </div>}
            <section className="items-center text-center text-tertiary font-bold">
                <div className="flex flex-row items-center">
                    <label htmlFor="new-article-title" className="text-tertiary font-bold p-1 m-1">Title: </label>
                    <input id="new-article-title" name="new-article-title" type="text" value={title} 
                    className={`p-1 m-1 border-b-1 text-tertiary w-full font-medium ${ titleErrorMessage ? "error-input": null}`}
                    onChange={(e)=>{
                        setTitle(e.target.value); 
                        setTitleErrorMessage('');
                        if (title !== '' && body !== '' && topic !== '') setMessage('')
                    }}></input>
                </div>
                <div className="flex flex-row items-center justify-center flex-wrap w-full">
                    <div className="flex flex-row items-center my-1 w-full"> 
                        <label htmlFor="new-article-topic" className="text-tertiary font-bold p-1 m-1 text-nowrap">Topic:</label>
                        <select name="new-article-topic" id="new-article-topic" value={topic} 
                        onChange={(e)=>{setTopic(e.target.value); setTopicErrorMessage('')}} 
                            className="text-tertiary bg-surface m-1 p-1.5 rounded-sm font-semibold">
                            { topics.map((topic)=>{
                                return <option key={topic.slug} value={topic.slug}>{topic.slug[0].toUpperCase() + topic.slug.slice(1)}</option>
                            })}
                        </select>
                        <div className="flex flex-row items-center"> 
                            <span className="m-1">or</span>  
                            <button className="text-nowrap" onClick={handleTopicCreation} disabled={loading}>Create a new topic</button>
                        </div>
                        <Dialog open={createNewTopic} onClose={() => setCreateNewTopic(false)} className="fixed inset-0 z-10 flex items-center justify-center rounded-xl ">
                            <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                            <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full ">
                                <NewTopic setCreateNewTopic={setCreateNewTopic} onTopicCreated={handleTopicAdded}/>
                            </DialogPanel>
                        </Dialog>
                    </div>
                    
                </div>
                <div className="flex flex-row items-center">
                    <label htmlFor="new-article_img_url" className="text-tertiary font-bold p-1 m-1 text-nowrap">Article Image URL: </label>
                    <input id="new-article_img_url" name="new-article_img_url" type="text" value={imageURL} placeholder="(optional)"
                    className={`p-1 m-1 border-b-1 text-tertiary ${ imageErrorMessage ? "error-input": null}`}
                    onChange={(e)=>{setImageURL(e.target.value); setImageErrorMessage('')}}></input>
                </div>
            </section>
            <div className="flex flex-col items-center my-1 w-full"> 
                <label htmlFor="new-article-body" className="text-tertiary font-bold p-1 m-2 text-left">Article Body: </label>
                <textarea value={body} id="new-article-body" name="new-article-body" rows={10}
                onChange={(e)=>{
                    setBody(e.target.value); 
                    setBodyErrorMessage('');
                    if (title !== '' && body !== '' && topic !== '') setMessage('')
                }}
                className={`resize-y border-2 border-feedback-success rounded-md p-2 m-2 text-shadow-green-800 bg-surface w-9/10 max-w-xl ${ bodyErrorMessage ? "error-input": null}`}
                placeholder="Write your article here...">
                </textarea>
            </div>
            <button onClick={handleArticleSubmit} disabled={loading}>Submit</button>
            
        </section>
    )
}