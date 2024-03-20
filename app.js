const express=require('express');
const app=express();

const router=express.Router();
const dotenv=require("dotenv");
const bodyParser = require('body-parser');
const conn= require('./dbconfig');
const multer=require('multer');

const cookieParser=require('cookie-parser');
const session=require('express-session')



const User=require("./model/userSchema");
const contact= require('./model/contactSchema');
const productModel = require('./model/productSchema');

app.set('view engine','ejs');
app.use(express.static('Views'))
app.use(express.static('upload'))

// app.use(cookieParser());
// app.use(
//     session({
//         key:"user_sid",
//         secret:"somerandomstuffs",
//         resave:false,
//         saveUninitialized:false,
//         cookie:{
//             expires:60000,
//         },
//     })
// );
// app.use((req,res,next)=>{

//     if(req.cookies.user_id && !req.session.user){
//         res.clearCookie("user_sid");
//     }
//     next();
// });

// middle ware function to check for logged in users

// var sessionChecker = (req, res, next)=>{
//     if(req.session.user && req.cookies.user_sid){
//         res.redirect("/welcome");
//     }
//     else{
//         next();
//     }
// };


// session checker
// app.get('/' , sessionChecker, (req,res)=>{
//     // res.render('index');
//     res.redirect("/login")
// })

// router.post('/welcome' , async(req,res)=>{
//     var email=req.body.email,
//     password=req.body.password;
//     try{
//         let user= await User.findOne({email:email})
//         .exec();
//         if(!user){
//             res.redirect("/welcome");
//         }
      
//         req.session.user=user;
//         res.redirect("/welcome");

//     }catch(error){
//         console.log(error);
//     }
// });
// admin welcome page
// router.get('/index' , function(req,res){
//     if(req.session.user && req.cookies.user_sid){
//         User.find(function(err,data){
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 res.render('welcome' , {data:data});
//                 console.log(data);
//             }
//         });
//     }
//     else{
//         res.redirect("/login");
//     }
// });

// router.get('/welcome' , function(req,res){
//     if(req.session.user && req.cookies.user_sid){
//         User.find(function(err, data){
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 res.redirect('welcome' , {data:data});
//                 console.log(data);
//             }
//         });
//     }
//     else{
//         res.redirect("/welcome");
//     }

// });

dotenv.config({path:'./.env'});
app.use(bodyParser.urlencoded({extended:true}));

// router.get('/',function(req,res){
//     res.render('index');
// });

router.get('/' , async (req,res)=>{
    try{
        const veiwproductFronts=await productModel.find({});
        res.render('index' ,{veiwproductFronts: veiwproductFronts});

    }
    catch(err){
        console.log(err);
    }
});

router.get('/contact_us',function(req,res){
    res.render('contact_us');
});
router.get('/login',function(req,res){
    res.render('login');
});

router.get('/register',(req,res)=>{
    res.render('register');
});
router.get('/dashboard',function(req,res){
    res.render('dashboard/index');
});

router.get('/welcome',function(req,res){
    res.render('dashboard/welcome');
});
router.get('/addproduct',(req,res)=>{
    res.render('dashboard/addproduct');
});

router.post('/register',(req,res)=>{
    var user1=new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user1.save().then(()=>{
        console.log("user registered successfully...");
    })
    .catch((err)=>{
    console.log(err);
    });
});


router.post('/contact_us' , (req,res)=>{
    var user2=new contact({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    });
    user2.save().then(()=>{
        console.log("contact data saved...");
    })
    .catch((err)=>{
    console.log(err);
    });
});

const storage=multer.diskStorage({
    destination:function(req,file, cb){
        cb(null, './upload');
    },
    filename:function(req, file ,cb){
        cb(null , file.originalname);
        //cb(null , uuidv4() +'-'+ Date.now() + path.extname(file.originalname)) //Apending jpg

    }
});
 // to upload specific file

const fileFilter= (req,file , cb)=>{
    const allowedFileType=['image/jpeg' , 'image/jpg' , 'image/png' , 'image/webp'];
    if(allowedFileType.includes(file.mimetype)){
        cb(null , true);
    }
    else{
        cb(null, false)
    }

}

// upload file in add product
let upload=multer({storage , fileFilter});

router.post('/addproduct', upload.single('image') ,(req,res)=>{
    var pro=new productModel({
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        image:req.file.filename

    });
    pro.save().then(()=>{
        console.log("data product added");
    })
    .catch((err)=>{
    console.log(err);
    });
});

