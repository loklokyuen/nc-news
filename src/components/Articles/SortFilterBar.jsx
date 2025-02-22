import { useEffect, useState } from "react"
import { getTopics } from "../../api"

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
            <div className="flex flex-row items-center ">
                <label htmlFor="sort-by" className="text-tertiary font-bold">Sort By:</label>
                <select name="sort-by" id="sort-by" value={sort_by || ""} onChange={(e)=>{ updateSearchParams("sort_by", e.target.value)}} 
                className="text-tertiary bg-surface m-1 p-1.5 rounded-xl font-semibold">
                    <option value="created_at">{ order === 'asc'? "Oldest" : "Newest" }</option>
                    <option value="votes">{ order === 'asc'? "Least" : "Most" } Popular</option>
                    <option value="comment_count">Comments</option>
                </select>
                <div
                onClick={() => updateSearchParams("order", order === "asc" ? "desc" : "asc")}
                className={` p-2 font-semibold flex items-center gap-1 h-6.5 w-6.5 justify-center text-center
                hover:text-shadow-green-500 hover:bg-shadow-green-50 rounded-xl text-shadow-green-500 bg-surface hover:border-shadow-green-500 hover:border-2`}
                >
                {order === "asc" ? <i class="fa-solid fa-sort-up fa-lg"></i> : <i className="fa-solid fa-sort-down fa-lg"></i>}
                </div>
            </div>
            <div className="flex flex-row items-center">
                <label htmlFor="current-topic" className="text-tertiary font-bold">Filter By Topic:</label>
                <select name="current-topic" id="current-topic" value={topic || "all"} 
                onChange={(e)=>{updateSearchParams("topic", e.target.value)}} 
                 className="text-tertiary bg-surface m-1 p-1.5 rounded-xl font-semibold">
                    <option value="all">All</option>
                    { topics.map((topic)=>{
                        return <option key={topic.slug} value={topic.slug}>{topic.slug[0].toUpperCase() + topic.slug.slice(1)}</option>
                    })}
                </select>
            </div>
        </div>
    </section>
}