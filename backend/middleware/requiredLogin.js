
const jwt = require("jsonwebtoken")
const { Jwt_secret } = require("../Keys")
const mongoose = require("mongoose")
const USER=require('../models/model')
const requiredLogin = (req, res, next) => {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" })
    }
    else
    {
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token,Jwt_secret,(err,payload)=>
        {
            if(err)
            {
                return res.status(401).json({ error: "You must have logged in 2" })
       
            }
            const {_id}=payload;
            USER.findById(_id).then(userdata=>
                {   console.log("is authentictaededddddd");
                    console.log(userdata);
                    req.user = userdata;
                    console.log("***************  "+_id);
                       //res.json({status:"OK"});
            next()
                })
         
        })

    }
    
    

}
module.exports=requiredLogin;

















