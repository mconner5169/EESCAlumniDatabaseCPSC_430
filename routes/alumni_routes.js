let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');


router.get('/form', (request, response, next) => {
    response.sendFile(path.join(__dirname + '/../public/alumni_create.html'));
});

router.post('/form', [

    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation must be specified').trim().isLength({ min: 1}).escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape().isEmail(),
    body('email-confirm').trim().isLength({ min: 1}).escape().isEmail().custom((value, { req }) => {
        if (value !== req.body.email) {
            throw new Error('Email confirmation does not match email');
        }
        return true;
    }),
    body('description').trim().optional({ checkFalsy: true }).escape(),
    body('emailList'),

    (request, response, next) => {

        const errors = validationResult(request);

        let alumni = new Alumni ({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            gradYear: request.body.gradYear,
            degreeType: request.body.degreeType,
            occupation: request.body.occupation,
            email: request.body.email,
            emailList: request.body.emailList == 'on' ? true : false,
            description: request.body.description,
            createdDate: new Date(),
            status: 'pending'
        });

        if (!errors.isEmpty()) {
            // Error block
            response.sendFile(path.join(__dirname + '/../public/alumni_create.html'));
        } else {
            // Success block
            alumni.save(function (err) {
                if (err) { return next(err); }
                response.sendFile(path.join(__dirname + '/../public/alumni_create_success.html'));
            });
        }
    }
]); 

router.get('/status', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_status.html'));
});

router.get('/mainmenu', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_options.html'));
});

router.get('/contact', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/contact_admin.html'));
});
module.exports = router;