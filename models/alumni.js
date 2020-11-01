var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlumniSchema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        gradYear: {type: Number, required: true},
        occupation: {type: String, default: 'N/A'},
        degreeType: {type: String, required: true},
        email: {type: String, required: true},
        emailList: {type: Boolean, required: true, default: false},
        description: String,
        status: {type: String, enum: ['approved', 'pending'], default: 'pending', required: true},
        createdDate: {type: Date, default: Date.now()}
    }
);

module.exports = mongoose.model('Alumni', AlumniSchema);