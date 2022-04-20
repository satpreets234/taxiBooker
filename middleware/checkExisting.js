const user=require('../models/register').registerer
module.exports.checkExistingUser=async (req,res,next)=>{
    // console.log(req.body.email);
     const existingUser=await user.findOne({
         email:req.body.email
     })
   //   console.log(existingUser);
     if(!existingUser){
        next();
     }
     else{
        res.send('user already exists with same email')
        return
     }
}