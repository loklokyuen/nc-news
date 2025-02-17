import { useEffect, useState } from "react";
import { getArticles } from "../api";
import ArticleItem from "./ArticleItem";

export default function ArticleList(){
    const [articles, setArticles] = useState([])
    const [totalNumberOfArticles, setTotalNumberOfArticles] = useState([])


    useEffect(()=>{
        getArticles()
        .then(({ articles, total_count})=>{
            setArticles(articles)
            setTotalNumberOfArticles(total_count)
        })
    }, []);

    return <>
        <h2>All Articles ({totalNumberOfArticles})</h2>
        <ul>
        { articles.map((article)=>{
            return <ArticleItem key={article.article_id} article={article}></ArticleItem>
        })}
        </ul>
    </>
}