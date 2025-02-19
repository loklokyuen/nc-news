import { useCallback, useEffect, useState } from "react";
import { getArticles } from "../api";
import ArticleItem from "./ArticleItem";
import { useNavigate, useParams, useSearchParams } from "react-router";
import SortFilterBar from "./SortFilterBar";
import Loader from "./Loader";

export default function ArticleList(){
    const [articles, setArticles] = useState([])
    const [totalNumberOfArticles, setTotalNumberOfArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState('')

    const [searchParams, setSearchParams] = useSearchParams();
    const topic = searchParams.get("topic");
    const sort_by = searchParams.get("sort_by");
    const order = searchParams.get("order");

    useEffect(()=>{
        setLoading(true)
        setIsError(false)
        setMessage('')
        getArticles(sort_by, order, topic)
        .then(({ articles, total_count})=>{
            setArticles(articles)
            setTotalNumberOfArticles(total_count)
            setLoading(false)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch articles, please try again later.'
            setMessage(errorMessage)
        })
    }, [sort_by, order, topic]);

    if (loading) return <Loader />;
    if (isError) return <div className="not-found">{message}</div>

    return <div>
        <h2 className="font-bold text-2xl pt-4 text-shadow-green-600">{topic? topic[0].toUpperCase() + topic.slice(1): "All Articles"} ({totalNumberOfArticles})</h2>
        <SortFilterBar topic={topic} sort_by={sort_by} order={order} setSearchParams={setSearchParams}></SortFilterBar>
        <ul className="items-center flex flex-col flex-wrap justify-center md:flex-row md:grid-cols-3 md:items-stretch md:gap-x-4">
        { articles.map((article)=>{
            return <ArticleItem key={article.article_id} article={article}></ArticleItem>
        })}
        </ul>
    </div>
}