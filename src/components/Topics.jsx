import { useEffect, useState } from "react";
import Topic from "./Topic";
import { getTopics } from "../api";
import Loader from "./Loader";

export default function Topics({ setActivePage }) {
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(()=>{
        setLoading(true)
        setActivePage('topics')
        setMessage('')
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
            setLoading(false)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch topics, please try again later.'
            setMessage(errorMessage)
        })
    }, [])
    if (loading) return <Loader />;
    if (isError) return <div className="not-found">{message}</div>
    
    return <section className="items-center justify-center flex flex-col ">
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Browse by Topic</h2>
            <ul className="w-full max-w-3xl">
                {topics.map((topic)=>{
                    return <Topic key={topic.slug} topic={topic}></Topic>
                })}
            </ul>
        </section>
    
}