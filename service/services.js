const nodeMailer=require('nodeMailer');
const dotenv=require('dotenv');
var transport=nodeMailer.createTransport({service:'Gmail',host:'smtp.gmail.com',port:252,auth:{
    user:`${process.env.EMAILFROM}`,
    pass:`${process.env.PASSWORD}`},secure:false
})
module.exports={transport}