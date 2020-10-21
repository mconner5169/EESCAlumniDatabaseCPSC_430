let userArgs = process.argv.slice(2);

let async = require('async');
let Alumni = require('../models/alumni');

let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let alumni = [];

function alumnusCreate(firstName, lastName, gradYear, occupation, degreeType, email, emailList, description, callback) {
    alumniInfo = {firstName: firstName, lastName: lastName, gradYear: gradYear, occupation: occupation, degreeType: degreeType, description: description, email: email, emailList: emailList};

    let alumnus = new Alumni(alumniInfo);

    alumnus.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('New Alumni: ' + alumnus);
        alumni.push(alumnus)
        callback(null, alumnus);
    })
}

function createAlumniEntries(callback) {
    async.series([
    function(callback) {
        alumnusCreate('John', 'Doe', 2018, 'Earth Job', 'BoS', 'JohnDoe@email.com' , true, null, callback);
    }
    ],
    callback
    );
}

async.series([
    createAlumniEntries
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});