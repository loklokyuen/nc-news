import { useState } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import { Route, Routes } from 'react-router'

function App() {

  return (
    <>
      <Routes>
        <Route path="/articles" element={<ArticleList />}></Route>
      </Routes>
    </>
  )
}


export default App
