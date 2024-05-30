import React from 'react';
import logo from '../img/logo.png';
import '../css/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ login }) {
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const loginStatus = () => {
    if (token || login) {
      return (
        <>
          {/* Removed Home link */}
          <Link to="/MyfollowingPost" className="nav-link"><li>My Following Posts</li></Link>
          <Link to="/Profile" className="nav-link"><li>Profile</li></Link>
          <Link to="/CreatePost" className="nav-link"><li>Create Post</li></Link>
          <Link to="/SignOut" className="nav-link"><li>Sign Out</li></Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/SignUp" className="nav-link"><li>Sign Up</li></Link>
          <Link to="/SignIn" className="nav-link"><li>Sign In</li></Link>
        </>
      );
    }
  };

  return (
    <div className="Navbar">
      <img src={logo} onClick={() => navigate("/home")} alt="Logo" />
      <ul className="nav-menu">
        {loginStatus()}
      </ul>
    </div>
  );
}
