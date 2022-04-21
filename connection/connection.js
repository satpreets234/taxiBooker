const mongoose=require('mongoose');
const dotenv=require('dotenv');
var connect=()=>{
    const url='mongodb+srv://root:root@cluster0.todu8.mongodb.net/clients?retryWrites=true&w=majority';
    return mongoose.connect(url,{useNewUrlParser:true},(err,data)=>{
        if(err){throw err}
        else{return console.log('database connected succesfully')}
    })
}
module.exports=connect();