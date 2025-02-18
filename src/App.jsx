import { useState } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import { Route, Routes } from 'react-router'
import Article from './components/Article'
import Home from './components/Home'
import { UserAccountProvider } from './contexts/UserAccount'
import Topics from './components/Topics'
import Users from './components/Users'
import NavBar from './components/NavBar'
import NewArticle from './components/NewArticle'

function App() {


  return (
    <>
      <UserAccountProvider>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/articles" element={<ArticleList />}></Route>
          <Route path="/articles/add" element={<NewArticle />}></Route>
          <Route path="/articles/:article_id" element={<Article />}></Route>
          <Route path="/topics" element={<Topics />}></Route>
          <Route path="/topics/:topic" element={<ArticleList />}></Route>
          <Route path="/users/:username" element={<Users />}></Route>


        </Routes>
      </UserAccountProvider>

    </>
  )
}


export default App
