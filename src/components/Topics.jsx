import { useEffect, useState } from "react";
import Topic from "./Topic";
import { getTopics } from "../api";

export default function Topics() {
    const [topics, setTopics] = useState([])

    useEffect(()=>{
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
        })
    }, [])
    return <section>
            <h2 className="font-extrabold text-2xl pt-4 text-shadow-green-600">Browse by Topic</h2>

            <ul>
                {topics.map((topic)=>{
                    return <Topic key={topic.slug} topic={topic}></Topic>
                })}
            </ul>
        </section>
    
}