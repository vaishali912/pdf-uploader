import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Success() {
    const location = useLocation();
    const data = location.state;
  return (
    <>
       <p>"success": {data.succes}</p>
       <p> "message": {data.message}</p>
       <p>"filename":{data.filename}</p>
       <p>"filePreviewUrl": {data.filePreviewUrl}</p>
    </>
  )
}
