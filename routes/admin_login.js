const router = require('express').Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
var flash = require("connect-flash");

let User = require("../models/user.model");
let path = require('path');



//let { body, validationResult } = require('express-validator');

router.use(require("express-session")({ 
    secret: "EarthScience", 
    resave: false, 
    saveUninitialized: true,
})); 
router.use(flash());
router.use(passport.initialize()); 
router.use(passport.session()); 


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 



router.use((req, res, next) => {
    res.locals.errorMsg = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
  });

router.get("/login", (req, res, next) => { 
    res.render("login", {  error : req.flash('error') });

}); 
   
router.get("/secret", isLoggedIn, function (req, res) { 
    res.render("/admin/dashboard"); 
}); 
  
// Register an Admin
/*
var username = "admin"
var password = "EarthScience"  
  User.register(new User({ username : username, password: password}), password)
  */
   
//Handling user login 


router.post('/login', passport.authenticate('local', {
    successRedirect : '/admin/dashboard',
    failureRedirect : '/login',
    failureFlash : true
}));


//Handling user logout  
router.get("/logout", function (req, res) { 
    req.logout(); 
    res.sendFile(path.join(__dirname + '/../public/index.html'));
}); 
  
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) return next(); 
    
} 
module.exports = router;