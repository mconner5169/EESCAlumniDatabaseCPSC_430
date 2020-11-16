let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');


// Returns all approved alumni entries
router.get('/alumnis', (req, res, next) => {
    Alumni.find({'status': 'approved'}).exec(function(err, results) {
        if (err) {return next(err);}
        res.setHeader('content-type', 'application/json')
        res.json(results);
    });
});

// Returns all pending alumni entries
router.get('/alumnis/pending', (req, res, next) => {
    Alumni.find({'status': 'pending'}).exec(function(err, results) {
        if (err) {return next(err);}
        res.send(results);
    });
});

// Returns alumni entry 
router.get('/alumni/:id', (req, res, next) => {
    Alumni.findById(req.params.id).exec((err, result) => {
        if (err) {res.status(500);}
        res.status(200).send(result);
    });
})

router.get('/alumniByEmail/:email', (req, res, next) => {
    Alumni.findOne({'email': req.params.email}).exec((err, result) => {
        if (err) {res.status(500);}
        res.status(200).send(result);
    })
})

module.exports = router;