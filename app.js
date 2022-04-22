const mongoose=require('mongoose');
const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const {upload}=require('./middleware/uploading');
const bodyParser=require('body-parser');
require('./connection/connection');
const user=require('./models/taxiRegister').taxi;
const image=require('./models/taxiRegister').pic;
const {userImages,registerer}=require('./models/register');
const verifyFunction=require('./controller/verifyToken');
const middleware=require('./middleware/checkExisting');
app.use(cors())
app.use(bodyParser.json());
const newPerson=require('./models/taxiBooking');
const functions=require('./controller/taxiContoller');
const userFunctions=require('./controller/userRegister');
app.get('/',(req,res)=>{
    res.send('hellos')
})
app.get('/alltaxi',functions.alltaxis);
app.post('/newtaxi',upload.single('file'),functions.registerTaxi);
app.delete('/taxi',functions.deleteTaxi);
app.post('/taxiImage',upload.single('file'),functions.taxiImage);
app.post('/registeruser',upload.single('file'),middleware.checkExistingUser,userFunctions.registerUsers);
app.post('/booktaxi',verifyFunction.verifyToken,functions.booktaxi);
app.post('/secret',verifyFunction.verifyToken);
app.post('/loginuser',userFunctions.login);
app.post('/verify',userFunctions.isverify);
app.post('/acceptbooking',functions.acceptbooking);
app.post('/cancelbooking',verifyFunction.verifyToken,userFunctions.cancelbooking);

app.listen(process.env.PORT || 6666,()=>{
    console.log('app listening at port ****')
})