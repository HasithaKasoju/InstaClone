import React, { useEffect, useState } from 'react';
import profile from '../img/profile.jpg';
import '../css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import UserProfile from './UserProfile';
export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment,setComment]=useState("");
  const [show,setShow]=useState(false);
  const [item,setItem]=useState([]);
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate('/SignUp');
    } else {
      fetch("http://localhost:5000/allposts", {
        headers: {
          "Authorization": "Bearer " + token
        },
      })
      .then(res => res.json())
      .then(result => {
        setData(result);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }, [navigate]);


   const toogleComment=(posts)=>
   {
    if(show)
    {
   setShow(false)
    }
    else{
      setShow(true)
      setItem(posts);
    }
  }
  const toggleLike = (postId) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate('/SignUp');
    } else {
      const post = data.find(p => p._id === postId);
      const isLiked = post.likes.includes(postId);
      const updatedLikes = isLiked ? post.likes.filter(id => id !== postId) : [...post.likes, postId];

      const updatedData = data.map(post => {
        if (post._id === postId) {
          return { ...post, likes: updatedLikes };
        }
        return post;
      });
      setData(updatedData);

      const emojiElement = document.getElementById(`emoji-${postId}`);
      emojiElement.style.color = isLiked ? 'black' : 'red'; // Change color based on like status

      const endpoint = isLiked ? 'unlike' : 'like';
      fetch(`http://localhost:5000/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          postId: postId
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }
        // Optionally, update the UI here
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    }
  };

  const makeComment =(text,id)=>
  {
    fetch("http://localhost:5000/Comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
    .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return {
              ...posts,
            comments:result.comments
                    };
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        alert("posoted comment");
        console.log(result);


      });
  }
  
  
  return (
    <div className="home">
      {data.map(post => (
        <div className="card" key={post._id}>
          <div className="card-header">
            <div className="card-pic">
              <img src={post.postedBy.Photo ? post.postedBy.Photo : profile} alt="Profile" />
            </div>
            <h5>
              <Link to ={`../Profile/${post.postedBy._id}`}>
              {post.postedBy ? post.postedBy.name : "Unknown User"}</Link></h5>
          </div>
          <div className="card-image">
          <img 
  src={post.photo} 
  onClick={() => {
    console.log("user of the post:", post.postedBy._id);
   
  }} 
  alt="Post" 
/>
            <div className="card-content">
              <span
                className={`material-symbols-outlined ${post.likes.includes(post._id) ? 'liked' : ''}`}
                onClick={() => toggleLike(post._id)}
              >
                <span id={`emoji-${post._id}`} style={{ color: post.likes.includes(post._id) ? 'red' : 'black' }}>
                  {post.likes.includes(post._id) ? '❤️' : '🖤'}
                </span>
              </span>
              <p>{post.likes.length} likes</p>
              <p>{post.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                
              >
            <p style={{fontWeight:"bold",cursor:"pointer"}}onClick={()=>{toogleComment(post);}} on> View all comments</p> 
              </p>
            </div>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input type="text" placeholder='Add a comment' value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }} />
            <button className="comment"    onClick={() => {
                  makeComment(comment, post._id);
                }}>Post</button>
          </div>
        </div>
      ))}
      {

      show &&
      (<div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo}  alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src={profile}  //here comes the image
                    alt="hello"
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                 {item.comments.map((it)=>
                 {
                   return ( <p className="comm">
                   <span
                     className="commenter"
                     style={{ fontWeight: "bolder" }}
                   >
                   <p>{it.postedBy.name}</p>
                   </span>
                   <span className="commentText">{it.comment}</span>
                 </p>)
                 })}
                   
                  
                
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toogleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div className="close-comment" onClick={()=>{toogleComment();}}>
          <FontAwesomeIcon icon={faXmark} />
          </div>
     </div>)
        } 
        
    </div>
  );
}
