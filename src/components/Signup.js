import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"",email:"", password:"",conPassword:""});
  const navigate = useNavigate();
  const host = "http://localhost:5000";

  const handleSignup = async (e)=>{
    e.preventDefault();

    const response = await fetch(`${host}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: credentials.name,email: credentials.email, password: credentials.password}),
    });
      
    const json = await response.json();
    console.log(json);
    if(json.success){
        //save the auth token and redirect
        localStorage.setItem('token',json.authToken);
        navigate("/");
        props.showAlert("Account created successfully","success");
    }else{
      props.showAlert(json.error,"danger");
    }
  }
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }
  const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]:e.target.value});
  }
  return (
    <div className="container mt-2">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required/>
            <div id="emailHelp" className="form-text">{!isValidEmail(credentials.email) && 'Enter a valid email address'}</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="conPassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="conPassword" name="conPassword" value={credentials.conPassword} onChange={onChange} minLength={5} required/>
        </div>
        <button disabled={credentials.name.length<5||!isValidEmail(credentials.email)||credentials.password!==credentials.conPassword} type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
    
  )
}

export default Signup
