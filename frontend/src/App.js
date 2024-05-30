import './App.css';
import Navbar from './Screens/Navbar';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Profile from './Screens/Profile';
import CreatePost from './Screens/CreatePost';
import Home from './Screens/Home';
import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginContext } from './context/LoginContext';
import SignOut from './Screens/SignOut';
import UserProfile from './Screens/UserProfile';
import Myfollowingpost from './Screens/MyfollowingPost';
function App() {
  const [userLogin, setUserLogin] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path='/Home' element={<Home />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/SignIn' element={<SignIn />} />
            <Route exact path='/Profile' element={<Profile />} />
            <Route path='/CreatePost' element={<CreatePost />} />
            <Route path='/Profile/:userid' element={<UserProfile />} />
            <Route path='/SignOut' element={<SignOut />} />
            <Route path='/Myfollowingpost' element={<Myfollowingpost/>} />
          </Routes>
          {/* Ensure correct usage and capitalization */}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
