const mongoose=require('mongoose');
const dotenv=require('dotenv');
var connect=()=>{
    const url=process.env.MONGO_PORT;
    return mongoose.connect(url,{useNewUrlParser:true},(err,data)=>{
        if(err){throw err}
        else{return console.log('database connected succesfully')}
    })
}
module.exports=connect();