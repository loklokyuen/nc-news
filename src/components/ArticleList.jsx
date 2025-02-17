import { useEffect, useState } from "react";
import { getArticles } from "../api";
import ArticleItem from "./ArticleItem";

export default function ArticleList(){
    const [articles, setArticles] = useState([])
    const [totalNumberOfArticles, setTotalNumberOfArticles] = useState([])


    useEffect(()=>{
        getArticles()
        .then((data)=>{
            setArticles(data.articles)
            setTotalNumberOfArticles(data.total_count)
        })
    }, []);

    return <>
        <h1>All Articles ({totalNumberOfArticles})</h1>
        <ul>
        { articles.map((article)=>{
            return <ArticleItem key={article.article_id} article={article}></ArticleItem>
        })}
        </ul>
    </>
}