// get api's

router.get("/veiwregister",async(req,res)=>{
    try{
        const data= await User.find({});
        res.render('dashboard/veiwregister', {data:data});
        console.log(data);
    }catch(err){
        console.log(err);
    }
});

router.get("/viewcontact",async(req,res)=>{
    try{
        const contactdata=await contact.find({});
        res.render('dashboard/viewcontact', {contactdata:contactdata});
        console.log(contactdata);
    }catch(err){
        console.log(err);
    }
});

router.get("/veiwproduct",async(req,res)=>{
    try{
        const veiwproduct=await productModel.find({});
        res.render('dashboard/veiwproduct', {veiwproduct:veiwproduct});
        console.log(veiwproduct);
    }catch(err){
        console.log(err);
    }
});

//delete api for view register

router.get("/delete/:id", async (req,res)=>{
    try{
        const data=await User.findByIdAndRemove(req.params.id);
        res.redirect('/veiwregister');
    }
    catch(err){
        console.log(err);
    }
});
// delete api of view contact

router.get("/delete2/:id", async (req,res)=>{
    try{
        const cdata=await contact.findByIdAndRemove(req.params.id);
        res.redirect('/viewcontact');
    }
    catch(err){
        console.log(err);
    }
});
// delete api of view product

router.get("/deleteP/:id", async (req,res)=>{
    try{
        const pdata=await productModel.findByIdAndRemove(req.params.id);
        res.redirect('/veiwproduct');
    }
    catch(err){
        console.log(err);
    }
});
// edit of view product
router.get("/editP/:id", async (req,res)=>{  
    try{
        const pdata=await productModel.findById(req.params.id);
        console.log(pdata);
        res.render('dashboard/editformproduct',{pdata:pdata});
    }
    catch(err){
        console.log(err);
    }
});

//get api end

// update of view product 
router.post('/editP/:id' , async(req,res)=>{
    try{
        let updateP={
            name:req.body.name,
            price:req.body.price,
            description:req.body.description
        };
        let updateProduct=await productModel.findByIdAndUpdate(req.params.id , updateP);
        console.log(updateProduct);
        res.redirect('/veiwproduct');
    }
    catch(err){
        console.log(err);
    }
});

// end of edit api of view product

router.get("/edit/:id", async (req,res)=>{  
    try{
        const editdata=await User.findById(req.params.id);
        console.log(editdata);
        res.render('dashboard/editform',{editdata:editdata});
    }
    catch(err){
        console.log(err);
    }
});
// update of view product 
router.post('/edit/:id' , async(req,res)=>{
    try{
        let updatedata={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        };
        let updateRegister=await User.findByIdAndUpdate(req.params.id , updatedata);
        console.log(updateRegister);
        res.redirect('/veiwregister');
    }
    catch(err){
        console.log(err);
    }
});
// edit of view contact
router.get("/edit2/:id", async (req,res)=>{  
    try{
        const edata=await contact.findById(req.params.id);
        console.log(edata);
        res.render('dashboard/editform2',{edata:edata});
    }
    catch(err){
        console.log(err);
    }
});
// update off view contact
router.post('/edit2/:id' , async(req,res)=>{
    try{
        let udata={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone
        };
        let updateContact=await contact.findByIdAndUpdate(req.params.id , udata);
        console.log(updateContact);
        res.redirect('/viewcontact');
    }
    catch(err){
        console.log(err);
    }
});

//login

// router.post('/login' ,async (req,res)=>{
//     var email=req.body.email;
//     password=req.body.password;

//     try{
//         var user=await User.findOne({email:email})
//         .exec();
//         console.log(user);
//         if(!user){
//             res.redirect('/login');
//         }
//         res.redirect('/register');
//     }
//     catch(error){
//         console.log(error)
//     }
// });

// login for dashboard
router.post('/dashboard' ,async (req,res)=>{
    var email=req.body.email;
    password=req.body.password;

    try{
        var user=await User.findOne({email:email})
        .exec();
        console.log(user);
        if(!user){
            res.redirect('/dashboard');
        }
        res.redirect('/welcome');
    }
    catch(error){
        console.log(error)
    }
});

// new page for specific registraion
router.get('/detail/:id' , async(req,res)=>{
    try{
    const rdetail= await productModel.findById(req.params.id);
    res.render('detail' , {productd:productd});
    }
    catch(err){
        console.log(err);
    }
});

app.use('/',router); 

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>console.log(`listen on ${PORT}`)   )

