let express = require('express');
let router = express.Router();
let path = require('path');
const bodyParser = require("body-parser");

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');

router.use(bodyParser.urlencoded({extended : true}));

// Returns all approved alumni entries
router.get('/alumnis', (req, res, next) => {
    let query = {};
    for(let key in req.query){ 
        if (Number.isNaN(parseInt(req.query[key]))) {
            if (key == 'email' || key == '_id') {
                req.query[key] !== "" ? query[key] = req.query[key] : null;
            } else {
                req.query[key] !== "" ? query[key] = {$regex: req.query[key]} : null;
            }
        } else {
            req.query[key] !== "" ? query[key] = {$eq: req.query[key]} : null;
        }
    }

    Alumni.find(query, (err, results) => {
        if (err) {return next(err);}
        res.setHeader('content-type', 'application/json')
        res.status(200).json(results)
    })
});

router.get('/alumniByEmail/:email', (req, res, next) => {
    Alumni.findOne({'email': req.params.email}).exec((err, result) => {
        if (err) {res.status(500);}
        res.status(200).send(result);
    })
})



module.exports = router;