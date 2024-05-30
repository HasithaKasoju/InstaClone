const appError =require('../backend/appError');
const Protected =(req,res,next)=>
{
    if(req.session.userAuth)
    {
        console.log("****************");
        console.log("is authenticated... ");
        console.log("****************");
        return next();
    }
    return next(appError("Un authorised access",400));
};
module.exports=Protected;