const {pic,taxi}=require('../models/taxiRegister');
const Booking=require('../models/taxiBooking');
const nodeMailer=require('nodemailer');
const {transport}=require('../service/services');
const secretKey=process.env.SECRETKEY;
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const registerUser=require('../models/register').registerer;
module.exports.registerTaxi=async(req,res)=>{
    const userRole= await registerUser.findOne({email:req.body.email})
    if(userRole){
    if(userRole.role==='Driver' && userRole.isVerify==true ){
        const taxis=await taxi.findOne({chassisNumber:req.body.chassisNumber});
    if (!taxis){
     const newtaxi=await new taxi({
         name:req.body.name,model:req.body.model,
         chassisNumber:req.body.chassisNumber,ratehourly:req.body.ratehourly,
         rateperday:req.body.rateperday,passengers:req.body.passengers,
         cabtype:req.body.cabtype,description:req.body.description,driverId:req.body.driverId
     });
     newtaxi.save();
     const image=await new pic({
         path:req.file.path,
         vehicleId:newtaxi._id
     });
     image.save();
     res.send(newtaxi+'\n'+image)}
     else{res.send('Duplicate data,Permission denied')}

}else if(userRole.role==='Driver' && userRole.isVerify==false ){
    res.send('you cannot register your taxi till you do not verify your account')   
}
 else{res.send('you cannot register a taxi , as you are a user')   
}
}
 else{res.send('no user found')}}
// module.exports.taxiImage=async(req,res)=>{
//     const taxiImage=await new pic({
//         path:req.file.path,
//         vehicleId:req.body.vehiclId     
//         })
//     }
module.exports.alltaxis=async (req,res)=>{
    const alltaxi= await taxi.aggregate([{
        $lookup:{
            from:'pics',
            localField:'_id',
            foreignField:'vehicleId',
            as:'docs'
        }
    },   {
        $project:
            {'docs._id':0,'docs.__v':0}
        }
    ])
    res.send(alltaxi);
}

module.exports.booktaxi=async(req,res)=>{
     const userExist=req.user;
     if(userExist){
   const taxiBooker=new Booking({
       name:req.body.name,email:userExist.email,
       passenger:req.body.passenger,pickupAddress:req.body.pickupAddress,
    //    pickupLattitude:req.body.lattitude,pickupLongitude:req.body.pickupLongitude,
       destinationAddress:req.body.destinationAddress,
    //    destinationLattitude:req.body.lattitude,destinationLongitude:req.body.destinationLongitude
       userId:req.body.userId,
       date:new Date(Date.now()),cabname:req.body.cabname
   })
//    console.log(process.env.EMAILFROM+' '+process.env.PASSWORD);
//    var mailOption={from:process.env.EMAILFROM,to:await req.body.email ,subject:'Registered succesfully',
//    text:`Thanks for booking the taxi to ${req.body.destinationAddress} ,our team will contact with you shortly`}
   taxiBooker.save((err,docs)=>
   {if (err) throw err;
    else {res.send(taxiBooker)};
})
}
else{res.send('Please login first')}}

module.exports.taxiImage=async(req,res)=>{
    const taxiExist=await taxi.findOne({chassisNumber:req.body.chassisNumber})
    if(taxiExist){
    const newImage=new pic({
        path:req.file.path,
        vehicleId:taxiExist._id
    })
    await newImage.save((err,data)=>{
        if (err) throw err;
        else{res.send(data)};
    })
}}

module.exports.deleteTaxi=async(req,res)=>{
    const {chassisNumber,name,model}=req.body;
    const taxiExist=await taxi.findOne({chassisNumber})
    if(taxiExist){
        if(name==taxiExist.name && model==taxiExist.model){
            const deleteTaxi=await taxi.deleteOne({_id:taxiExist._id})
            const deleteImages= await pic.deleteMany({vehicleId:taxiExist._id})
            if(deleteTaxi.deletedCount && deleteImages.deletedCount){
                res.status(200).send('taxi details deleted succesfully')
            }
            else{res.status(404).send('Invalid information')}
        }
        else{res.status(404).send('Invalid information')
        }
    }
    else{res.status(404).send('Invalid information')}
}

module.exports.acceptbooking=async(req,res)=>{
    const driveruser=await registerUser.findOne({email:req.body.email});
    if(driveruser){
    const drivertaxi=await taxi.find({driverId:driveruser._id});
    const bookingupdate=await Booking.updateOne({_id:req.body._id},{$set:{
        bookingstatus:"accepted"}})
        res.send(bookingupdate)
}
else{res.send('driver not found')}}


