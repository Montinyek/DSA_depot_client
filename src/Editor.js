import React, { useState, useContext, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { javascript } from '@codemirror/lang-javascript'
import { sublime } from '@uiw/codemirror-theme-sublime';
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
  const [editorHeight, setEditorHeight] = useState("750px")

  const newDate = () => new Date().toUTCString().slice(5, 16)

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
      Axios.post(`https://dsadepotserver-production.up.railway.app/${urls.newSnippet}`, {...snippetDetails, createdOn: newDate(), updatedOn: newDate() }).then(res => Axios.get("https://dsadepotserver-production.up.railway.app/latest").then(res => {setSnippetDetails(res.data); setSnippetId(res.data._id)} ))
    } else if (saved && snippetId) {
      Axios.put(`https://dsadepotserver-production.up.railway.app/${urls.updateSnippet}/${snippetId}`, {...snippetDetails, updatedOn: newDate() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  const saveSnippet = () => {
    setSaved(true)
    localStorage.setItem("openedSnippet", JSON.stringify(snippetDetails))
  }

  React.useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      if (window.innerHeight > 700) {
        setEditorHeight("750px")
      } else {
        setEditorHeight("550px")
      }
    }, 500)

    window.addEventListener("resize", debouncedHandleResize);

    return () => { // cleaning up
      window.removeEventListener("resize", debouncedHandleResize);
    }
  }, [])

  return (
    <div>
      <CodeMirror
        value={code.trim()}
        height={editorHeight}
        theme={sublime}
        extensions={[javascript({ jsx: true })]}
        onChange={(e) => setSnippetDetails(prev => ({ ...prev, code: e }))}
      />
      <div className="editor-buttons">
      {admin && <button onClick={() => setOpenEdit(true)}>Edit</button>}
      <Link to="/"><button>Home</button></Link>
      {admin && <button onClick={() => { saveSnippet() }}>{saved ? <i onAnimationEnd={() => setSaved(false)} className={`fa fa-spinner ${saved ? "spin-save" : ""}`} aria-hidden="true"></i> : "Save"}</button>}
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

function debounce(fn, delay) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, delay)
  }
}

