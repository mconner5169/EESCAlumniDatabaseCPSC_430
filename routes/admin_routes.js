let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');

// This method is currently never called. To be removed
router.get('/create', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_create.html'));
});

router.post('/create', [

    // Data validation and sanitization
    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation must be specified').trim().isLength({ min: 1}).escape(),
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
            occupation: req.body.occupation,
            email: req.body.email,
            emailList: req.body.emailList == 'on' ? true : false,
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
            });
        }
    }
]); 

// TODO: This entire method
router.post('/update', [

    // TODO: most of the code is the exact same from router.post(/create) using an array of callbacks. 
    // Start with sanitizing and validating. 
    // check for errors
    // create a new alumni. make sure to add _id:req.params.id or else a new id will be ceated everytime you update
    // instead of alumni.save use alumni.findByIDAndUpdate. example code

        /*  Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, thegenre) {
                if (err) { return next(err); }
                res.redirect(thegenre.url);
            });
        */


]);

router.get('/dashboard', (req, res, next) => {
    Alumni.find().exec(function(err, alumni_list) {
        if (err) {return next(err);}
        res.render('admin_dashboard', {alumni_list: alumni_list})
    })
});



module.exports = router;

