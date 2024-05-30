const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requiredLogin')
const POST=require('../models/profile');
const USER = require('../models/model');

router.put('/profilePic', requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.user._id,
    {
      $set: { Photo: req.body.pic }
    },
    {
      new: true
    }
  )
  .then((imag) => {
    console.log("uploaded succesfully ");
    res.json(imag);
  })
  .catch((err) => {
    res.status(500).json({ error: "An error occurred" });
  });
});

router.get('/MyPosts', requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id }).populate("postedBy","_id name followers following").populate("comments.postedBy", "_id name Photo")
    .then(posts => res.json({posts,user:req.user}))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching posts." });
    });
});

router.get('/Allposts',requireLogin, (req, res) => {
  POST.find().populate("postedBy","_id name Photo").populate('comments.postedBy', '_id name Photo').
  then(posts => res.json(posts))
      .catch(err => console.log(err));
});

router.post('/CreatePost', requireLogin, async (req, res) => {
    const { body, pic } = req.body;
  
    // Validate request body
    if (!body || !pic) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
  
    // Log user ID
    console.log(req.user._id);
  
    // Create new post
    const post = new POST({
      body,
      photo: pic,
      postedBy: req.user._id
    });
  
    try {
      // Save post to the database
      const result = await post.save();
      console.log("Inserted successfully:", result); // Log the inserted document
      return res.json({
        status: "Successfully inserted",
        post: result
      });

    } catch (err) {
      console.error("Error inserting post:", err);
      res.status(500).json({ error: "Failed to insert post" });
    }
  });
  router.put('/like', requireLogin, (req, res) => {
    const postId = req.body.postId;
    const userId = req.user._id;

    // Update the like count and retrieve the updated count
    POST.findByIdAndUpdate(
        postId,
        { 
            $inc: { likeCount: 1 }, // Increment likeCount by 1
            $addToSet: { likes: userId } // Add userId to likes array if it's not already there
        },
        { new: true }
    )
    .populate('likes', '_id').populate('comments.postedBy', '_id name Photo')// Populate the 'likes' array with user IDs
    .then((err, updatedPost) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            // Retrieve the updated like count and list of users who liked the post
            const updatedLikeCount = updatedPost.likeCount;
            const usersWhoLiked = updatedPost.likes.map(user => user._id);
            res.json({ likeCount: updatedLikeCount, likes: usersWhoLiked });
        }
    });
});


router.put('/unlike', requireLogin, (req, res) => {
  const postId = req.body.postId;
  const userId = req.user._id;

  // Update the like count and retrieve the updated count
  POST.findByIdAndUpdate(
      postId,
      { 
         $inc: { likeCount: -1 }, // Decrement likeCount by 1
        $pull: { likes: userId } // Add userId to likes array if it's not already there
      },
      { new: true }
  )
  .populate('likes', '_id').populate('comments.postedBy', '_id name Photo')// Populate the 'likes' array with user IDs
  .then((updatedPost) => { // Separate the error and result parameters
      // Retrieve the updated like count and list of users who liked the post
      const updatedLikeCount = updatedPost.likeCount;
      const usersWhoLiked = updatedPost.likes.map(user => user._id);
      res.json({ likeCount: updatedLikeCount, likes: usersWhoLiked });
  })
  .catch((err) => { // Handle errors separately
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });
});


router.put('/Comment',requireLogin,(req,res)=>
{
  const comment ={
    comment :req.body.text,
    postedBy:req.user._id
  }
  POST.findByIdAndUpdate(req.body.postId,
    {
      $push: { comments: comment}
    }, {
      new: true
  }).populate("comments.postedBy", "_id name")
  .populate("postedBy", "_id name Photo").then((updatedPost) => { // Separate the error and result parameters
    console.log("commented successfully .....");
    console.log(updatedPost);
    res.json(updatedPost);
})
  
})


router.get('/user/:id', requireLogin, (req, res) => {
  USER.findById(req.params.id)
    .select("-password")
    .populate("followers", "_id name")
    .populate("following", "_id name")
    .then(user => {
      POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .then(posts => {
          res.json({ user, posts });
        });
    })
    .catch(err => {
      res.status(404).json({ error: "User not found" });
    });
});
router.get('/myfollowingpost', requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name Photo")
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: "Error while fetching posts" });
    });
});


  router.delete('/DeletePost/:postId', requireLogin, async (req, res) => {
    try {
        const post = await POST.findById({_id: req.params.postId}).populate("postedBy", "_id");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await POST.findByIdAndDelete(req.params.postId);
            res.json(post);
        } else {
            return res.status(403).json({ error: "Unauthorized action" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error while deleting" });
    }
});

router.put('/follow', requireLogin, (req, res) => {
  USER.findByIdAndUpdate(req.body.followId,
    {
      $push: { followers: req.user._id }
    },
    {
      new: true
    }
  )
  .then(updatedUser => {
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return USER.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.followId }
      },
      {
        new: true
      }
    );
  })
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    res.status(422).json({ error: err });
  });
});

router.put('/unfollow', requireLogin, (req, res) => {
  USER.findByIdAndUpdate(req.body.followId,
    {
      $pull: { followers: req.user._id }
    },
    {
      new: true
    }
  )
  .then(updatedUser => {
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return USER.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.followId }
      },
      {
        new: true
      }
    );
  })
  .then(result => {
    res.json(result);
  })
  .catch(err => {
    res.status(422).json({ error: err });
  });
});













module.exports=router;