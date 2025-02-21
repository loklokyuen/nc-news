import { useEffect, useState } from "react"
import { getTopics } from "../api"

export default function SortFilterBar({ topic, sort_by, order, setSearchParams }) {
    const [topics, setTopics] = useState([])

    useEffect(()=>{
        getTopics()
        .then(({ topics })=>{
            setTopics(topics)
        })
    }, [])

    const updateSearchParams = (key, value) => {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (value && value !== "all") {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
          return newParams;
        });
      };
    
    return <section>
        <div className="flex sm:flex-col md:flex-row justify-around mt-2 items-stretch flex-wrap">
            <div className="flex flex-row items-center">
                <label htmlFor="sort-by" className="text-tertiary font-bold">Sort By:</label>
                <select name="sort-by" id="sort-by" value={sort_by || ""} onChange={(e)=>{ updateSearchParams("sort_by", e.target.value)}} 
                className="text-tertiary bg-surface/50 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="created_at">Date Created</option>
                    <option value="votes">Votes</option>
                    <option value="comment_count">Comments</option>
                </select>
                <select name="order" id="order" value={order || ""} onChange={(e)=>{ updateSearchParams("order", e.target.value)}} 
                className="text-tertiary bg-surface/50 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <div className="flex flex-row items-center">
                <label htmlFor="current-topic" className="text-tertiary font-bold">Filter By Topic:</label>
                <select name="current-topic" id="current-topic" value={topic || "all"} 
                onChange={(e)=>{updateSearchParams("topic", e.target.value)}} 
                 className="text-tertiary bg-surface/50 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="all">All</option>
                    { topics.map((topic)=>{
                        return <option key={topic.slug} value={topic.slug}>{topic.slug[0].toUpperCase() + topic.slug.slice(1)}</option>
                    })}
                </select>
            </div>
        </div>
    </section>
}