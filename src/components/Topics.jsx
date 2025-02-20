import { useEffect, useState } from "react";
import Topic from "./Topic";
import { getTopics } from "../api";
import Loader from "./Loader";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import NewTopic from "./NewTopic";

export default function Topics({ setActivePage }) {
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState('')
    const [createNewTopic, setCreateNewTopic] = useState(false)

    useEffect(()=>{
        setLoading(true)
        setActivePage('topics')
        setMessage('')
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
            setLoading(false)
        })
        .catch((err)=>{
            setIsError(true)
            setLoading(false)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch topics, please try again later.'
            setMessage(errorMessage)
        })
    }, [])

    function handleTopicAdded(topic) {
        setTopics([...topics, topic])
    }

    function handleTopicCreation(){
        setCreateNewTopic(true)
    }
    if (loading) return <Loader />;
    if (isError) return <div className="not-found">{message}</div>
    
    return <section className="items-center justify-center flex flex-col ">
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Browse by Topic</h2>
            <div className="flex flex-col items-center my-1 w-full"> 
                <div className="flex flex-col items-center"> 
                    <span className="m-1 font-semibold text-highland-500">Want to start conversation on a new topic?</span>  
                    <button className="text-nowrap" onClick={handleTopicCreation} disabled={loading}>Create a new topic</button>
                </div>
                <Dialog open={createNewTopic} onClose={() => setCreateNewTopic(false)} className="fixed inset-0 z-10 flex items-center justify-center rounded-xl ">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
                    <DialogPanel className="relative bg-white rounded-lg shadow-xl max-w-md w-full ">
                        <NewTopic setCreateNewTopic={setCreateNewTopic} onTopicCreated={handleTopicAdded}/>
                    </DialogPanel>
                </Dialog>
            </div>
            
            <ul className="w-full max-w-3xl">
                {topics.map((topic)=>{
                    return <Topic key={topic.slug} topic={topic}></Topic>
                })}
            </ul>
        </section>
    
}