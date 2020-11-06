let express = require('express');
let router = express.Router();
let path = require('path');
const passport = require("passport");
const LocalStrategy = require("passport-local");
var flash = require("connect-flash");

let User = require("../models/user.model");

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');


router.use(require("express-session")({ 
    secret: "EarthScience", 
    resave: true, 
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
    res.render("admin_login", {  error : req.flash('error') });

}); 
   


router.post('/create', isLoggedIn, [

    // Data validation and sanitization
    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation error').trim().escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape(),
    body('email', 'Email must be valid').isEmail(),
    body('description').trim().optional({ checkFalsy: true }).escape(),

    (req, res, next) => {
        // collect any errors
        
        const errors = validationResult(req);

        // create new alumni
        let alumni = new Alumni ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gradYear: req.body.gradYear,
            degreeType: req.body.degreeType,
            occupation: req.body.occupation == '' ? 'N/A' : req.body.occupation,
            email: req.body.email,
            emailList: req.body.emailList,
            description: req.body.description,
            createdDate: new Date(),
            status: 'approved'
        });

        // check for errors
        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array());
        } else {
            // Success block
            // Save the new alumni into the database
            alumni.save(function (err) {
                if (err) { return next(err); }
                res.sendStatus(200);
            });
        }
    }
]); 


router.post('/:id/update', isLoggedIn,  [

    // Data validation and sanitization
    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation').trim().optional({ checkFalsy: true }).escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape(),
    body('email', 'Email must be valid').isEmail(),
    body('description').trim().optional({ checkFalsy: true }).escape(),

    (req, res, next) => {
        // collect any errors
        const errors = validationResult(req);

        // create new alumni
        let alumni = new Alumni ({
            _id: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gradYear: req.body.gradYear,
            degreeType: req.body.degreeType,
            occupation:  req.body.occupation == '' ? 'N/A' : req.body.occupation,
            email: req.body.email,
            emailList: req.body.emailList,
            description: req.body.description,
            status: 'approved'
        }); 

        // check for errors
        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array());
        } else {
            // Success block
            // instead of alumni.save use alumni.findByIDAndUpdate
            Alumni.findByIdAndUpdate(req.params.id, alumni, (err, result) => {
                    if (err) { return next(err); }
                    res.sendStatus(200);
            });
        }
    }
]);

router.delete('/:id/delete', isLoggedIn, (req, res, next) => {
    Alumni.findByIdAndRemove(req.params.id, function deleteAlumni(err) {
        if (err) { return next(err); }
        res.sendStatus(200);
    })
})

router.get('/dashboard', isLoggedIn, (req, res, next) => {
    Alumni.find({'status': 'approved'}).exec(function(err, alumni_list) {
        if (err) {return next(err);}
        res.render('admin_dashboard.pug', {title: 'Dashboard', stylesheet: '/styles/dashboard.css', alumni_list: alumni_list})
    })
});

router.get('/pending', isLoggedIn, (req, res, next) => {
    Alumni.find({'status': 'pending'}).exec((err, alumni_list) => {
        if (err) {return next(err);}
        res.render('pending_dashboard.pug', {title: 'Pending', stylesheet: '/styles/dashboard.css', alumni_list: alumni_list});
    });
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
    failureRedirect : '/admin/login',
    failureFlash : true
}));


//Handling user logout  
router.get("/logout", function (req, res) { 
    req.logout(); 
    res.sendFile(path.join(__dirname + '/../public/index.html'));
}); 
  
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('admin_login.pug');  
    } 

}
module.exports = router;

