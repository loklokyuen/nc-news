import { useState } from "react";
import { postTopic } from "../../api";
import SmallLoader from "../Common/SmallLoader";


export default function NewTopic({ setCreateNewTopic, onTopicCreated }){
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    function handleTopicSubmit(e){
        e.preventDefault();
        if (slug === '' ){
            setErrorMessage("Please enter a slug for the new topic.")
            return;
        }
        setSuccessMessage('')
        setErrorMessage('')
        setLoading(true)
        postTopic(slug, description)
        .then(({ insertedTopic })=>{
            onTopicCreated(insertedTopic)
            setLoading(false)
            setSuccessMessage(`Topic successfully added!`)
            setTimeout(()=>{
                setCreateNewTopic(false)
                setSuccessMessage('')
            }, 3000)
        })
        .catch((err)=>{
            setLoading(false)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to add new topic, please try again later.'
            setErrorMessage(errorMessage)
            setTimeout(()=>setErrorMessage(''), 3000)
        })
    }
    if (loading) return <SmallLoader />
    if (successMessage) return <section className="p-4 m-2 text-highland-500">{successMessage}</section>
    return <section className="flex flex-col items-center rounded-2xl  bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h2 className="title">Create a new topic</h2>
        <div className="flex flex-row items-center">
            <label htmlFor="new-topic-slug" className="text-tertiary font-bold p-1 m-1">Slug: </label>
            <input id="new-topic-slug" name="new-topic-slug" type="text" value={slug} 
            className="p-1 m-1 border-b-1 text-tertiary "
            onChange={(e)=>{setSlug(e.target.value); setErrorMessage('')}}></input>
        </div>

        <div className="flex flex-row items-center">
            <label htmlFor="new-topic-description" className="text-tertiary font-bold p-1 m-1">Description: </label>
            <input id="new-topic-description" name="new-topic-description" type="text" value={description} 
            className="p-1 m-1 border-b-1 text-tertiary " placeholder="(optional)"
            onChange={(e)=>{setDescription(e.target.value);}}></input>
        </div>
        <div className="mt-4">
            <button className="mx-1" onClick={() => setCreateNewTopic(false)}>Cancel</button>
            <button onClick={handleTopicSubmit} disabled={loading}>Submit</button>
        </div>
        { errorMessage && <div className={`message max-w-3xl text-feedback-error `}>
            <ul className="flex flex-col p-4 items-start text-start">
                <li>{errorMessage}</li>
            </ul>
        </div>}
    </section>
}