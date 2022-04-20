const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'crews');
    },filename:(req,file,cb)=>{
        cb(null,Date.now()+'_pk_'+file.originalname)
    }
})

const upload=multer({storage});
module.exports={upload};