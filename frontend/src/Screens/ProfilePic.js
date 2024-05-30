
import React, { useState, useEffect, useRef } from "react";
import '../css/ProfilePic.css';

export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "hasitha2");
    data.append("cloud_name", "hasitha2");

    fetch("https://api.cloudinary.com/v1_1/hasitha2/image/upload", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url);
      console.log("Image URL:", data.url);
    })
    .catch(err => console.error("Error uploading image:", err));
  };

  const postPic =()=> {

      fetch("http://localhost:5000/profilePic", {
        method: "PUT", // Changed to PUT since we're updating
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({ 
          pic: url,
         })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("Failed to update profile picture");
        } else {
          console.log(data);
         // fetchUserData();
          changeprofile();
          alert("Profile picture updated successfully");
        }
      })
      .catch(err => console.error("Error updating profile picture:", err));
    };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);
  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);
  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" onClick={()=>{ 
            setUrl(null) 
            postPic()}} style={{ color: "#ED4956" }}>
           {" "} Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px"
            }}
            onClick={changeprofile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
