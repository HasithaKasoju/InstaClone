import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import '../css/SignUp.css';
import { toast } from 'react-toastify';
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)
  const navigate = useNavigate(); 
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  const postData = () => {
    // console.log(name);
    // console.log(email);
    // console.log(userName);
    // console.log(password);
     //checking email
     if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      alert("Invalid email");
      return
      
    } else if (!passRegex.test(password)) {
      notifyA("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
      alert("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
       return
    }
    fetch("/SignUp",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      
      body:JSON.stringify({
        name:name,
        email:email,
        username:userName,
        password:password

      })
    }).then(res=> res.json()).then(data =>{console.log(data)})
    alert("sucessfully registered");
    navigate("/SignIn"); 

  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    postData(); // Call postData function
  };

  return (
    <div className="SignUp">
      <div className="form-container">
        <img className="SignUp-logo" src={logo} alt="Logo" />
        <p className="loginPara">Sign Up to see photos</p>
        <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
          <div className="input-group">
            <input type="text" name="name" id="name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="text" name="username" id="username" value={userName} placeholder="Username" onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="email" name="email" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" name="password" id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="submit" id="submit-btn" value="Sign Up" />
          </div>
        </form>
        <p>Already have an account? <Link to="/SignIn">SignIn</Link></p>
      </div>
    </div>
  );
}