const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {type: String, required: true},
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema)

module.exports = User