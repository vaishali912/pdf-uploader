import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
export default function Register() {
 const [Username,setUsername] = useState('');
  const [Password,setPassword] =useState('');
  const navigate = useNavigate();
   const handlelogin = async (e) =>{
    e.preventDefault();
    try{
    const fetchdata = await fetch("http://localhost:5000/register",{
       credentials:'include',
       headers: {
        'Content-Type': 'application/json'
      },
       method:'POST',
       body:JSON.stringify({
        username:Username,
        password:Password
       })
    });
    const res =  await fetchdata.json();
    if(fetchdata.ok){
        alert("user register");
        console.log('userid',res.user_id);
       navigate(`/post/pdf/${res.user_id}`);
    }
    else{
        console.log("login error",res)
    }
}catch(error){
    console.log("login sit not run",error);
}
  }
  return (
    <div className="auth-container">
      <h3>Register</h3>
      <form onSubmit={(e)=>{handlelogin(e)}}>
        <input type="text" name="username" placeholder="Enter Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" name="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} />
        <input type="submit" value="Register" className="btn" />
      </form>
     <span>Already have a account<Link to = '/'>Sign In</Link></span>
    </div>
  )
}
