import React from 'react';
import '../css/Postdetails.css';
import profile from '../img/profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export default function Postdetails({ item, toggledetails, onDelete            }) {

  const navigate = useNavigate();
  const removePost = (postId) => {
    console.log("Removed post");
    if (window.confirm("Do you really want to delete this post?")) {
      fetch(`http://localhost:5000/DeletePost/${postId}`, {
        method: "delete",
        headers: {
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // navigate("/Profile")
          console.log(result);
          onDelete(postId); 
           toggledetails();
        });
    }
  };

  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={item.photo} alt="" />
        </div>
        <div className="details">
          <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
            <div className="card-pic">
              <img src={profile} alt="profile" />
            </div>
            <h5>{item.postedBy.name}</h5>
            <div className="deletePost" onClick={() => removePost(item._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
          <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
            {item.comments.map((it) => (
              <p className="comm" key={it._id}>
                <span className="commenter" style={{ fontWeight: "bolder" }}>
                  {it.postedBy.name}
                </span>
                <span className="commentText">{it.comment}</span>
              </p>
            ))}
          </div>
          <div className="card-content">
            <p>{item.likes.length} Likes</p>
            <p>{item.body}</p>
          </div>
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input type="text" placeholder="Add a comment" />
            <button className="comment">Post</button>
            <div className="close-comment" onClick={toggledetails}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
