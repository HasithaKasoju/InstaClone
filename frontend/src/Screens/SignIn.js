import React, { useState ,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { LoginContext} from '../context/LoginContext';
import '../css/SignIn.css'; 
export default function SignIn() {
  const {setUserLogin}=useContext(LoginContext)
  // State to track if input fields are focused
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
  const postData = async () => {
    try {
      // Send POST request to sign-in endpoint
      const response = await fetch("http://localhost:5000/SignIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: userName,
          password: password
        })
      });
  
      // Parse response JSON
      const data = await response.json();
  
      // Check if response is successful
      if (response.ok) {
        alert("Successfully Logged In");
        console.log(data.token);
  
        // Save JWT to local storage
        localStorage.setItem("jwt", data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserLogin(true);
        // Navigate to Home page
        navigate("/Home");
      } else {
        // Handle errors (e.g., wrong credentials)
        console.error("Error logging in:", data);
        alert(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      // Catch and log any network or other errors
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    postData(); // Call postData function
  };
  
  return (
    <div className="SignIn">
      <div className="form-container">
        <img className="SignIn-logo" src={logo} alt="Logo" />
        <p className="loginPara">SignIn to access your account</p>
        <form onSubmit={handleSubmit}> 
          <div className="input-group">
            <input type="text" name="username" id="username" value={userName} placeholder="Username" onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" name="password" id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
         
          <div className="input-group">
            <input type="submit" id="submit-btn" value="SignIn" />
          </div>
        </form>
        <p>Don't have an account? <Link to="/SignUp">SignUp</Link></p>
      </div>
    </div>
  );
}
