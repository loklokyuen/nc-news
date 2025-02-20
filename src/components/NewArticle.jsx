import { useContext, useEffect, useRef, useState } from "react"
import { getTopics, postArticle } from "../api"
import { UserAccount } from "../contexts/UserAccount";
import Loader from "./Loader";
import { NavLink } from "react-router";


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

    useEffect(()=>{
        setActivePage('new-article')
        setLoading(true)
        setIsError(false)
        setMessage('')
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
            setLoading(false)
            if (topics) setTopic(topics[0].slug)
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

    async function handleArticleSubmit(e){
        setNewArticleId('')
        e.preventDefault();
        if (title === '' || body === '' || topic === ''){
            setIsError(true)
            if ( title === '' ) setTitleErrorMessage("- Please enter a title.")
            if ( body === '' ) setBodyErrorMessage("- Please enter an article body.")
            if ( topic === '' ) setTopicErrorMessage("- Please choose from a topic.")
            setMessage("Please enter all the required fields before submitting.")
            if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (imageURL !== ''){
            try {
                const imageExists = await checkImageExist(imageURL)
                if (!imageExists){
                    setIsError(true)
                    setMessage("Please ensure your input is valid before submitting.")
                    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
                    return;
                }
            } catch (error) {
                setIsError(true)
                setMessage("Please ensure your input is valid before submitting.")
                if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
                return;
            }
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
            <h2 className="font-extrabold text-2xl p-4 text-shadow-green-600">Post an article</h2>
            { message && <div className={`message max-w-3xl ${ isError? "text-mandys-pink-500 text-start" : "text-shadow-green-500 text-center"}`}>
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
            <section className="items-center text-center text-highland-600 font-bold">
                <div className="flex flex-row items-center">
                    <label htmlFor="new-article-title" className="text-highland-600 font-bold p-1 m-1">Title: </label>
                    <input id="new-article-title" name="new-article-title" type="text" value={title} 
                    className="p-1 m-1 border-b-1 text-highland-600 w-full font-medium bg-shadow-green-200"
                    onChange={(e)=>{
                        setTitle(e.target.value); 
                        setTitleErrorMessage('');
                        if (title !== '' && body !== '' && topic !== '') setMessage('')
                    }}></input>
                </div>
                <div className="flex flex-row items-center justify-center flex-wrap w-full">
                    <div className="flex flex-row items-center my-1 w-full"> 
                        <label htmlFor="new-article-title" className="text-highland-600 font-bold p-1 m-1 text-nowrap">Topic:</label>
                        <select name="new-article-topic" id="new-article-topic" value={topic} 
                        onChange={(e)=>{setTopic(e.target.value); setTopicErrorMessage('')}} 
                            className="text-highland-600 bg-shadow-green-100 m-1 p-1.5 rounded-sm font-semibold">
                            { topics.map((topic)=>{
                                return <option key={topic.slug} value={topic.slug}>{topic.slug[0].toUpperCase() + topic.slug.slice(1)}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <label htmlFor="new-article_img_url" className="text-highland-600 font-bold p-1 m-1 text-nowrap">Article Image URL: </label>
                    <input id="new-article_img_url" name="new-article_img_url" type="text" value={imageURL} placeholder="(optional)"
                    className="p-1 m-1 border-b-1 text-highland-600"
                    onChange={(e)=>{setImageURL(e.target.value)}}></input>
                </div>
            </section>
            <textarea value={body} id="new-article-body" name="new-article-body"  rows={10}
            onChange={(e)=>{
                setBody(e.target.value); 
                setBodyErrorMessage('');
                if (title !== '' && body !== '' && topic !== '') setMessage('')
            }}
            className="resize-y border-2 border-shadow-green-500 rounded-md p-2 m-2 text-shadow-green-800 bg-shadow-green-100/70 w-9/10 max-w-3xl" 
            placeholder="Write your article here...">
            </textarea>
            <button onClick={handleArticleSubmit} disabled={loading}>Submit</button>
            
        </section>
    )
}