let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');

router.get('/alumnis', (req, res, next) => {
    Alumni.find().exec(function(err, results) {
        if (err) {return next(err);}
        console.log(results);
        res.send(results);
    });
});

module.exports = router;