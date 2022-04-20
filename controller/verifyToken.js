const registeredUser=require('../models/register').registerer;
const jwt=require('jsonwebtoken');
module.exports.verifyToken=async(req,res,next)=>{
      const bearerToken=await req.header('Authorization');
      const token=bearerToken.slice(7);
      if(token){try{
          const verification=jwt.verify(token,process.env.SECRETKEY);
          if(verification){
              req.user=await registeredUser.findOne({
            _id:verification._id
            })
            if(req.user){
                next();
            }
          }}
          catch (err){res.status(400).send('login first')}  
      }else{
        res.send('Unauthorized Access')
      }
}