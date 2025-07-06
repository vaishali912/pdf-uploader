import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style.css' ;
export default function Pdf() {
  const location = useLocation();
  const navigate =useNavigate();
  const {id}=useParams();
   const [pdfFile, setPdfFile] = useState(null);;
   const [data,setdata] =useState([]);
      const handleFileChange = (e) => {
        const file = e.target.files[0];
      if(file.size>5 * 1024 * 1024||!file ){
                alert("Please select a valid PDF fileand of size less  equal than 5MB ");
                return;
      }
       if(file){
        if (file && file.type === "application/pdf") {
          setPdfFile(file);
        } else {
          alert("Please select a valid PDF file.");
        }
      }
    }
    const handlefetch  = async ()=>{
         try{
        const fetchpdf = await  fetch( `http://localhost:5000/allpdf`,{
        method:"GET",
        credentials:"include"
      })
      const res = await fetchpdf.json();
      console.log("pdf are ",typeof(res));
      setdata(res);
    }
  catch(error){
    console.log("while getting pdf",error);
  }
}
    useEffect(()=>{
        handlefetch();
},[]

    )
    const handleupload = async(e)=>{
      if(pdfFile==null){
        alert("upload  a valid pdf of less than or equal to 5 MB");
          return;
        
      }
      e.preventDefault();
      console.log("calaling upload")
       const formData = new FormData();
       formData.append("pdf", pdfFile); 
      try{
      const uploadpdf = await fetch(`http://localhost:5000/post/pdf`,{
          method:"POST",
          body:formData,
          credentials:"include"
          
      })
      const res =await  uploadpdf.json();
      if(uploadpdf.ok){
          navigate('/success',{state:res});
      }
      else{
        alert("upload pdf if size of less than or equal to 5MB")
      }
    }
    catch(error){
      alert("something went wrong ");
    }
  }
  const handledelete = async(id,e)=>{
    e.preventDefault();
    try{
         const deletepdf = await  fetch(`http://localhost:5000/delete/${id}`,{
          method: 'DELETE',
          credentials:"include"
         });
         const res = await deletepdf.json();
         if(deletepdf.ok){
          alert("pdf delted");
          handlefetch();
         }
         else{
          alert("something went wrong ");
          
         }
    }
     catch(error){
      alert("something went wrong ");
     }   

  }
  return (
    <div className="pdf-container">
    <h3>Select PDF:</h3>
    <form onSubmit={(e)=>{handleupload(e)}}>
      <input type="file" accept=".pdf" onChange={(e)=>{handleFileChange(e)}} />
      {pdfFile && <p>Selected file: {pdfFile.name}</p>}
      <button>Upload</button>
      </form>
      <ul className="pdf-list">
      {data.map((post)=>(
         <li>
         <span>{post.pdfname}</span>
      <div className="admin-post-controls">
        <Link to='/' className="btn">view</Link>
        <form onSubmit={(e)=>{handledelete(post._id,e)}}>
          <input type="submit" value="Delete" className="btn-delete btn" />
        </form>

      </div>

    </li>
      ))}
      </ul>
    </div>
  )
}
