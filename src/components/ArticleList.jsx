import { useEffect, useState } from "react";
import { getArticles } from "../api";
import ArticleItem from "./ArticleItem";
import { useParams } from "react-router";

export default function ArticleList(){
    const [articles, setArticles] = useState([])
    const [totalNumberOfArticles, setTotalNumberOfArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const params = useParams();
    const topic = params.topic;

    useEffect(()=>{
        setLoading(true)
        getArticles(topic)
        .then(({ articles, total_count})=>{
            setArticles(articles)
            setTotalNumberOfArticles(total_count)
            setLoading(false)
        })
    }, [topic]);
    if (loading) return <div className="flex flex-col self-center items-center justify-center h-screen">
        <div className="loader"></div>
    </div>;
    return <div>
        <h2 className="font-bold text-2xl pt-4 text-shadow-green-600">{topic? topic[0].toUpperCase() + topic.slice(1): "All Articles"} ({totalNumberOfArticles})</h2>
        <ul className="items-center flex flex-col flex-wrap justify-center md:flex-row md:grid-cols-3 md:items-stretch md:gap-x-4">
        { articles.map((article)=>{
            return <ArticleItem key={article.article_id} article={article}></ArticleItem>
        })}
        </ul>
    </div>
}