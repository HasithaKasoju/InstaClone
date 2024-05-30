import React, { useState ,useEffect,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import '../css/SignOut.css';

import { LoginContext} from '../context/LoginContext';
export default function SignOut() {
  const navigate = useNavigate();
  const {setUserLogin}=useContext(LoginContext)
  const handleSignOut = () => {
    // Clear JWT from local storage
    localStorage.removeItem("jwt");
    setUserLogin(false)
    navigate('/SignIn')

  };

  const handleCancel = () => {
   // setUserLogin(false);// Navigate back to Home page
    navigate("/Home");
  };

  return (
    <div className="SignOut">
      <div className="form-container">
        <img className="SignOut-logo" src={logo} alt="Logo" />
        <p className="logoutPara">Are you sure you want to log out?</p>
        <div className="button-group">
          <button onClick={handleSignOut} className="signout-btn">SignOut</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
