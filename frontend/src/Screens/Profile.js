import React, { useEffect, useState } from 'react';
import profile from '../img/profile.jpg';
import '../css/Profile.css';
import { useNavigate } from 'react-router-dom';
import Postdetails from './Postdetails';
import ProfilePic from './ProfilePic';

export default function Profile() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [changePic, setChangePic] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const notifyB = (message) => alert(message);
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  console.log("ID : ", userId);

  const toggledetails = (posts) => {
    console.log("toggledetails function called", posts);
    setShow(!show);
    if (!show) setPosts(posts);
  };

  const deletePostFromState = (postId) => {
    setData(data.filter(post => post._id !== postId));
  };

  const changeprofile = () => {
    setChangePic(!changePic);
  };

  const fetchUserData = () => {
    fetch(`http://localhost:5000/user/${userId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then((result) => {
        setUser(result.user); // Set user data from the response
        setData(result.posts);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch data again when profile picture is changed
  useEffect(() => {
    if (!changePic) {
      fetchUserData();
    }
  }, [changePic]);

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img onClick={changeprofile} src={user.Photo ? user.Photo : profile} alt="profile" />
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem('user')).name}</h1>
          <div className="profile-info" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <p>{data.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: "auto", opacity: "0.8" }} />
      <div className="gallery">
        {data.map((pic) => (
          <div key={pic._id} className="post">
            <img 
              src={pic.photo} 
              onClick={() => toggledetails(pic)} 
              alt="post" 
            />
          </div>
        ))}
      </div>
      {show && <Postdetails item={posts} toggledetails={toggledetails} onDelete={deletePostFromState} />}
      {changePic && <ProfilePic changeprofile={changeprofile} />}
    </div>
  );
}
