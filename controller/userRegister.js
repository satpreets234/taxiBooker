const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const userImages=require('../models/register').userImages;
const taxi=require('../models/taxiRegister').taxi;
const booking=require('../models/taxiBooking');
const registerUser=require('../models/register').registerer;
// const allBookings=require('../models/taxiBooking');
module.exports.registerUsers=async(req,res)=>{
    const {firstName,lastName,email,number,password,isVerify,role}=req.body;
    var otp=Math.floor(Math.random() * 10000);
    
    if(!firstName || !lastName || !email || !number || !password || !role ){
        res.send('Please enter all the required details')
    }
    else{
    const newRegisterPerson=new registerUser({
        firstName,lastName,email,number,password,isVerify,role,otp
    });
    // const jwtToken=jwt.sign({_id:newRegisterPerson._id},secretKey,{expiresIn:'1d'})
    newRegisterPerson.save();
    console.log(newRegisterPerson);
    const images=new userImages({path:req.file.path,userId:newRegisterPerson._id});
    images.save(function (err,docs){
        if (err) throw err;
        else{
        res.send(newRegisterPerson+'\n'+ docs)}
    })}
}

module.exports.login=async(req,res)=>{
    const finduser=await registerUser.findOne({ email:req.body.email    });
    if(finduser){
        const loginToken=jwt.sign({_id:finduser._id},process.env.SECRETKEY,{expiresIn:'1d'})
    
        if(finduser.password==req.body.password && finduser.role=='User'){
        const yourBookings=await registerUser.aggregate([{
            $match:{_id:finduser._id}
        },{
            $lookup:{
                from:'bookings',
                localField:'_id',
                foreignField:'userId',
                as:'yourBookings'
            },
        },{
            $project:{
                "yourBookings.__v":0,"yourBookings.email":0,"yourBookings._id":0,"yourBookings.name":0
            }
        }])
    
        res.send({bookings:yourBookings,token:loginToken})
        }
        else if(finduser.password==req.body.password && finduser.role=='Driver'){
           const allRequests=await taxi.aggregate([{
               $match:{driverId:finduser._id}
           },{
               $lookup:{
                   from:'bookings',
                   localField:'cabtype',
                   foreignField:'cabname',
                   as:"docs"
               }
           }])
           res.send(allRequests)
           
        }else{res.send('password incorrect')}}
    else{
        res.send('no user exist with this email')
    }
}

module.exports.isverify=async(req,res)=>{
    const finduser=await registerUser.findOne({email:req.body.email});
    if(finduser){
    if (finduser.otp==req.body.otp){
        const verification=await registerUser.updateOne({email:req.body.email},{$set:{isVerify:true}})
        if(verification.modifiedCount){
            res.send(finduser)
        }
        else{res.send('already verified user')}
    }
    else{
        res.send('otp incorrect')
    }}
    else{res.send('no user found')}
}


module.exports.cancelbooking=async(req,res)=>{
    const userExist=req.user;
    console.log(userExist);
    if(userExist){
        const deletebooking=await booking.updateOne({_id:req.body.bookingId},{$set:{bookingstatus:'cancelled',isdeleted:true}})
        if(deletebooking.modifiedCount){
            res.send('your booking cancelled succesfully')
        }
        else{res.send('you have no booking like this')}
    }
    else{res.send('please login')}
}