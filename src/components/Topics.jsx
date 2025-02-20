import { useEffect, useState } from "react";
import Topic from "./Topic";
import { getTopics } from "../api";

export default function Topics({ setActivePage }) {
    setActivePage('topics')
    const [topics, setTopics] = useState([])

    useEffect(()=>{
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
        })
    }, [])
    return <section className="items-center justify-center flex flex-col ">
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Browse by Topic</h2>
            <ul className="w-full max-w-3xl">
                {topics.map((topic)=>{
                    return <Topic key={topic.slug} topic={topic}></Topic>
                })}
            </ul>
        </section>
    
}