
import React, { useEffect, useState } from 'react';
import profile from '../img/profile.jpg';
import "../css/Profile.css";
import { useNavigate } from 'react-router-dom';
import Postdetails from './Postdetails';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const [data, setData] = useState([]);
  const { userid } = useParams();
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false); // State to track if user is following
  const navigate = useNavigate();

  const notifyB = (message) => alert(message);

  const followUser = (userid) => {
    fetch(`http://localhost:5000/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowing(true); // Update state to indicate following
        localStorage.setItem("following", true); // Update local storage
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = (userid) => {
    fetch(`http://localhost:5000/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFollowing(false); // Update state to indicate unfollowing
        localStorage.setItem("following", false); // Update local storage
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then((result) => {
        console.log("Results.......")
        console.log(result);
        setUser(result.user);
        setPosts(result.posts);
        // Check if current user is following the profile user
        const isFollowing = localStorage.getItem("following") === "true";
        setFollowing(isFollowing);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={profile} alt="profile" />
        </div>
        <div className="profile-data">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>{user.name}</h1>
            <button className='followBtn' style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: following ? '#C13584' : '#405DE6', // Change color based on following status
              color: 'white',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease',
            }} onClick={() => {
              if (following) {
                unfollowUser(user._id);
              } else {
                followUser(user._id);
              }
            }}>{following ? 'Following' : 'Follow'}</button>
          </div>
          <div className="profile-info" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p> {user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", margin: "auto", opacity: "0.8" }} />
      <div className="gallery">
        {posts.map((pic) => (
          <div key={pic._id} className="post">
            <img
              src={pic.photo}
              alt="post"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
