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

    function handleSortChange(sort_by, order) {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            if (sort_by) newParams.set("sort_by", sort_by);
            if (order) newParams.set("order", order);
            return newParams;
        });
    }
    
    return <section>
        <div className="flex sm:flex-col md:flex-row justify-around mt-2 items-stretch flex-wrap">
            <div className="flex flex-row items-center ">
                <label htmlFor="sort-by" className="text-tertiary font-bold">Sort By:</label>
                <select name="sort-by" id="sort-by" value={`${sort_by || ""}|${order || ""}`} onChange={(e)=>{ 
                    const [newSort, newOrder] = e.target.value.split("|");
                    handleSortChange(newSort, newOrder);
                }} 
                className="text-tertiary bg-surface m-1 p-1.5 rounded-xl font-semibold">
                    <option value="created_at|desc">Most Recent</option>
                    <option value="votes|desc">Most Popular</option>
                    <option value="comment_count|desc">Most Discussed</option>
                    <option value="created_at|asc">Oldest</option>
                    <option value="votes|asc">Least Popular</option>
                    <option value="comment_count|asc">Least Discussed</option>

                </select>
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