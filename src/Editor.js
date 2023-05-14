import React, { useState, useContext, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { javascript } from '@codemirror/lang-javascript'
import { atomone } from '@uiw/codemirror-theme-atomone'
import { EditorContext } from './EditorContext'
import { EditModal } from './EditModal'
import './editor.css'

export const Editor = () => {
  const { admin } = useContext(EditorContext)
  const { urls } = useContext(EditorContext)
  const { snippetDetails, setSnippetDetails } = useContext(EditorContext)
  const { title, code, lang, tags } = snippetDetails
  const { snippetId, setSnippetId } = useContext(EditorContext)
  const [openEdit, setOpenEdit] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleTagInput(e) {
    if (e.key !== "Enter") return
    let val = e.target.value
    if (!val.trim()) return
    setSnippetDetails(prev => ({ ...prev, tags: [...prev.tags, val] }))
    e.target.value = ''
  }

  function removeTag(idx) {
    setSnippetDetails(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }))
  }

  useEffect(() => {
    if (saved && !snippetId) {
      Axios.post(`http://localhost:3001/${urls.newSnippet}`, {...snippetDetails, createdOn: newDate(), updatedOn: newDate() }).then(res => Axios.get("http://localhost:3001/latest").then(res => {setSnippetDetails(res.data); setSnippetId(res.data._id)} ))
    } else if (saved && snippetId) {
      Axios.put(`http://localhost:3001/${urls.updateSnippet}/${snippetId}`, {...snippetDetails, updatedOn: newDate() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  const saveSnippet = () => {
    setSaved(true)
    localStorage.setItem("openedSnippet", JSON.stringify(snippetDetails))
  }

  const newDate = () => new Date().toUTCString().slice(5, 16)

  return (
    <div>
      <CodeMirror
        value={code}
        height="550px"
        theme={atomone}
        extensions={[javascript({ jsx: true })]}
        onChange={(e) => setSnippetDetails(prev => ({ ...prev, code: e }))}
      />
      <div className="editor-buttons">
      {admin && <button onClick={() => { saveSnippet() }}>{saved ? <i onAnimationEnd={() => setSaved(false)} className={`fa fa-spinner ${saved ? "rotate" : ""}`} aria-hidden="true"></i> : "Save"}</button>}
      {admin && <button onClick={() => setOpenEdit(true)}>Edit</button>}
      <Link to="/"><button>Home</button></Link>
      </div>
      <EditModal open={openEdit} close={() => { setOpenEdit(false) }}>
        <input type="text" value={title} className="edit-modal-title" onChange={(e) => setSnippetDetails(prev => ({ ...prev, title: e.target.value }))} />
        <select value={lang} className="edit-modal-select" onChange={(e) => setSnippetDetails(prev => ({ ...prev, lang: e.target.value }))}>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>
        <div className="tags-container">
          {tags.map((tag, i) => (
            <div className="tag" key={i}>
            <span className="text">{tag}</span>
            <span className="remove-tag" onClick={() => removeTag(i)}>&times;</span>
          </div>
          ))}
          <input type="text" className="tags-input" placeholder="Add a tag" onKeyDown={handleTagInput}/>
        </div>
      </EditModal>
    </div>
  );
}

