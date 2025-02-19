import { useEffect, useState } from "react"
import { getArticles, getTopics } from "../api"
import Loader from "./Loader"
import ArticleItem from "./ArticleItem"
import Topic from "./Topic"

export default function Home({ setActivePage }) {
    const [latestArticles, setLatestArticles] = useState([])
    const [topics, setTopics] = useState([])
    const [loadingArticles, setLoadingArticles] = useState(true)
    const [loadingTopics, setLoadingTopics] = useState(true)
    const [isError, setIsError] = useState(false)
    
    useEffect(()=>{
        setActivePage('home')
        setLoadingArticles(true)
        setLoadingTopics(true)
        setIsError(false)
        const limit = 2
        getArticles(null, null, null, null, limit)
        .then(({ articles })=>{
            setLatestArticles(articles)
            setLoadingArticles(false)
            return getTopics()
        })
        .then(({ topics })=>{
            setTopics(topics)
            setLoadingTopics(false)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
        })
    },[])
    return <section className="items-center justify-center flex mt-4 flex-col">
        <section className="banner items-center h-60 justify-center flex m-auto">
            <h1 className=" text-primary text-4xl bg-shadow-green-600/70 rounded-md p-8 font-stretch-80% font-light italic">Northcoders News</h1>
        </section>
        <section className="items-center justify-center flex flex-col">
            <h2 className="font-extrabold text-2xl pt-4 pb-2 text-shadow-green-600">Welcome to Northcoders News!</h2>
            <p className="text-green-kelp-600 max-w-3xl">Northcoders News is a social news aggregation, web content rating, and discussion website. Northcoders News allows users to post articles, comment on articles, and vote on articles and comments.</p>
        </section>
        <section className="items-center justify-center flex flex-col">
            <h2 className="font-bold text-2xl pt-4 text-shadow-green-600 italic">Check out the latest articles</h2>
            <ul className="w-full max-w-3xl">
                {latestArticles.map((article)=>{
                    return <ArticleItem key={article.article_id} article={article}></ArticleItem>
                })}
            </ul>
            {loadingArticles && <Loader key="articles-loader"/>}
            {isError && latestArticles.length === 0&& <div className="not-found">Something went wrong! Unable to fetch articles, please try again later.</div>}
        </section>
        <section className="items-start justify-center flex flex-col md:flex-row">
            <h2 className="font-bold text-2xl p-2 text-shadow-green-600 italic">Or choose from a topic</h2>
            { topics.map((topic)=>{
                return <Topic key={topic.slug} topic={topic}></Topic>
            })}
            {loadingTopics && <Loader key="topics-loader"/>}
            {isError && topics.length === 0 && <div className="not-found">Something went wrong! Unable to fetch topics, please try again later.</div>}
        </section>
    </section>
}