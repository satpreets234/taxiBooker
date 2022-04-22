const mongoose=require('mongoose');
const registerer=new mongoose.Schema({
     firstName:{type:String,required:true},
     lastName:{type:String,required:true},
     email:{type:String,required:true},
     number:{type:Number,required:true},
     password:{type:String,required:true},
     isVerify:{default:false,type:Boolean},
     role:{type:String,enum:['User','Driver'],required:true}
     ,otp:{type:Number}
})

// const userImages=new mongoose.Schema({
     // path:{type:String,required:true},
     // userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'}
// })
module.exports.userImages=mongoose.model('userImages',userImages);
module.exports.registerer=mongoose.model('users',registerer);