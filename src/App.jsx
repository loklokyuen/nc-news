import { useState } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import { Route, Routes } from 'react-router'
import Article from './components/Article'

function App() {

  return (
    <>
      <Routes>
        <Route path="/articles" element={<ArticleList />}></Route>
        <Route path="/articles/:article_id" element={<Article />}></Route>
      </Routes>
    </>
  )
}


export default App
