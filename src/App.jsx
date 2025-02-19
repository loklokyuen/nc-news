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
  const [currentPage, setCurrentPage] = useState('')
  return (
    <>
      <UserAccountProvider>
        <NavBar currentPage={currentPage}></NavBar>
        <Routes>
          <Route path="/" element={<Home setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="/articles" element={<ArticleList setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="/articles/add" element={<NewArticle setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="/articles/:article_id" element={<Article setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="/topics" element={<Topics setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="/users/:username" element={<Users setCurrentPage={setCurrentPage}/>}></Route>
          <Route path="*" element={<p className='not-found'>Page not found :/</p>}></Route>
        </Routes>
      </UserAccountProvider>
    </>
  )
}


export default App
