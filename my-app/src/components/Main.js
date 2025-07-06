import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
export default function Main() {
  const navigate = useNavigate();
  const [Username,setUsername] = useState('');
  const [Password,setPassword] =useState('');
  const handlelogin = async (e) =>{
    e.preventDefault();
    try{
    const fetchdata = await fetch("http://localhost:5000/login",{
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
    const res = await fetchdata.json();
    if(fetchdata.ok){
        alert("user login");
        console.log('userid',res.user_id);
        navigate(`/post/pdf/${res.user_id}`);
    }
    else{
        console.log("login error")
    }
}catch(error){
    console.log("login",error);
}
  }
  return(
    <div className="auth-container">
      <h3>Sign In</h3>
      <form onSubmit={(e)=>{handlelogin(e)}} >
        <input type="text" name="username" placeholder="Enter Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" name="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} />
        <input type="submit" value="Login" className="btn" />
      </form>
      <span>New User<Link to = '/Register'>Register</Link></span> 
    </div>
  )
}
