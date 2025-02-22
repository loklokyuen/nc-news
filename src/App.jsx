import { useState } from 'react'
import './App.css'
import ArticleList from './components/Articles/ArticleList'
import { Route, Routes } from 'react-router'
import Article from './components/Articles/Article'
import Home from './components/Pages/Home'
import { UserAccountProvider } from './contexts/UserAccount'
import Topics from './components/Topics/Topics'
import Users from './components/Pages/Users'
import NavBar from './components/Layout/NavBar'
import NewArticle from './components/Articles/NewArticle'
import Footer from './components/Layout/Footer'

function App() {
  const [activePage, setActivePage] = useState('')
  return (
    <>
      <UserAccountProvider>
        <NavBar activePage={activePage}></NavBar>
        <Routes>
          <Route path="/" element={<Home setActivePage={setActivePage}/>}></Route>
          <Route path="/articles" element={<ArticleList setActivePage={setActivePage}/>}></Route>
          <Route path="/articles/add" element={<NewArticle setActivePage={setActivePage}/>}></Route>
          <Route path="/articles/:article_id" element={<Article setActivePage={setActivePage}/>}></Route>
          <Route path="/topics" element={<Topics setActivePage={setActivePage}/>}></Route>
          <Route path="/users/:username" element={<Users setActivePage={setActivePage}/>}></Route>
          <Route path="*" element={<p className='not-found'>Page not found :/</p>}></Route>
        </Routes>
        <Footer />
      </UserAccountProvider>
    </>
  )
}


export default App
