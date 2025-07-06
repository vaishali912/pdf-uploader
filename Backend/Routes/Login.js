const express = require('express');
const router = express.Router();
const { upload } = require('../Multer'); 
const path = require('path');
const  {uploadOnCloudinary,deleteOnCloudinary}  = require ('../Ckoudniary');
const Pdf = require('../Models/Pdf');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookie:", token); 

  if (!token) {
    console.log("No token found");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded); 
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message); 
    res.status(401).json({ message: 'Unauthorized' });
  }
};
router.post('/register', async (req,res)=>{ 
    try {
         
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user_id: user._id
      });
    } 
     catch (error) {
        console.log(" Mongoose User.create() Error:", error.message);
     
      res.status(500).json({ message: 'Internal server error'})
    }
  } catch (error) {
  
    res.json(error);
  }
})

router.post('/login', async (req,res)=>{
    try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json('Invalid credentials');
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    res.json({
        success: true,
        message: 'User login successfully',
        user_id: user._id
      });
  } catch (err) {
   // console.log(err);
    res.status(500).json("Server error");
  }
})
router.get('/allpdf',authMiddleware,async(req,res)=>{
    try{
   
     const data = await  Pdf.find({userid:req.userId})
     console.log("pdf data",data);
     res.json(data);
    }catch(error){
        res.json(error);
    
    }
})
router.post('/post/pdf',authMiddleware,upload.single('pdf'),async(req,res)=>{
  console.log(req.file);
    try{
       const localpath = path.resolve(req.file?.path);
       console.log("filepath is",localpath);
       if(!localpath){
        console.log("there is no path of file");
       }
       const resload = await uploadOnCloudinary(localpath);
       console.log("resload",resload);
       if(!resload){
        console.log("there is no post on cloudinary");
       }
       console.log("Uploading to MongoDB:", {
  userid: req.userId,
  pdf: resload.url,
  pdfname: resload.original_filename,
  public_id: resload.public_id
});
       const succupload =await  Pdf.create({userid:req.userId,pdf:resload.url,pdfname:resload.original_filename,publicid: resload.public_id });
       if(!succupload){
        if(resload){
          const deltepdf = await deleteOnCloudinary(resload.publicid);
          res.json({
            success: false,
             message: "File not  uploaded successfully try again",
            filename:resload.original_filename,
            filePreviewUrl: resload.url
          })
        }
        console.log("there i prblm in mongo upload",succupload)
       }
       else{
        console.log("nprvlm in mongoupload",resload)
       }
     
      
       res.json({
            succes: "true",
             message: "File uploaded successfully try again",
            filename:resload.original_filename,
            filePreviewUrl: resload.url
          });
}catch(error){
    res.json(error);
}
})
router.delete('/delete/:id',authMiddleware,async (req,res)=>{
       try{
           const deltepdfdata = await Pdf.findById(req.params.id);
           console.log("deltepdf",deltepdfdata)
           const deltepdf = await deleteOnCloudinary(deltepdfdata.publicid);
           if(!deltepdf){
            res.json("not deelted");
           }
           const onmongodeelte = await Pdf.deleteOne({ _id: req.params.id});
           if(!onmongodeelte){
            console.log("no mongodele");
            res.json("no deletion")
           }
           else{
            console.log("deleted data",onmongodeelte);
            res.json("pdf deleted")
           }
       }
       catch(error){
        console.log("deelte error",error);
        res.json(error);
       }
})
module.exports = router;


