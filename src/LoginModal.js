import React from 'react'
import ReactDOM from 'react-dom'
import { FaTimes } from "react-icons/fa"

const MODAL_STYLES = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "4rem",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "20rem",
    minWidth: "9rem",
    height: "18rem",
    margin: "0 10px 0 0",
    border: "1px solid #F6F4F1",
    borderRadius: "10px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#101419",
    padding: "50px",
    zIndex: 1000,
    textAlign: "center"
}

export const LoginModal = ({open, children, close}) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay">
        <div style={MODAL_STYLES}>
        <FaTimes onClick={close} className="modal-x" />
          {children}
        </div>
    </div>,
    document.getElementById("portal")
  )
}
