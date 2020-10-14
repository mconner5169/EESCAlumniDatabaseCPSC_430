var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlumniSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        gradYear: {type: Number, required: true},
        occupation: {type: String, required: true},
        degreeType: {type: String, required: true},
        email: {type: String, required: true},
        emailList: {type: Boolean, required: true},
        description: String
    }
);

module.exports = mongoose.model('Alumni', AlumniSchema);

