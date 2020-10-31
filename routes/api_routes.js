let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');

router.get('/alumnis', (req, res, next) => {
    Alumni.find({'status': 'approved'}).exec(function(err, results) {
        if (err) {return next(err);}
        res.send(results);
    });
});

router.get('/alumni/:id', (req, res, next) => {
    Alumni.findById(req.params.id).exec((err, result) => {
        if (err) {return next(err);}
        res.status(200).send(result);
    });
})

module.exports = router;