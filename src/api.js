import axios from "axios";

const newsAPI = axios.create({
    baseURL: "https://news-and-discussion-platform.onrender.com/api",
})

export const getArticles = ()=>{
    return newsAPI.get("/articles")
    .then(({ data })=>{
        return data
    })
}

export const getArticleById = (article_id)=>{
    return newsAPI.get(`/articles/${article_id}`)
    .then(({ data })=>{
        return data
    })
}