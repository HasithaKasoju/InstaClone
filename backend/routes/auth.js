const express = require('express');
const router = express.Router();
const USER = require('../models/model');
const appError=require('../appError');
const brypt=require('bcryptjs');
middleware=require('../middleware/requiredLogin');
const {signUpRouter,SignInRouter}=require('../controllers/auth');
router.post("/SignUp",signUpRouter );
router.post("/SignIn", SignInRouter);

  router.get('/logout/',async (req,res)=>
  {
   try{
      console.log("logged out successfully");
      res.json({
          status:"success",
          user:"User logged out successfully",
      })
   }catch(err)
   {
      res.json(err);
   }
  });

module.exports = router;



