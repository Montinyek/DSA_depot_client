import './App.css';
import React, { useState } from 'react'
import { Editor } from './Editor.js'
import { Home } from "./Home.js"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EditorContext } from './EditorContext'

function App() {
  const [admin, setAdmin] = useState(localStorage.getItem("admin") === "true" ? true : false)
  const [snippetDetails, setSnippetDetails] = useState(localStorage.getItem("openedSnippet") ? JSON.parse(localStorage.getItem("openedSnippet")) : "")
  const [snippetId, setSnippetId] = useState(localStorage.getItem("snippetId") ? localStorage.getItem("snippetId") : "")
  const [urls, setUrls] = useState(localStorage.getItem("URLS") ? JSON.parse(localStorage.getItem("URLS")) : "")
  const [page, setPage] = useState(localStorage.getItem("page") ? +localStorage.getItem("page") : 1)

  return (
    <div className="App">
      <EditorContext.Provider value={{ admin, setAdmin, snippetDetails, setSnippetDetails, snippetId, setSnippetId, urls, setUrls, page, setPage }}>
    <BrowserRouter>
    <Routes>
      <Route path="/editor" element={<Editor />}/>
      <Route path="/" element={<Home />}/>
    </Routes>
    </BrowserRouter>
    </EditorContext.Provider>
    </div>
  );
}

export default App;
