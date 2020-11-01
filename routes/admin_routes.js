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
                res.sendStatus(200);
            });
        }
    }
]); 


router.post('/:id/update', [

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
            emailList: req.body.emailList == 'on' ? true : false,
            description: req.body.description,
            status: 'approved'
        });

        console.log(req.body.occupation)
        console.log(typeof req.body.occupation)

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

router.delete('/:id/delete', (req, res, next) => {
    Alumni.findByIdAndRemove(req.params.id, function deleteAlumni(err) {
        if (err) { return next(err); }
        res.sendStatus(200);
    })
})

router.get('/dashboard', (req, res, next) => {
    Alumni.find({'status': 'approved'}).exec(function(err, alumni_list) {
        if (err) {return next(err);}
        res.render('admin_dashboard.pug', {alumni_list: alumni_list})
    })
});

router.get('/pending', (req, res, next) => {
    Alumni.find({'status': 'pending'}).exec((err, alumni_list) => {
        if (err) {return next(err);}
        res.render('pending_dashboard.pug', {alumni_list: alumni_list});
    });
});




module.exports = router;

