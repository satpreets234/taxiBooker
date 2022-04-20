const mongoose=require('mongoose');
const newPerson=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    passenger:{type:String,required:true},
    pickupAddress:{type:String,required:true},
    // pickupLattitude:{type:Number,required:true},
    // pickupLongitude:{type:Number,required:true},
    destinationAddress:{type:String,required:true},
    // destinationLattitude:{type:Number,required:true},
    // destinationLongitude:{type:Number,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'users'},date:{type:String},
    cabname:{type:String,enum:['SUV','SEDAN','LUXURY','AMBASSABADOR','NANO'],required:true}
    ,bookingstatus:{type:String,enum:['pending','accepted','cancelled'],default:'pending'},
    isdeleted:{type:Boolean,default:false}
});

module.exports=mongoose.model('Booking',newPerson);