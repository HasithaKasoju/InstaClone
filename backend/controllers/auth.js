const express = require('express');
const router = express.Router();
const appError = require('../appError');
const brypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const middleware = require('../middleware/requiredLogin');
const {mongoUrl,Jwt_secret}=require('../Keys');
const mongoose =require('mongoose');
const USER = require('../models/model');
mongoose.connect(mongoUrl);
const bcrypt = require('bcrypt');
const signUpRouter = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user already exists
        let user = await USER.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        user = new USER({ name, username, email, password:hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error in signUp:', error.message);

        // Respond with appropriate error message and status code
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
const SignInRouter= async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }
  
    try {n 
      const userFound = await USER.findOne({ username: username });
      if (userFound) {
        const isMatch = await brypt.compare(password, userFound.password);
        if (isMatch) {
          const token=jwt.sign({_id:userFound.id},Jwt_secret);
          return res.json({ token ,user: { _id: userFound._id,name :userFound.name,email:userFound.email}});
           //next()
        } else {

          return res.status(400).json({ status: "failed", error: "Invalid username or password" });
        }
      } else {
        return res.status(404).json({ status: "failed", error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  };
module.exports = {
    signUpRouter,SignInRouter
};
