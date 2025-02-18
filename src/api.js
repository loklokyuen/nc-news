import axios from "axios";

const newsAPI = axios.create({
    baseURL: "https://news-and-discussion-platform.onrender.com/api",
})

export const getArticles = (sort_by, order, topic)=>{
    return newsAPI.get("/articles", {
        params: {
            sort_by,
            order,
            topic
        }
    })
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

export const getCommentsByArticleId = (article_id)=>{
    return newsAPI.get(`/articles/${article_id}/comments`)
    .then(({ data })=>{
        return data
    })
}

export const patchArticleVote = (article_id, voteChange)=>{
    return newsAPI.patch(`/articles/${article_id}`, {
        inc_votes: voteChange
    })
    .then(({ data })=>{
        return data
    })
}

export const postArticleComment = (article_id, username, body)=>{
    return newsAPI.post(`/articles/${article_id}/comments`, {
        username,
        body
    })
    .then(({ data })=>{
        return data
    })
}

export const deleteCommentById = (comment_id)=>{
    return newsAPI.delete(`/comments/${comment_id}`)
    .then(({ data })=>{
        return data
    })
}

export const getUserInfoByUsername = (username)=>{
    return newsAPI.get(`/users/${username}`)
    .then(({ data })=>{
        return data
    })
}

export const getTopics = ()=>{
    return newsAPI.get("/topics")
    .then(({ data })=>{
        return data
    })
}