import { useEffect, useState } from "react"
import { getTopics } from "../api"
import { useNavigate } from "react-router"

export default function SortFilterBar({ topic, sort_by, order, setSearchParams, setCurrentPage }) {
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
                <label htmlFor="sort_by" className="text-highland-600 font-bold">Sort By:</label>
                <select name="sort_by" id="sort_by" value={sort_by} onChange={(e)=>{ updateSearchParams("sort_by", e.target.value); setCurrentPage(1)}} 
                className="text-highland-600 bg-shadow-green-100 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="created_at">Date Created</option>
                    <option value="votes">Votes</option>
                    <option value="comment_count">Comments</option>
                </select>
                <select name="order" id="order" value={order} onChange={(e)=>{ updateSearchParams("order", e.target.value); setCurrentPage(1)}} 
                className="text-highland-600 bg-shadow-green-100 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <div className="flex flex-row items-center">
                <label htmlFor="currentTopic" className="text-highland-600 font-bold">Filter By Topic:</label>
                <select name="currentTopic" id="currentTopic" value={topic || "all"} 
                onChange={(e)=>{updateSearchParams("topic", e.target.value); setCurrentPage(1)}} 
                 className="text-highland-600 bg-shadow-green-100 m-1 p-1.5 rounded-sm font-semibold">
                    <option value="all">All</option>
                    { topics.map((topic)=>{
                        return <option key={topic.slug} value={topic.slug}>{topic.slug[0].toUpperCase() + topic.slug.slice(1)}</option>
                    })}
                </select>
            </div>
        </div>
    </section>
}